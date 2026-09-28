import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import {
  Bell,
  CheckCircle,
  BookOpen,
  Award,
  Download,
  Info,
  Trash2,
  Check,
  ArrowRight,
  Sparkles,
  Inbox
} from 'lucide-react';

export const Notifications = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all'); // all, unread, course, download, certificate

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'unread') return notif.unread;
    if (activeTab === 'course') return notif.category === 'course';
    if (activeTab === 'download') return notif.category === 'download';
    if (activeTab === 'certificate') return notif.category === 'certificate';
    return true;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'course':
        return <BookOpen size={20} color="var(--primary)" />;
      case 'download':
        return <Download size={20} color="#06b6d4" />;
      case 'certificate':
        return <Award size={20} color="#8b5cf6" />;
      default:
        return <Bell size={20} color="var(--warning)" />;
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'course':
        return 'badge-primary';
      case 'download':
        return 'badge-info';
      case 'certificate':
        return 'badge-secondary';
      default:
        return 'badge-warning';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Page Header */}
      <div className="card" style={{ padding: '2rem', borderRadius: '20px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-subtle) 100%)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--primary-glow)'
            }}>
              <Bell size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Notifications</h1>
                {unreadCount > 0 && (
                  <span className="badge" style={{ backgroundColor: 'var(--primary)', color: '#ffffff', fontWeight: 700 }}>
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Stay updated on your course progress, learning milestones, and downloadable resources.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-secondary btn-sm"
                title="Mark all as read"
              >
                <Check size={16} />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--danger)' }}
                title="Clear all notifications"
              >
                <Trash2 size={16} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2" style={{ marginTop: '1.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button
            onClick={() => setActiveTab('all')}
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`btn btn-sm ${activeTab === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab('course')}
            className={`btn btn-sm ${activeTab === 'course' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`btn btn-sm ${activeTab === 'download' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Downloads
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`btn btn-sm ${activeTab === 'certificate' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Certificates
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredNotifications.length === 0 ? (
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '16px' }}>
            <Inbox size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Notifications Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
              {activeTab === 'unread'
                ? "You're all caught up! You have no unread notifications at the moment."
                : 'There are no notifications in this category.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                borderLeft: notif.unread ? '4px solid var(--primary)' : '1px solid var(--border-color)',
                backgroundColor: notif.unread ? 'var(--bg-card)' : 'var(--bg-card)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {/* Category Icon */}
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getCategoryIcon(notif.category)}
              </div>

              {/* Main Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                    {notif.title}
                  </span>
                  {notif.unread && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      display: 'inline-block'
                    }} />
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: 'auto' }}>
                    {notif.time}
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {notif.message}
                </p>

                {notif.link && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <Link
                      to={notif.link}
                      onClick={() => markAsRead(notif.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', color: 'var(--primary)' }}
                    >
                      View Details
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
                {notif.unread && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="btn-icon"
                    title="Mark as read"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <Check size={16} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="btn-icon"
                  title="Remove notification"
                  style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
