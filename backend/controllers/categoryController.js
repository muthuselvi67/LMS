const { query } = require('../config/db');

// @route GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await query(`
      SELECT c.*, COUNT(co.id) AS course_count
      FROM categories c
      LEFT JOIN courses co ON c.id = co.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/categories (Admin)
const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = await query(
      'INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)',
      [name.trim(), slug, description || '', icon || 'Folder']
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: { id: result.insertId, name, slug, description, icon }
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/categories/:id (Admin)
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await query(
      'UPDATE categories SET name = ?, slug = ?, description = ?, icon = ? WHERE id = ?',
      [name.trim(), slug, description || '', icon || 'Folder', id]
    );

    res.json({
      success: true,
      message: 'Category updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/categories/:id (Admin)
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
