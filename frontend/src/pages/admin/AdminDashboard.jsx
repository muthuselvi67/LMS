import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/courseService';
import {
  Users,
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  FileText,
  Star,
  Award,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading Admin Analytics & Management Data...
      </div>
    );
  }

  const statCards = [
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: '#3b82f6', bg: '#eff6ff', link: '/admin/students' },
    { title: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'var(--primary)', bg: 'var(--primary-light)', link: '/admin/courses' },
    { title: 'Total Enrollments', value: stats?.totalEnrollments || 0, icon: BookmarkCheck, color: '#8b5cf6', bg: '#f5f3ff', link: '/admin/enrollments' },
    { title: 'Completed Courses', value: stats?.completedCourses || 0, icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5', link: '/admin/enrollments' },
    { title: 'PDF Resources', value: stats?.totalResources || 0, icon: FileText, color: '#ef4444', bg: '#fef2f2', link: '/admin/resources' },
    { title: 'Student Reviews', value: stats?.totalReviews || 0, icon: Star, color: '#f59e0b', bg: '#fffbeb', link: '/admin/reviews' },
    { title: 'Certificates Issued', value: stats?.totalCertificates || 0, icon: Award, color: '#06b6d4', bg: '#ecfeff', link: '/admin/students' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Live platform metrics, student progress monitoring, and content management
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <Link to="/admin/courses" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Add New Course
          </Link>
          <Link to="/admin/resources" className="btn btn-secondary btn-sm">
            <FileText size={16} /> Upload PDF
          </Link>
        </div>
      </div>

      {/* 7 KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className="card"
              style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {stat.title}
                </span>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: stat.bg,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 'auto' }}>
                {stat.value}
              </div>
            </Link>
          );
        })}
      </div>

      {/* 2-Column Grid: Recent Enrollments & Category Distribution */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1fr)',
        gap: '1.5rem'
      }}>
        {/* Recent Enrollments Table */}
        <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Student Enrollments</h3>
            <Link to="/admin/enrollments" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          {(!stats?.recentEnrollments || stats.recentEnrollments.length === 0) ? (
            <p style={{ color: 'var(--text-muted)' }}>No enrollments recorded yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Student</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Course</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEnrollments.map((enr) => (
                    <tr key={enr.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                        {enr.student_name}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 400 }}>{enr.student_email}</div>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{enr.course_title}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className={`badge ${enr.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
                          {enr.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(enr.enrolled_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Course Catalog by Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(stats?.categoryStats || []).map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between" style={{ padding: '0.65rem 0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)' }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {cat.course_count} Course(s)
                  </div>
                </div>
                <span className="badge badge-primary">
                  {cat.total_students} Students
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
