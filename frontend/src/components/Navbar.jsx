import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Menu,
  User,
  LogOut,
  BookOpen,
  Award,
  Download,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

export const PublicNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container flex items-center justify-between" style={{ height: '74px' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Learnlike <span style={{ color: 'var(--primary)' }}>LMS</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="flex items-center gap-6" style={{ display: 'none', '@media (min-width: 768px)': { display: 'flex' } }}>
          <Link to="/" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Home</Link>
          <Link to="/courses" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Courses</Link>
          <a href="/#categories" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Categories</a>
          <a href="/#why-us" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>About</a>
          <a href="/#faq" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>FAQ</a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="btn btn-primary btn-sm">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button onClick={logout} className="btn btn-secondary btn-sm" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export const DashboardNavbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="lms-topbar">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="btn-icon"
          style={{ display: 'flex' }}
          title="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="search-box">
          <Search size={18} style={{ color: 'var(--text-light)' }} />
          <input
            type="text"
            placeholder="Search for courses, instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon"
            style={{ position: 'relative' }}
            title="Notifications"
          >
            <Bell size={20} />
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--primary)',
              borderRadius: '50%'
            }} />
          </button>

          {showNotifications && (
            <div className="card" style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '300px',
              padding: '1rem',
              zIndex: 100,
              boxShadow: 'var(--shadow-xl)'
            }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                <span className="badge badge-primary">1 New</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                🎉 Welcome to Learnlike LMS! Explore our 7 core development courses.
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3"
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ textAlign: 'left', display: 'none', '@media (min-width: 640px)': { display: 'block' } }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2 }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user?.role || 'Student'}
              </div>
            </div>
          </button>

          {showDropdown && (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: '50px',
                width: '220px',
                padding: '0.5rem',
                zIndex: 100,
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </div>

              {user?.role === 'admin' ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="sidebar-link"
                    onClick={() => setShowDropdown(false)}
                  >
                    <ShieldCheck size={16} /> Admin Panel
                  </Link>
                  <Link
                    to="/dashboard"
                    className="sidebar-link"
                    onClick={() => setShowDropdown(false)}
                  >
                    <LayoutDashboard size={16} /> Student View
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="sidebar-link"
                    onClick={() => setShowDropdown(false)}
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    to="/my-learning"
                    className="sidebar-link"
                    onClick={() => setShowDropdown(false)}
                  >
                    <BookOpen size={16} /> My Learning
                  </Link>
                  <Link
                    to="/certificates"
                    className="sidebar-link"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Award size={16} /> Certificates
                  </Link>
                  <Link
                    to="/downloads"
                    className="sidebar-link"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Download size={16} /> Downloads
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                className="sidebar-link"
                onClick={() => setShowDropdown(false)}
              >
                <User size={16} /> Profile & Settings
              </Link>

              <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                  navigate('/login');
                }}
                className="sidebar-link"
                style={{ width: '100%', color: 'var(--danger)', justifyContent: 'flex-start' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
