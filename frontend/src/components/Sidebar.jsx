import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Grid,
  TrendingUp,
  Award,
  Download,
  User,
  Settings,
  LogOut,
  Users,
  Layers,
  FileText,
  BookmarkCheck,
  Star,
  Shield,
  X
} from 'lucide-react';

export const StudentSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Learning', path: '/my-learning', icon: BookOpen },
    { label: 'Available Courses', path: '/courses', icon: Compass },
    { label: 'Categories', path: '/categories', icon: Grid },
    { label: 'Progress', path: '/progress', icon: TrendingUp },
    { label: 'Certificates', path: '/certificates', icon: Award },
    { label: 'Downloads', path: '/downloads', icon: Download },
  ];

  const secondaryItems = [
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 45
          }}
        />
      )}

      <aside className={`lms-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand justify-between">
          <div className="flex items-center gap-2">
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Learnlike <span style={{ color: 'var(--primary)' }}>LMS</span>
              </span>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" style={{ display: 'none', '@media (max-width: 1024px)': { display: 'flex' } }}>
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="sidebar-nav">
          <div className="sidebar-label">Main Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="sidebar-label" style={{ marginTop: '1rem' }}>Account</div>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Logout Footer */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ width: '100%', color: 'var(--danger)', justifyContent: 'flex-start' }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Courses', path: '/admin/courses', icon: BookOpen },
    { label: 'Categories', path: '/admin/categories', icon: Grid },
    { label: 'Lessons', path: '/admin/lessons', icon: Layers },
    { label: 'Resources (PDFs)', path: '/admin/resources', icon: FileText },
    { label: 'Enrollments', path: '/admin/enrollments', icon: BookmarkCheck },
    { label: 'Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Certificates', path: '/admin/certificates', icon: Award },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 45
          }}
        />
      )}

      <aside className={`lms-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand justify-between">
          <div className="flex items-center gap-2">
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Admin <span style={{ color: 'var(--success)' }}>Panel</span>
              </span>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-label">Administration</div>
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <NavLink
            to="/dashboard"
            className="sidebar-link"
            style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}
          >
            <Compass size={18} />
            <span>Switch to Student View</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ width: '100%', color: 'var(--danger)', justifyContent: 'flex-start' }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
