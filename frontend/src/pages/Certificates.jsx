import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificateService, enrollmentService } from '../services/courseService';
import { CertificateCard } from '../components/CertificateCard';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { Award, Download, CheckCircle, Compass, Eye, Sparkles } from 'lucide-react';

export const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [completedCoursesWithoutCert, setCompletedCoursesWithoutCert] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [certRes, myCoursesRes] = await Promise.all([
        certificateService.getMyCertificates(),
        enrollmentService.getMyCourses()
      ]);

      if (certRes.success) {
        setCertificates(certRes.data);
      }

      if (myCoursesRes.success && certRes.success) {
        const certCourseIds = certRes.data.map(c => c.course_id);
        const eligible = myCoursesRes.data.filter(
          c => c.progress === 100 && !certCourseIds.includes(c.id)
        );
        setCompletedCoursesWithoutCert(eligible);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (courseId) => {
    setGeneratingId(courseId);
    try {
      const res = await certificateService.generateCertificate(courseId);
      if (res.success) {
        setSelectedCert(res.data);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate certificate.');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Certificates of Completion
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          View, verify, and download your accredited Learnlike LMS course certificates
        </p>
      </div>

      {/* Eligible courses ready for certificate claim */}
      {completedCoursesWithoutCert.length > 0 && (
        <div className="card" style={{
          padding: '1.5rem 2rem',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#ffffff',
          borderRadius: '16px'
        }}>
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div className="flex items-center gap-3">
              <Sparkles size={28} />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {completedCoursesWithoutCert.length} Certificate(s) Ready to Claim!
                </h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                  You have completed 100% of the curriculum for: {completedCoursesWithoutCert.map(c => c.title).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {completedCoursesWithoutCert.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleGenerate(c.id)}
                  disabled={generatingId === c.id}
                  className="btn"
                  style={{ backgroundColor: '#ffffff', color: '#4f46e5', fontWeight: 700 }}
                >
                  {generatingId === c.id ? 'Generating...' : `Claim for ${c.title.split(' ')[1] || 'Course'}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading your certificates...
        </div>
      ) : certificates.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Award size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Certificates Earned Yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
            Complete 100% of all lessons in any course to receive your official verifiable Certificate of Completion.
          </p>
          <Link to="/my-learning" className="btn btn-primary">
            <Compass size={16} /> Continue Your Courses
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {certificates.map((cert) => (
            <div key={cert.id} className="card flex flex-col" style={{ borderRadius: '16px', padding: '1.5rem' }}>
              <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={26} />
                </div>
                <div>
                  <span className="badge badge-success" style={{ marginBottom: '0.2rem' }}>
                    Verified Certificate
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {cert.certificate_id}
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {cert.course_title}
              </h3>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: 'auto' }}>
                Completed on: {new Date(cert.completion_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>

              <button
                onClick={() => setSelectedCert(cert)}
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
              >
                <Eye size={16} />
                View & Print Certificate
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      <Modal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        title="Official Certificate of Completion"
        maxWidth="900px"
      >
        {selectedCert && (
          <CertificateCard
            certificate={selectedCert}
            studentName={selectedCert.student_name || user?.name}
            courseTitle={selectedCert.course_title}
          />
        )}
      </Modal>
    </div>
  );
};
