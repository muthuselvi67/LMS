import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, AlertCircle, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData.email, formData.password);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from === '/login' ? '/dashboard' : from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins for instant testing
  const fillDemoStudent = () => {
    setFormData({
      email: 'student@learnlike.com',
      password: 'password'
    });
  };

  const fillDemoAdmin = () => {
    setFormData({
      email: 'admin@learnlike.com',
      password: 'password'
    });
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 74px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      backgroundColor: 'var(--bg-main)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', borderRadius: '20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#fff',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            <BookOpen size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Sign in to your Learnlike LMS account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <div className="flex items-center justify-between" style={{ marginBottom: '0.45rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo environment: Use password "password" or reset via database.'); }} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                Forgot Password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* 1-Click Demo Logins */}
        <div style={{
          marginTop: '1.75rem',
          padding: '1rem',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px dashed var(--border-color)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.75rem', textAlign: 'center' }}>
            Quick Demo Accounts (1-Click Fill)
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem' }}
            >
              <UserCheck size={14} /> Student Demo
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem' }}
            >
              <Shield size={14} /> Admin Demo
            </button>
          </div>
        </div>

        {/* Footer link */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
