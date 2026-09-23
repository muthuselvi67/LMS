import React from 'react';

export const CourseProgress = ({ progress = 0, completedLessons = 0, totalLessons = 0, showDetails = true, height = 8 }) => {
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div style={{ width: '100%' }}>
      {showDetails && (
        <div className="flex items-center justify-between" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
            {completedLessons} / {totalLessons} Lessons Completed
          </span>
          <span style={{ fontWeight: 700, color: safeProgress === 100 ? 'var(--success)' : 'var(--primary)' }}>
            {safeProgress}%
          </span>
        </div>
      )}

      {/* Progress Bar Container */}
      <div style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: '999px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
          width: `${safeProgress}%`,
          height: '100%',
          backgroundColor: safeProgress === 100 ? 'var(--success)' : 'var(--primary)',
          borderRadius: '999px',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: safeProgress > 0 ? '0 0 8px var(--primary-glow)' : 'none'
        }} />
      </div>
    </div>
  );
};
