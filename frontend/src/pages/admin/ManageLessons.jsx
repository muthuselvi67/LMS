import React, { useState, useEffect } from 'react';
import { courseService, lessonService } from '../../services/courseService';
import { Modal } from '../../components/Modal';
import { Plus, Edit2, Trash2, PlayCircle, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export const ManageLessons = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    course_id: '',
    section_name: 'Section 1 - Introduction',
    title: '',
    description: '',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '15 mins',
    lesson_order: 1
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchLessons(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const res = await courseService.getCourses();
      if (res.success && res.data.length > 0) {
        setCourses(res.data);
        setSelectedCourseId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      const res = await lessonService.getLessonsByCourse(courseId);
      if (res.success) {
        setLessons(res.data);
      }
    } catch (err) {
      console.error('Failed to load lessons:', err);
    }
  };

  const handleOpenAdd = () => {
    setEditingLesson(null);
    setFormData({
      course_id: selectedCourseId,
      section_name: 'Section 1 - Introduction',
      title: '',
      description: '',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '15 mins',
      lesson_order: lessons.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      course_id: lesson.course_id,
      section_name: lesson.section_name || 'Section 1 - Introduction',
      title: lesson.title,
      description: lesson.description || '',
      video_url: lesson.video_url || '',
      duration: lesson.duration || '15 mins',
      lesson_order: lesson.lesson_order || 1
    });
    setIsModalOpen(true);
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const res = await lessonService.deleteLesson(id);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Lesson deleted successfully.' });
        fetchLessons(selectedCourseId);
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to delete lesson.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      if (editingLesson) {
        const res = await lessonService.updateLesson(editingLesson.id, formData);
        if (res.success) {
          setFeedback({ type: 'success', message: 'Lesson updated successfully!' });
          setIsModalOpen(false);
          fetchLessons(selectedCourseId);
        }
      } else {
        const res = await lessonService.createLesson(formData);
        if (res.success) {
          setFeedback({ type: 'success', message: 'Lesson created successfully!' });
          setIsModalOpen(false);
          fetchLessons(selectedCourseId);
        }
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Lesson Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Structure curriculum modules, manage video sources, and update lesson content
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> Add New Lesson
        </button>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <div>{feedback.message}</div>
        </div>
      )}

      {/* Course Filter Dropdown */}
      <div className="card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
        <div className="flex items-center gap-3">
          <label className="form-label" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
            Select Course:
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="form-select"
            style={{ maxWidth: '400px' }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        {lessons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No lessons added for this course yet. Click "Add New Lesson" above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}># Order</th>
                  <th style={{ padding: '0.75rem' }}>Lesson Title</th>
                  <th style={{ padding: '0.75rem' }}>Section</th>
                  <th style={{ padding: '0.75rem' }}>Duration</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                      #{lesson.lesson_order || 1}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                      <div className="flex items-center gap-2">
                        <PlayCircle size={16} color="var(--primary)" />
                        <span>{lesson.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                      {lesson.section_name}
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                      {lesson.duration || '15 mins'}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenEdit(lesson)} className="btn-icon" title="Edit Lesson">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteLesson(lesson.id)} className="btn-icon" style={{ color: 'var(--danger)' }} title="Delete Lesson">
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

      {/* Add / Edit Lesson Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Lesson Title</label>
            <input
              type="text"
              required
              placeholder="e.g. React Hooks (useState & useEffect)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Section Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Section 2 - React Hooks"
              value={formData.section_name}
              onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="text"
                placeholder="e.g. 18 mins"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lesson Order (#)</label>
              <input
                type="number"
                min="1"
                value={formData.lesson_order}
                onChange={(e) => setFormData({ ...formData, lesson_order: parseInt(e.target.value, 10) || 1 })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Video Stream URL</label>
            <input
              type="url"
              required
              placeholder="https://commondatastorage.googleapis.com/..."
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Code Snippet Notes</label>
            <textarea
              rows={3}
              placeholder="Key concepts covered in this lesson video"
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
              {submitting ? 'Saving...' : (editingLesson ? 'Save Lesson' : 'Add Lesson')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
