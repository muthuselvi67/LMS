import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from '../components/Sidebar';
import { DashboardNavbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
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
        <p style={{ color: 'var(--text-muted)' }}>Loading Admin Portal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={`lms-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lms-main">
        <DashboardNavbar onToggleSidebar={handleToggleSidebar} />
        <main className="lms-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
