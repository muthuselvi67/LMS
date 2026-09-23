const { query } = require('../config/db');

const generateCertificateId = (courseId, userId) => {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `LL-${year}-C${courseId}U${userId}-${rand}`;
};

// @route GET /api/certificates
const getMyCertificates = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const certificates = await query(`
      SELECT 
        cert.*,
        c.title AS course_title,
        c.thumbnail AS course_thumbnail,
        c.instructor,
        c.duration,
        u.name AS student_name,
        u.email AS student_email
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.user_id = ?
      ORDER BY cert.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/certificates/:courseId
const getCertificateByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const certs = await query(`
      SELECT 
        cert.*,
        c.title AS course_title,
        c.instructor,
        u.name AS student_name
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.user_id = ? AND cert.course_id = ?
    `, [userId, courseId]);

    if (certs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No certificate found for this course.'
      });
    }

    res.json({
      success: true,
      data: certs[0]
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/certificates/generate
const generateCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required.' });
    }

    // Check if certificate already exists
    const existing = await query(
      'SELECT * FROM certificates WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (existing.length > 0) {
      return res.json({
        success: true,
        message: 'Certificate already generated.',
        data: existing[0]
      });
    }

    // Verify all lessons are completed
    const [totalLessonsResult] = await query('SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?', [courseId]);
    const [completedResult] = await query(
      'SELECT COUNT(*) AS completed FROM lesson_progress WHERE user_id = ? AND course_id = ? AND completed = 1',
      [userId, courseId]
    );

    const total = totalLessonsResult ? totalLessonsResult.total : 0;
    const completed = completedResult ? completedResult.completed : 0;

    if (total === 0 || completed < total) {
      return res.status(400).json({
        success: false,
        message: `Cannot generate certificate. You have completed ${completed} of ${total} lessons. All lessons must be completed.`
      });
    }

    const certId = generateCertificateId(courseId, userId);

    const result = await query(`
      INSERT INTO certificates (user_id, course_id, certificate_id, completion_date)
      VALUES (?, ?, ?, CURDATE())
    `, [userId, courseId, certId]);

    // Update enrollment status
    await query(`
      UPDATE enrollments SET status = 'completed', completed_at = NOW()
      WHERE user_id = ? AND course_id = ?
    `, [userId, courseId]);

    const newCert = await query(`
      SELECT 
        cert.*,
        c.title AS course_title,
        c.instructor,
        u.name AS student_name
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Certificate of completion generated successfully!',
      data: newCert[0]
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/certificates/admin/all (Admin view)
const getAllCertificatesAdmin = async (req, res, next) => {
  try {
    const certs = await query(`
      SELECT 
        cert.*,
        c.title AS course_title,
        u.name AS student_name,
        u.email AS student_email
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      ORDER BY cert.created_at DESC
    `);

    res.json({
      success: true,
      data: certs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCertificates,
  getCertificateByCourse,
  generateCertificate,
  getAllCertificatesAdmin
};
