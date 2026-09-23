import React, { useState, useEffect } from 'react';
import { resourceService, courseService, lessonService } from '../../services/courseService';
import { Modal } from '../../components/Modal';
import { Plus, Trash2, Download, FileText, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Upload Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResourcesAndCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      lessonService.getLessonsByCourse(courseId).then(res => {
        if (res.success) setLessons(res.data);
      });
    } else {
      setLessons([]);
    }
  }, [courseId]);

  const fetchResourcesAndCourses = async () => {
    setLoading(true);
    try {
      const [resRes, courseRes] = await Promise.all([
        resourceService.getAllResourcesAdmin(),
        courseService.getCourses()
      ]);
      if (resRes.success) setResources(resRes.data);
      if (courseRes.success) {
        setCourses(courseRes.data);
        if (courseRes.data.length > 0 && !courseId) {
          setCourseId(courseRes.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        alert('Please select a valid .pdf document!');
        e.target.value = null;
        setPdfFile(null);
        return;
      }
      setPdfFile(file);
      if (!title) {
        setTitle(file.name.replace('.pdf', '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      return alert('Please select a PDF file to upload.');
    }

    setUploading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('course_id', courseId);
    if (lessonId) formData.append('lesson_id', lessonId);
    formData.append('title', title);
    formData.append('pdfFile', pdfFile);

    try {
      const res = await resourceService.uploadResource(formData);
      if (res.success) {
        setFeedback({ type: 'success', message: 'PDF resource uploaded and cataloged successfully!' });
        setIsModalOpen(false);
        setTitle('');
        setPdfFile(null);
        fetchResourcesAndCourses();
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Delete this PDF resource?')) return;

    try {
      const res = await resourceService.deleteResource(id);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Resource deleted.' });
        fetchResourcesAndCourses();
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to delete resource.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>PDF Resource Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Upload course notes, cheatsheets, and attach PDFs to specific lessons using Multer
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Upload size={18} /> Upload PDF Resource
        </button>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <div>{feedback.message}</div>
        </div>
      )}

      {/* Resources Table */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading PDF resources catalog...
          </div>
        ) : resources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No PDF files uploaded yet. Click "Upload PDF Resource" above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Resource Title</th>
                  <th style={{ padding: '0.75rem' }}>Course</th>
                  <th style={{ padding: '0.75rem' }}>File Name</th>
                  <th style={{ padding: '0.75rem' }}>File Size</th>
                  <th style={{ padding: '0.75rem' }}>Uploaded At</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((res) => (
                  <tr key={res.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                      <div className="flex items-center gap-2">
                        <FileText size={18} color="var(--danger)" />
                        <span>{res.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--primary)' }}>
                      {res.course_title}
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                      {res.file_name}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-gray">{res.file_size || 'PDF'}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(res.uploaded_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={resourceService.getDownloadUrl(res.id)}
                          download
                          className="btn-icon"
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </a>
                        <button
                          onClick={() => handleDeleteResource(res.id)}
                          className="btn-icon"
                          style={{ color: 'var(--danger)' }}
                          title="Delete PDF"
                        >
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

      {/* Upload PDF Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload PDF Resource"
      >
        <form onSubmit={handleUploadSubmit}>
          <div className="form-group">
            <label className="form-label">Course</label>
            <select
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="form-select"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Attached Lesson (Optional)</label>
            <select
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              className="form-select"
            >
              <option value="">General Course Resource (All Lessons)</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Resource Title</label>
            <input
              type="text"
              required
              placeholder="e.g. JavaScript ES6+ Cheatsheet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select PDF Document (.pdf only)</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              required
              onChange={handleFileChange}
              className="form-input"
              style={{ padding: '0.5rem' }}
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
              disabled={uploading}
              className="btn btn-primary"
            >
              <Upload size={16} />
              {uploading ? 'Uploading to Server...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
