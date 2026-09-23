const { query } = require('../config/db');

// @route GET /api/admin/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [studentsResult] = await query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
    const [coursesResult] = await query('SELECT COUNT(*) AS total FROM courses');
    const [enrollmentsResult] = await query('SELECT COUNT(*) AS total FROM enrollments');
    const [completedResult] = await query("SELECT COUNT(*) AS total FROM enrollments WHERE status = 'completed'");
    const [resourcesResult] = await query('SELECT COUNT(*) AS total FROM resources');
    const [reviewsResult] = await query('SELECT COUNT(*) AS total FROM reviews');
    const [certificatesResult] = await query('SELECT COUNT(*) AS total FROM certificates');

    // Recent enrollments
    const recentEnrollments = await query(`
      SELECT 
        e.id,
        e.status,
        e.enrolled_at,
        u.name AS student_name,
        u.email AS student_email,
        c.title AS course_title
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.enrolled_at DESC
      LIMIT 6
    `);

    // Category breakdown
    const categoryStats = await query(`
      SELECT 
        cat.name,
        COUNT(c.id) AS course_count,
        COALESCE(SUM(c.total_students), 0) AS total_students
      FROM categories cat
      LEFT JOIN courses c ON cat.id = c.category_id
      GROUP BY cat.id
    `);

    res.json({
      success: true,
      data: {
        totalStudents: studentsResult.total || 0,
        totalCourses: coursesResult.total || 0,
        totalEnrollments: enrollmentsResult.total || 0,
        completedCourses: completedResult.total || 0,
        totalResources: resourcesResult.total || 0,
        totalReviews: reviewsResult.total || 0,
        totalCertificates: certificatesResult.total || 0,
        recentEnrollments,
        categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/admin/students
const getAllStudents = async (req, res, next) => {
  try {
    const students = await query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at AS joined_date,
        COUNT(DISTINCT e.id) AS enrolled_courses,
        COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.id END) AS completed_courses,
        COUNT(DISTINCT cert.id) AS certificates_earned
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      LEFT JOIN certificates cert ON u.id = cert.user_id
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/admin/students/:id
const getStudentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const users = await query(
      'SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ? AND role = "student"',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const student = users[0];

    const enrollments = await query(`
      SELECT 
        e.id AS enrollment_id,
        e.status,
        e.enrolled_at,
        e.completed_at,
        c.id AS course_id,
        c.title AS course_title,
        c.thumbnail,
        COUNT(DISTINCT l.id) AS total_lessons,
        COUNT(DISTINCT lp.lesson_id) AS completed_lessons
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN lessons l ON c.id = l.course_id
      LEFT JOIN lesson_progress lp ON lp.user_id = e.user_id AND lp.course_id = c.id AND lp.completed = 1
      WHERE e.user_id = ?
      GROUP BY e.id, c.id
      ORDER BY e.enrolled_at DESC
    `, [id]);

    const certificates = await query(`
      SELECT cert.*, c.title AS course_title
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      WHERE cert.user_id = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        student,
        enrollments,
        certificates
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/admin/enrollments
const getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await query(`
      SELECT 
        e.id,
        e.status,
        e.enrolled_at,
        e.completed_at,
        u.id AS user_id,
        u.name AS student_name,
        u.email AS student_email,
        c.id AS course_id,
        c.title AS course_title,
        c.thumbnail AS course_thumbnail
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.enrolled_at DESC
    `);

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllStudents,
  getStudentDetails,
  getAllEnrollments
};
