const express = require('express');
const router = express.Router();
const {
  markLessonProgress,
  getProgressByCourse
} = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, markLessonProgress);
router.get('/:courseId', authMiddleware, getProgressByCourse);

module.exports = router;
