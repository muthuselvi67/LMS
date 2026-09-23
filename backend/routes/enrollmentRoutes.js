const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrolledCourses,
  getEnrollmentByCourse
} = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, enrollInCourse);
router.get('/my-courses', authMiddleware, getMyEnrolledCourses);
router.get('/:courseId', authMiddleware, getEnrollmentByCourse);

module.exports = router;
