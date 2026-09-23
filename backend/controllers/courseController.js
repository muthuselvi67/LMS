const { query } = require('../config/db');

// @route GET /api/courses
const getCourses = async (req, res, next) => {
  try {
    const { search, category, level, price, sort } = req.query;

    let sql = `
      SELECT 
        c.*,
        cat.name AS category_name,
        cat.slug AS category_slug,
        COUNT(DISTINCT l.id) AS total_lessons,
        COUNT(DISTINCT r.id) AS total_reviews,
        COALESCE(AVG(r.rating), c.rating) AS avg_rating
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN lessons l ON c.id = l.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE 1=1
    `;
    const params = [];

    // Search filter (Course title, instructor, category)
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      sql += ` AND (c.title LIKE ? OR c.instructor LIKE ? OR cat.name LIKE ? OR c.description LIKE ?)`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (category && category !== 'all') {
      if (isNaN(category)) {
        sql += ` AND cat.slug = ?`;
        params.push(category);
      } else {
        sql += ` AND c.category_id = ?`;
        params.push(category);
      }
    }

    // Level filter
    if (level && level !== 'all') {
      sql += ` AND c.level = ?`;
      params.push(level);
    }

    // Price filter (free, paid)
    if (price === 'free') {
      sql += ` AND (c.price = 0 OR c.is_free = 1)`;
    } else if (price === 'paid') {
      sql += ` AND (c.price > 0 AND c.is_free = 0)`;
    }

    sql += ` GROUP BY c.id`;

    // Sorting
    if (sort === 'popular') {
      sql += ` ORDER BY c.total_students DESC, c.id DESC`;
    } else if (sort === 'rating') {
      sql += ` ORDER BY avg_rating DESC, c.id DESC`;
    } else if (sort === 'price-low') {
      sql += ` ORDER BY c.price ASC`;
    } else if (sort === 'price-high') {
      sql += ` ORDER BY c.price DESC`;
    } else {
      // Default: newest
      sql += ` ORDER BY c.created_at DESC, c.id DESC`;
    }

    const courses = await query(sql, params);

    // Format JSON fields if returned as string
    const formatted = courses.map((course) => ({
      ...course,
      what_you_will_learn: typeof course.what_you_will_learn === 'string' ? JSON.parse(course.what_you_will_learn || '[]') : (course.what_you_will_learn || []),
      requirements: typeof course.requirements === 'string' ? JSON.parse(course.requirements || '[]') : (course.requirements || []),
      avg_rating: Number(course.avg_rating || course.rating || 4.8).toFixed(1)
    }));

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/courses/:id
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Course info
    const courses = await query(`
      SELECT 
        c.*,
        cat.name AS category_name,
        cat.slug AS category_slug,
        COUNT(DISTINCT l.id) AS total_lessons
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN lessons l ON c.id = l.course_id
      WHERE c.id = ? OR c.slug = ?
      GROUP BY c.id
    `, [id, id]);

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const course = courses[0];
    course.what_you_will_learn = typeof course.what_you_will_learn === 'string' ? JSON.parse(course.what_you_will_learn || '[]') : (course.what_you_will_learn || []);
    course.requirements = typeof course.requirements === 'string' ? JSON.parse(course.requirements || '[]') : (course.requirements || []);

    // Fetch lessons organized by section
    const lessons = await query(`
      SELECT id, course_id, section_name, title, description, video_url, duration, lesson_order
      FROM lessons
      WHERE course_id = ?
      ORDER BY lesson_order ASC, id ASC
    `, [course.id]);

    // Fetch reviews
    const reviews = await query(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name, u.avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.course_id = ?
      ORDER BY r.created_at DESC
    `, [course.id]);

    // Fetch PDF resources
    const resources = await query(`
      SELECT id, title, file_name, file_path, file_size, uploaded_at
      FROM resources
      WHERE course_id = ?
      ORDER BY id ASC
    `, [course.id]);

    // Check enrollment status if user is logged in
    let isEnrolled = false;
    let enrollmentData = null;
    let completedLessons = [];

    if (req.user) {
      const enrollment = await query(
        'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
        [req.user.id, course.id]
      );
      if (enrollment.length > 0) {
        isEnrolled = true;
        enrollmentData = enrollment[0];

        const progress = await query(
          'SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND course_id = ? AND completed = 1',
          [req.user.id, course.id]
        );
        completedLessons = progress.map(p => p.lesson_id);
      }
    }

    // Calculate rating stats
    const avgRating = reviews.length > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
      : course.rating;

    res.json({
      success: true,
      data: {
        ...course,
        avg_rating: Number(avgRating),
        total_reviews: reviews.length,
        lessons,
        reviews,
        resources,
        isEnrolled,
        enrollment: enrollmentData,
        completedLessons
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/courses (Admin)
const createCourse = async (req, res, next) => {
  try {
    const {
      category_id,
      title,
      description,
      short_description,
      thumbnail,
      instructor,
      level,
      duration,
      price,
      is_free,
      what_you_will_learn,
      requirements
    } = req.body;

    if (!title || !category_id || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and description are required.'
      });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const learnJson = JSON.stringify(Array.isArray(what_you_will_learn) ? what_you_will_learn : (what_you_will_learn ? [what_you_will_learn] : []));
    const reqJson = JSON.stringify(Array.isArray(requirements) ? requirements : (requirements ? [requirements] : []));

    const result = await query(`
      INSERT INTO courses (
        category_id, title, slug, description, short_description, thumbnail,
        instructor, level, duration, price, is_free, what_you_will_learn, requirements
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      category_id,
      title.trim(),
      slug,
      description,
      short_description || description.substring(0, 150),
      thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      instructor || 'Learnlike Instructor',
      level || 'Beginner',
      duration || '10 Hours',
      price || 0.00,
      is_free !== undefined ? is_free : (price == 0 ? 1 : 0),
      learnJson,
      reqJson
    ]);

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: { id: result.insertId, title, slug }
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/courses/:id (Admin)
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      title,
      description,
      short_description,
      thumbnail,
      instructor,
      level,
      duration,
      price,
      is_free,
      what_you_will_learn,
      requirements
    } = req.body;

    const learnJson = what_you_will_learn ? JSON.stringify(Array.isArray(what_you_will_learn) ? what_you_will_learn : [what_you_will_learn]) : undefined;
    const reqJson = requirements ? JSON.stringify(Array.isArray(requirements) ? requirements : [requirements]) : undefined;

    await query(`
      UPDATE courses SET
        category_id = COALESCE(?, category_id),
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        short_description = COALESCE(?, short_description),
        thumbnail = COALESCE(?, thumbnail),
        instructor = COALESCE(?, instructor),
        level = COALESCE(?, level),
        duration = COALESCE(?, duration),
        price = COALESCE(?, price),
        is_free = COALESCE(?, is_free),
        what_you_will_learn = COALESCE(?, what_you_will_learn),
        requirements = COALESCE(?, requirements)
      WHERE id = ?
    `, [
      category_id || null,
      title || null,
      description || null,
      short_description || null,
      thumbnail || null,
      instructor || null,
      level || null,
      duration || null,
      price !== undefined ? price : null,
      is_free !== undefined ? is_free : null,
      learnJson || null,
      reqJson || null,
      id
    ]);

    res.json({
      success: true,
      message: 'Course updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/courses/:id (Admin)
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM courses WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Course deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
