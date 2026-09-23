const { query } = require('../config/db');

// @route POST /api/enrollments
const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required.'
      });
    }

    // Check if already enrolled
    const existing = await query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course.',
        data: existing[0]
      });
    }

    // Verify course exists
    const course = await query('SELECT id, title FROM courses WHERE id = ?', [courseId]);
    if (course.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    // Create enrollment
    const result = await query(
      'INSERT INTO enrollments (user_id, course_id, status) VALUES (?, ?, ?)',
      [userId, courseId, 'enrolled']
    );

    // Increment course total_students
    await query('UPDATE courses SET total_students = total_students + 1 WHERE id = ?', [courseId]);

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course!',
      data: {
        id: result.insertId,
        user_id: userId,
        course_id: courseId,
        status: 'enrolled'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/enrollments/my-courses
const getMyEnrolledCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        e.id AS enrollment_id,
        e.status AS enrollment_status,
        e.enrolled_at,
        e.completed_at,
        c.id,
        c.title,
        c.slug,
        c.thumbnail,
        c.instructor,
        c.level,
        c.duration,
        cat.name AS category_name,
        COUNT(DISTINCT l.id) AS total_lessons,
        COUNT(DISTINCT lp.lesson_id) AS completed_lessons
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN lessons l ON c.id = l.course_id
      LEFT JOIN lesson_progress lp ON lp.user_id = e.user_id AND lp.course_id = c.id AND lp.completed = 1
      WHERE e.user_id = ?
      GROUP BY e.id, c.id
      ORDER BY e.enrolled_at DESC
    `;

    const courses = await query(sql, [userId]);

    const formatted = courses.map(course => {
      const total = Number(course.total_lessons) || 0;
      const completed = Number(course.completed_lessons) || 0;
      const progressPercent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

      return {
        ...course,
        total_lessons: total,
        completed_lessons: completed,
        progress: progressPercent
      };
    });

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/enrollments/:courseId
const getEnrollmentByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollments = await query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollments.length === 0) {
      return res.json({
        success: true,
        data: { isEnrolled: false }
      });
    }

    res.json({
      success: true,
      data: {
        isEnrolled: true,
        enrollment: enrollments[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrolledCourses,
  getEnrollmentByCourse
};
