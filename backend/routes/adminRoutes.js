const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllStudents,
  getStudentDetails,
  getAllEnrollments
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware, adminMiddleware);

router.get('/stats', getDashboardStats);
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentDetails);
router.get('/enrollments', getAllEnrollments);

module.exports = router;
