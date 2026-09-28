import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { StudentSidebar } from '../components/Sidebar';
import { DashboardNavbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const StudentLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(prev => !prev);
    } else {
      setSidebarOpen(prev => !prev);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
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
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`lms-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lms-main">
        <DashboardNavbar onToggleSidebar={handleToggleSidebar} />
        <main className="lms-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
