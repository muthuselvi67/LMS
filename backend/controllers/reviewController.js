const { query } = require('../config/db');

// Helper to recalculate course rating
const updateCourseAvgRating = async (courseId) => {
  const [avgResult] = await query(
    'SELECT AVG(rating) AS avgRating FROM reviews WHERE course_id = ?',
    [courseId]
  );
  const avg = avgResult && avgResult.avgRating ? Number(avgResult.avgRating).toFixed(1) : 4.8;
  await query('UPDATE courses SET rating = ? WHERE id = ?', [avg, courseId]);
};

// @route GET /api/reviews/:courseId
const getReviewsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const reviews = await query(`
      SELECT 
        r.id,
        r.course_id,
        r.user_id,
        r.rating,
        r.comment,
        r.created_at,
        u.name AS user_name,
        u.avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.course_id = ?
      ORDER BY r.created_at DESC
    `, [courseId]);

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        reviews,
        totalReviews,
        avgRating: Number(avgRating)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { courseId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!courseId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Course ID, rating (1-5), and comment are required.'
      });
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.'
      });
    }

    // Check enrollment
    const enrollment = await query(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollment.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to submit a review.'
      });
    }

    // Insert or update review
    await query(`
      INSERT INTO reviews (user_id, course_id, rating, comment)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), created_at = NOW()
    `, [userId, courseId, ratingNum, comment.trim()]);

    await updateCourseAvgRating(courseId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/reviews/:id
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const reviews = await query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (reviews.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const review = reviews[0];
    if (review.user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this review.' });
    }

    await query('UPDATE reviews SET rating = COALESCE(?, rating), comment = COALESCE(?, comment) WHERE id = ?', [
      rating ? parseInt(rating, 10) : null,
      comment ? comment.trim() : null,
      id
    ]);

    await updateCourseAvgRating(review.course_id);

    res.json({
      success: true,
      message: 'Review updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const reviews = await query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (reviews.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const review = reviews[0];
    if (review.user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review.' });
    }

    await query('DELETE FROM reviews WHERE id = ?', [id]);
    await updateCourseAvgRating(review.course_id);

    res.json({
      success: true,
      message: 'Review deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/reviews/admin/all (Admin view all reviews)
const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await query(`
      SELECT 
        r.*,
        u.name AS user_name,
        u.email AS user_email,
        c.title AS course_title
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN courses c ON r.course_id = c.id
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviewsByCourse,
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsAdmin
};
