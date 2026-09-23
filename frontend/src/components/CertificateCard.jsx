import React, { useRef } from 'react';
import { Award, Download, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

export const CertificateCard = ({ certificate, studentName, courseTitle }) => {
  const certRef = useRef(null);

  const name = certificate?.student_name || studentName || 'Learner';
  const course = certificate?.course_title || courseTitle || 'Course Title';
  const certId = certificate?.certificate_id || 'LL-2026-CERT';
  const date = certificate?.completion_date
    ? new Date(certificate.completion_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
      {/* Certificate Canvas / Card */}
      <div
        ref={certRef}
        className="certificate-container"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          color: '#0f172a',
          border: '12px solid #312e81',
          padding: '3rem 2.5rem',
          borderRadius: '16px',
          boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center'
        }}
      >
        {/* Inner Gold / Indigo Border Accent */}
        <div style={{
          position: 'absolute',
          inset: '8px',
          border: '2px dashed #f59e0b',
          pointerEvents: 'none',
          borderRadius: '8px'
        }} />

        {/* Top Seal / Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
          }}>
            <Award size={36} />
          </div>
        </div>

        {/* Organization Name */}
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4f46e5', marginBottom: '0.5rem' }}>
          Learnlike LMS
        </h4>

        {/* Certificate Title */}
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, textTransform: 'uppercase', color: '#1e1b4b', letterSpacing: '0.05em', marginBottom: '1rem' }}>
          Certificate of Completion
        </h1>

        <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1.25rem', fontStyle: 'italic' }}>
          This is proudly awarded to
        </p>

        {/* Student Name */}
        <div style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#312e81',
          borderBottom: '2px solid #e2e8f0',
          display: 'inline-block',
          padding: '0 2rem 0.5rem 2rem',
          marginBottom: '1.25rem'
        }}>
          {name}
        </div>

        <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem', maxWidth: '540px', margin: '0 auto 1rem auto' }}>
          for successfully completing all lessons, assignments, and curriculum requirements for
        </p>

        {/* Course Title */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '2.5rem' }}>
          {course}
        </h2>

        {/* Footer info: Date, ID, Verified Seal */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '1.5rem',
          marginTop: '1rem'
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Completion Date
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              {date}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
            <ShieldCheck size={20} />
            <span>Verified Credential</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Certificate ID
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5', fontFamily: 'monospace' }}>
              {certId}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={handlePrint} className="btn btn-primary btn-lg">
          <Printer size={18} />
          Print / Save PDF
        </button>
      </div>
    </div>
  );
};
