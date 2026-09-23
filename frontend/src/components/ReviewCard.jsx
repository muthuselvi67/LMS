import React from 'react';
import { Star, User, Trash2 } from 'lucide-react';

export const ReviewCard = ({ review, onDelete, isAdmin = false }) => {
  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem'
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            {review.user_name ? review.user_name.charAt(0).toUpperCase() : <User size={18} />}
          </div>

          <div>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {review.user_name || 'Anonymous Student'}
            </h5>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={15}
              fill={star <= review.rating ? '#f59e0b' : 'none'}
              color={star <= review.rating ? '#f59e0b' : 'var(--text-light)'}
            />
          ))}

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="btn-icon"
              style={{ color: 'var(--danger)', width: '30px', height: '30px', marginLeft: '0.5rem' }}
              title="Delete Review"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        {review.comment}
      </p>
    </div>
  );
};
