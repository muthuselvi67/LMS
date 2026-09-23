const { query } = require('../config/db');

// @route GET /api/courses/:courseId/lessons
const getLessonsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const lessons = await query(`
      SELECT l.*
      FROM lessons l
      WHERE l.course_id = ?
      ORDER BY l.lesson_order ASC, l.id ASC
    `, [courseId]);

    let completedLessonIds = [];
    if (req.user) {
      const progress = await query(
        'SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND course_id = ? AND completed = 1',
        [req.user.id, courseId]
      );
      completedLessonIds = progress.map(p => p.lesson_id);
    }

    const lessonsWithStatus = lessons.map(lesson => ({
      ...lesson,
      isCompleted: completedLessonIds.includes(lesson.id)
    }));

    res.json({
      success: true,
      data: lessonsWithStatus
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/lessons (Admin)
const createLesson = async (req, res, next) => {
  try {
    const { course_id, section_name, title, description, video_url, duration, lesson_order } = req.body;

    if (!course_id || !title) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and Lesson Title are required.'
      });
    }

    const result = await query(`
      INSERT INTO lessons (course_id, section_name, title, description, video_url, duration, lesson_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      course_id,
      section_name || 'Section 1 - Introduction',
      title.trim(),
      description || '',
      video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration || '15 mins',
      lesson_order || 1
    ]);

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully.',
      data: { id: result.insertId, course_id, title }
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/lessons/:id (Admin)
const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { section_name, title, description, video_url, duration, lesson_order } = req.body;

    await query(`
      UPDATE lessons SET
        section_name = COALESCE(?, section_name),
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        video_url = COALESCE(?, video_url),
        duration = COALESCE(?, duration),
        lesson_order = COALESCE(?, lesson_order)
      WHERE id = ?
    `, [
      section_name || null,
      title || null,
      description || null,
      video_url || null,
      duration || null,
      lesson_order || null,
      id
    ]);

    res.json({
      success: true,
      message: 'Lesson updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/lessons/:id (Admin)
const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM lessons WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Lesson deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson
};
