import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentLayout } from './StudentLayout';
import { PublicLayout } from './PublicLayout';

export const AdaptiveCourseLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem auto'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-muted)' }}>Loading Learnlike LMS...</p>
      </div>
    );
  }

  return isAuthenticated ? <StudentLayout /> : <PublicLayout />;
};
