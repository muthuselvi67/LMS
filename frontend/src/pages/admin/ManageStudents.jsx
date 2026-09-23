import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/courseService';
import { Modal } from '../../components/Modal';
import { Users, Eye, BookOpen, CheckCircle2, Award, Calendar } from 'lucide-react';

export const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await adminService.getStudents();
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectStudent = async (student) => {
    setSelectedStudent(student);
    setDetailsLoading(true);
    try {
      const res = await adminService.getStudentDetails(student.id);
      if (res.success) {
        setStudentDetails(res.data);
      }
    } catch (err) {
      alert('Failed to load student details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Student Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Monitor enrolled learners, view course completions, and inspect individual progress
        </p>
      </div>

      <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading students roster...
          </div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No registered students found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Student</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Enrolled Courses</th>
                  <th style={{ padding: '0.75rem' }}>Completed Courses</th>
                  <th style={{ padding: '0.75rem' }}>Certificates</th>
                  <th style={{ padding: '0.75rem' }}>Joined Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                      <div className="flex items-center gap-2">
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}>
                          {st.name ? st.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <span>{st.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{st.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-primary">{st.enrolled_courses}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-success">{st.completed_courses}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-gray">{st.certificates_earned}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(st.joined_date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleInspectStudent(st)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={14} /> Inspect Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Details Inspection Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => { setSelectedStudent(null); setStudentDetails(null); }}
        title={`Student Profile: ${selectedStudent?.name}`}
        maxWidth="700px"
      >
        {detailsLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            Loading student course journey...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Email: <strong>{studentDetails?.student?.email}</strong>
              </div>
            </div>

            {/* Enrolled courses breakdown */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Enrolled Courses & Real-Time Progress
              </h4>
              {(!studentDetails?.enrollments || studentDetails.enrollments.length === 0) ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No enrollments recorded for this student.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {studentDetails.enrollments.map((enr) => {
                    const total = Number(enr.total_lessons) || 0;
                    const comp = Number(enr.completed_lessons) || 0;
                    const pct = total > 0 ? Math.round((comp / total) * 100) : 0;
                    return (
                      <div key={enr.enrollment_id} style={{ padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '0.4rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{enr.course_title}</span>
                          <span className={`badge ${pct === 100 ? 'badge-success' : 'badge-primary'}`}>
                            {pct}% ({comp}/{total} Lessons)
                          </span>
                        </div>
                        <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: pct === 100 ? 'var(--success)' : 'var(--primary)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Issued Certificates */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Earned Certificates
              </h4>
              {(!studentDetails?.certificates || studentDetails.certificates.length === 0) ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No certificates earned yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {studentDetails.certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between" style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--success-light)', borderRadius: '8px', color: '#065f46' }}>
                      <div className="flex items-center gap-2">
                        <Award size={18} />
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cert.course_title}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{cert.certificate_id}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
