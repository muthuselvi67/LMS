const { query } = require('../config/db');

// Helper to generate Certificate ID (e.g. LL-2026-XXXXX)
const generateCertificateId = (courseId, userId) => {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `LL-${year}-C${courseId}U${userId}-${rand}`;
};

// @route POST /api/progress (Toggle / Mark complete)
const markLessonProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId, completed = true } = req.body;
    const userId = req.user.id;

    if (!courseId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and Lesson ID are required.'
      });
    }

    // Ensure enrollment exists
    let enrollments = await query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollments.length === 0) {
      // Auto-enroll if not already
      await query(
        'INSERT INTO enrollments (user_id, course_id, status) VALUES (?, ?, ?)',
        [userId, courseId, 'in_progress']
      );
      await query('UPDATE courses SET total_students = total_students + 1 WHERE id = ?', [courseId]);
    }

    if (completed) {
      await query(`
        INSERT INTO lesson_progress (user_id, course_id, lesson_id, completed, completed_at)
        VALUES (?, ?, ?, 1, NOW())
        ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()
      `, [userId, courseId, lessonId]);
    } else {
      await query(`
        UPDATE lesson_progress SET completed = 0 WHERE user_id = ? AND course_id = ? AND lesson_id = ?
      `, [userId, courseId, lessonId]);
    }

    // Calculate total lessons and completed lessons
    const [totalLessonsResult] = await query(
      'SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?',
      [courseId]
    );
    const [completedLessonsResult] = await query(
      'SELECT COUNT(*) AS completed FROM lesson_progress WHERE user_id = ? AND course_id = ? AND completed = 1',
      [userId, courseId]
    );

    const totalLessons = totalLessonsResult ? totalLessonsResult.total : 0;
    const completedLessons = completedLessonsResult ? completedLessonsResult.completed : 0;
    const progressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0;

    let isCompletedCourse = false;
    let certificate = null;

    if (progressPercent === 100 && totalLessons > 0) {
      isCompletedCourse = true;
      // Mark enrollment as completed
      await query(`
        UPDATE enrollments 
        SET status = 'completed', completed_at = NOW() 
        WHERE user_id = ? AND course_id = ?
      `, [userId, courseId]);

      // Check / generate certificate
      const existingCert = await query(
        'SELECT * FROM certificates WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );

      if (existingCert.length === 0) {
        const certId = generateCertificateId(courseId, userId);
        const certResult = await query(`
          INSERT INTO certificates (user_id, course_id, certificate_id, completion_date)
          VALUES (?, ?, ?, CURDATE())
        `, [userId, courseId, certId]);

        certificate = {
          id: certResult.insertId,
          certificate_id: certId,
          completion_date: new Date().toISOString().split('T')[0]
        };
      } else {
        certificate = existingCert[0];
      }
    } else if (progressPercent > 0) {
      await query(`
        UPDATE enrollments SET status = 'in_progress' WHERE user_id = ? AND course_id = ? AND status = 'enrolled'
      `, [userId, courseId]);
    }

    res.json({
      success: true,
      message: completed ? 'Lesson marked as completed.' : 'Lesson progress updated.',
      data: {
        lessonId,
        completed,
        totalLessons,
        completedLessons,
        progress: progressPercent,
        isCompletedCourse,
        certificate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/progress/:courseId
const getProgressByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const [totalResult] = await query('SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?', [courseId]);
    const completedRows = await query(
      'SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND course_id = ? AND completed = 1',
      [userId, courseId]
    );

    const totalLessons = totalResult ? totalResult.total : 0;
    const completedLessonIds = completedRows.map(r => r.lesson_id);
    const completedLessons = completedLessonIds.length;
    const progressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0;

    // Check certificate
    const certRows = await query(
      'SELECT * FROM certificates WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    res.json({
      success: true,
      data: {
        courseId: Number(courseId),
        totalLessons,
        completedLessons,
        progress: progressPercent,
        completedLessonIds,
        certificate: certRows.length > 0 ? certRows[0] : null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markLessonProgress,
  getProgressByCourse
};
