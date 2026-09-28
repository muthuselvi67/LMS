import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { courseService } from '../services/courseService';
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
  ShieldCheck,
  X,
  ArrowRight
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
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchBoxRef = useRef(null);

  // Sync searchTerm with URL parameter on /courses
  useEffect(() => {
    if (location.pathname === '/courses') {
      setSearchTerm(searchParams.get('search') || '');
    }
  }, [location.pathname, searchParams]);

  // Preload courses list for instant live search dropdown suggestions
  useEffect(() => {
    let mounted = true;
    courseService.getCourses().then(res => {
      if (mounted && res.success && res.data) {
        setAllCourses(res.data);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Filter live suggestions
  useEffect(() => {
    if (searchTerm.trim().length >= 1) {
      const q = searchTerm.toLowerCase();
      const matches = allCourses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.instructor && c.instructor.toLowerCase().includes(q)) ||
        (c.category_name && c.category_name.toLowerCase().includes(q))
      ).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, allCourses]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    if (location.pathname === '/courses') {
      navigate('/courses');
    }
  };

  const handleSelectSuggestion = (courseId) => {
    setShowSuggestions(false);
    navigate(`/courses/${courseId}`);
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

        {/* Global Search Bar with Live Suggestions */}
        <div ref={searchBoxRef} style={{ position: 'relative' }}>
          <form onSubmit={handleSearch} className="search-box">
            <Search
              size={18}
              style={{ color: 'var(--text-light)', cursor: 'pointer', flexShrink: 0 }}
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="Search for courses, instructors..."
              value={searchTerm}
              onFocus={() => { if (searchTerm.trim()) setShowSuggestions(true); }}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-light)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  borderRadius: '50%'
                }}
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </form>

          {/* Instant Search Suggestions Dropdown */}
          {showSuggestions && searchTerm.trim() && (
            <div
              className="card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                minWidth: '320px',
                padding: '0.5rem',
                zIndex: 1000,
                boxShadow: 'var(--shadow-xl)',
                borderRadius: '12px'
              }}
            >
              <div style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Instant Matches
              </div>
              {suggestions.length > 0 ? (
                suggestions.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleSelectSuggestion(course.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <BookOpen size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {course.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {course.instructor || course.category_name || 'Development'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No matching course titles found.
                </div>
              )}

              <button
                type="button"
                onClick={handleSearch}
                className="btn btn-primary btn-sm"
                style={{
                  width: '100%',
                  marginTop: '0.4rem',
                  fontSize: '0.8rem',
                  justifyContent: 'center',
                  padding: '0.45rem'
                }}
              >
                Press Enter or Click to View All Results ({suggestions.length})
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
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

        {/* Notifications Icon (Opens full width /notifications page) */}
        <Link
          to="/notifications"
          className="btn-icon"
          style={{ position: 'relative', textDecoration: 'none' }}
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              minWidth: '16px',
              height: '16px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              borderRadius: '999px',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px'
            }}>
              {unreadCount}
            </span>
          )}
        </Link>

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
