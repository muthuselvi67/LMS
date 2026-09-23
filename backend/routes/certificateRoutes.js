const express = require('express');
const router = express.Router();
const {
  getMyCertificates,
  getCertificateByCourse,
  generateCertificate,
  getAllCertificatesAdmin
} = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, getMyCertificates);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllCertificatesAdmin);
router.get('/:courseId', authMiddleware, getCertificateByCourse);
router.post('/generate', authMiddleware, generateCertificate);

module.exports = router;
