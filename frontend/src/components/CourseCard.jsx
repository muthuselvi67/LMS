import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, BookOpen, User, PlayCircle, CheckCircle2 } from 'lucide-react';

export const CourseCard = ({ course, isEnrolled, onEnroll, isEnrolling }) => {
  const navigate = useNavigate();

  const handleEnrollClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course.id);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  return (
    <div className="card flex flex-col" style={{ height: '100%', display: 'flex' }}>
      {/* Thumbnail with Level badge */}
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className="badge badge-primary" style={{ backdropFilter: 'blur(4px)', background: 'rgba(99, 102, 241, 0.9)', color: '#fff' }}>
            {course.level || 'Beginner'}
          </span>
        </div>
        {course.category_name && (
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <span className="badge badge-gray" style={{ backdropFilter: 'blur(4px)', background: 'rgba(15, 23, 42, 0.75)', color: '#fff' }}>
              {course.category_name}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
          {/* Rating */}
          <div className="flex items-center gap-1" style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
            <Star size={16} fill="#f59e0b" />
            <span>{Number(course.avg_rating || course.rating || 4.8).toFixed(1)}</span>
            <span style={{ color: 'var(--text-light)', fontWeight: 400, marginLeft: '2px' }}>
              ({course.total_students || 0})
            </span>
          </div>

          {/* Price badge */}
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: course.price == 0 ? 'var(--success)' : 'var(--primary)' }}>
            {course.price == 0 ? 'Free' : `$${course.price}`}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.35, minHeight: '2.7em' }}>
          <Link to={`/courses/${course.id}`} style={{ color: 'var(--text-main)' }}>
            {course.title}
          </Link>
        </h3>

        {/* Short Description */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.short_description || course.description}
        </p>

        {/* Instructor & Meta */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginBottom: '1rem' }}>
          <div className="flex items-center justify-between" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{course.instructor || 'Learnlike Instructor'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{course.duration || '8 Hours'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            <BookOpen size={14} />
            <span>{course.total_lessons || 14} Lessons</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2" style={{ marginTop: 'auto' }}>
          <Link to={`/courses/${course.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
            View Course
          </Link>

          {isEnrolled ? (
            <Link to={`/learn/${course.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <PlayCircle size={15} />
              Start Learning
            </Link>
          ) : (
            <button
              onClick={handleEnrollClick}
              disabled={isEnrolling}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
