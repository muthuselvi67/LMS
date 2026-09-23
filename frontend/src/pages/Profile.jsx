import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { User, Mail, Lock, Shield, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [profileFeedback, setProfileFeedback] = useState(null);
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileFeedback(null);
    setSavingProfile(true);

    try {
      const res = await authService.updateProfile({ name });
      if (res.success) {
        updateUser(res.data);
        setProfileFeedback({ type: 'success', message: 'Profile updated successfully!' });
      }
    } catch (err) {
      setProfileFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 6) {
      return setPasswordFeedback({ type: 'danger', message: 'New password must be at least 6 characters.' });
    }
    if (newPassword !== confirmNewPassword) {
      return setPasswordFeedback({ type: 'danger', message: 'New passwords do not match.' });
    }

    setSavingPassword(true);
    try {
      const res = await authService.changePassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordFeedback({ type: 'success', message: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setPasswordFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to change password.'
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'September 2026';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Account Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Manage your personal details and account credentials
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user?.name}</h2>
              <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                {user?.role}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {user?.email} • Joined on {joinedDate}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Name Form */}
      <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Personal Information
        </h3>

        {profileFeedback && (
          <div className={`alert alert-${profileFeedback.type}`}>
            {profileFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <div>{profileFeedback.message}</div>
          </div>
        )}

        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read Only)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="form-input"
                style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--bg-subtle)', opacity: 0.7 }}
              />
              <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <button type="submit" disabled={savingProfile} className="btn btn-primary btn-sm">
            <Save size={16} />
            {savingProfile ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Change Password
        </h3>

        {passwordFeedback && (
          <div className={`alert alert-${passwordFeedback.type}`}>
            {passwordFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <div>{passwordFeedback.message}</div>
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Password (Min. 6 characters)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <button type="submit" disabled={savingPassword} className="btn btn-primary btn-sm">
            <Lock size={16} />
            {savingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
