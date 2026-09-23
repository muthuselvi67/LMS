const express = require('express');
const router = express.Router();
const {
  getResourcesByCourse,
  getStudentDownloads,
  getAllResourcesAdmin,
  uploadResource,
  downloadResource,
  deleteResource
} = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const uploadPDF = require('../middleware/uploadMiddleware');

router.get('/downloads', authMiddleware, getStudentDownloads);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllResourcesAdmin);
router.get('/course/:courseId', authMiddleware, getResourcesByCourse);
router.get('/download/:id', authMiddleware, downloadResource);
router.post('/upload', authMiddleware, adminMiddleware, uploadPDF.single('pdfFile'), uploadResource);
router.delete('/:id', authMiddleware, adminMiddleware, deleteResource);

module.exports = router;
