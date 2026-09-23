const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'learnlike_secret_key');
      req.user = decoded;
    } catch (e) {}
  }
  next();
};

router.get('/course/:courseId', optionalAuth, getLessonsByCourse);
router.post('/', authMiddleware, adminMiddleware, createLesson);
router.put('/:id', authMiddleware, adminMiddleware, updateLesson);
router.delete('/:id', authMiddleware, adminMiddleware, deleteLesson);

module.exports = router;
