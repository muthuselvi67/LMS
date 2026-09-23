import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/courseService';
import { BookmarkCheck, Search, CheckCircle2, Clock } from 'lucide-react';

export const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await adminService.getEnrollments();
      if (res.success) {
        setEnrollments(res.data);
      }
    } catch (err) {
      console.error('Failed to load enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = enrollments.filter(e => {
    const matchesFilter = filter === 'all' || e.status === filter;
    const matchesSearch =
      e.student_name.toLowerCase().includes(search.toLowerCase()) ||
      e.student_email.toLowerCase().includes(search.toLowerCase()) ||
      e.course_title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Enrollment Records</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Comprehensive register of all student enrollments across courses
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search student or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ width: '220px' }}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
            style={{ width: '150px' }}
          >
            <option value="all">All Statuses</option>
            <option value="enrolled">Enrolled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading enrollment database...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No enrollment records match your search.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}># ID</th>
                  <th style={{ padding: '0.75rem' }}>Student</th>
                  <th style={{ padding: '0.75rem' }}>Course</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Enrolled At</th>
                  <th style={{ padding: '0.75rem' }}>Completed At</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((enr) => (
                  <tr key={enr.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>
                      #{enr.id}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                      {enr.student_name}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 400 }}>{enr.student_email}</div>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{enr.course_title}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${enr.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
                        {enr.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(enr.enrolled_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {enr.completed_at ? new Date(enr.completed_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
