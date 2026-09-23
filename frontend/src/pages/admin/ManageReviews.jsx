import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/courseService';
import { Star, Trash2, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getAllReviewsAdmin();
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this student review?')) return;

    try {
      const res = await reviewService.deleteReview(id);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Review deleted successfully.' });
        fetchReviews();
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to delete review.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Review Moderation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Manage feedback, star ratings, and student testimonials
        </p>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <div>{feedback.message}</div>
        </div>
      )}

      <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No reviews submitted yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Student</th>
                  <th style={{ padding: '0.75rem' }}>Course</th>
                  <th style={{ padding: '0.75rem' }}>Rating</th>
                  <th style={{ padding: '0.75rem' }}>Comment</th>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => (
                  <tr key={rev.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                      {rev.user_name}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 400 }}>{rev.user_email}</div>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>
                      {rev.course_title}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div className="flex items-center gap-1" style={{ color: '#f59e0b', fontWeight: 700 }}>
                        <Star size={15} fill="#f59e0b" />
                        <span>{rev.rating}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {rev.comment}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(rev.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="btn-icon"
                        style={{ color: 'var(--danger)' }}
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
