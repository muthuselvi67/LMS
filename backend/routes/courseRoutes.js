const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Optional auth helper for course details
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'learnlike_secret_key');
      req.user = decoded;
    } catch (e) {
      // Ignore token verification errors for public route
    }
  }
  next();
};

router.get('/', getCourses);
router.get('/:id', optionalAuth, getCourseById);
router.post('/', authMiddleware, adminMiddleware, createCourse);
router.put('/:id', authMiddleware, adminMiddleware, updateCourse);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourse);

module.exports = router;
