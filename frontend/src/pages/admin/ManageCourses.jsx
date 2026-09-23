import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService, categoryService } from '../../services/courseService';
import { Modal } from '../../components/Modal';
import { Plus, Edit2, Trash2, Eye, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    description: '',
    short_description: '',
    thumbnail: '',
    instructor: 'Learnlike Instructor',
    level: 'Beginner',
    duration: '10 Hours',
    price: 0,
    is_free: 1
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCoursesAndCategories();
  }, []);

  const fetchCoursesAndCategories = async () => {
    setLoading(true);
    try {
      const [cRes, catRes] = await Promise.all([
        courseService.getCourses(),
        categoryService.getCategories()
      ]);
      if (cRes.success) setCourses(cRes.data);
      if (catRes.success) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !formData.category_id) {
          setFormData(prev => ({ ...prev, category_id: catRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      category_id: categories[0]?.id || '',
      description: '',
      short_description: '',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      instructor: 'Learnlike Instructor',
      level: 'Beginner',
      duration: '10 Hours',
      price: 0,
      is_free: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      category_id: course.category_id,
      description: course.description,
      short_description: course.short_description || '',
      thumbnail: course.thumbnail || '',
      instructor: course.instructor || 'Learnlike Instructor',
      level: course.level || 'Beginner',
      duration: course.duration || '10 Hours',
      price: course.price || 0,
      is_free: course.is_free ? 1 : 0
    });
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course and all associated lessons?')) {
      return;
    }

    try {
      const res = await courseService.deleteCourse(id);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Course deleted successfully.' });
        fetchCoursesAndCategories();
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to delete course.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      if (editingCourse) {
        const res = await courseService.updateCourse(editingCourse.id, formData);
        if (res.success) {
          setFeedback({ type: 'success', message: 'Course updated successfully!' });
          setIsModalOpen(false);
          fetchCoursesAndCategories();
        }
      } else {
        const res = await courseService.createCourse(formData);
        if (res.success) {
          setFeedback({ type: 'success', message: 'Course created successfully!' });
          setIsModalOpen(false);
          fetchCoursesAndCategories();
        }
      }
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Operation failed.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Course Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Create, edit, manage and publish courses in the LMS catalog
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> Add New Course
        </button>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <div>{feedback.message}</div>
        </div>
      )}

      {/* Courses List Table */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading course catalog...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Course</th>
                  <th style={{ padding: '0.75rem' }}>Category</th>
                  <th style={{ padding: '0.75rem' }}>Level</th>
                  <th style={{ padding: '0.75rem' }}>Instructor</th>
                  <th style={{ padding: '0.75rem' }}>Lessons</th>
                  <th style={{ padding: '0.75rem' }}>Price</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          style={{ width: '52px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{course.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>★ {course.avg_rating || course.rating} ({course.total_students} students)</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-primary">{course.category_name}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{course.level}</td>
                    <td style={{ padding: '0.75rem' }}>{course.instructor}</td>
                    <td style={{ padding: '0.75rem' }}>{course.total_lessons || 0}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                      {course.price == 0 ? 'Free' : `$${course.price}`}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/courses/${course.id}`} className="btn-icon" title="View Course Landing">
                          <Eye size={16} />
                        </Link>
                        <Link to="/admin/lessons" className="btn-icon" title="Manage Lessons">
                          <Layers size={16} />
                        </Link>
                        <button onClick={() => handleOpenEdit(course)} className="btn-icon" title="Edit Course">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteCourse(course.id)} className="btn-icon" style={{ color: 'var(--danger)' }} title="Delete Course">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Edit Course Details' : 'Create New Course'}
        maxWidth="650px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Course Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Complete React.js Architecture Course"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="form-select"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Skill Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="form-select"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Instructor Name</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="text"
                placeholder="e.g. 12 Hours"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Summary</label>
            <input
              type="text"
              placeholder="Brief 1-line overview of the course"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              required
              rows={4}
              placeholder="Full course curriculum overview and learning outcomes"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div className="flex items-center justify-end gap-2" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Saving...' : (editingCourse ? 'Save Changes' : 'Create Course')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
