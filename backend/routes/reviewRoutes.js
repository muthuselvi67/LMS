const express = require('express');
const router = express.Router();
const {
  getReviewsByCourse,
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsAdmin
} = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/course/:courseId', getReviewsByCourse);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllReviewsAdmin);
router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
