import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService, enrollmentService, reviewService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import { ReviewCard } from '../components/ReviewCard';
import { PDFResource } from '../components/PDFResource';
import { Modal } from '../components/Modal';
import {
  Star,
  Clock,
  BookOpen,
  User,
  CheckCircle,
  PlayCircle,
  Award,
  Globe,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  Download,
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react';

export const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Curriculum accordion
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const res = await courseService.getCourseById(id);
      if (res.success) {
        setCourse(res.data);
        // Open first section by default
        if (res.data.lessons?.length > 0) {
          const firstSection = res.data.lessons[0].section_name || 'Section 1';
          setOpenSections({ [firstSection]: true });
        }
      }
    } catch (err) {
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      return navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
    }

    setEnrolling(true);
    setFeedback(null);
    try {
      const res = await enrollmentService.enroll(course.id);
      if (res.success) {
        setFeedback({ type: 'success', message: '🎉 Enrolled successfully! Launching course player...' });
        setTimeout(() => {
          navigate(`/learn/${course.id}`);
        }, 1000);
      }
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to enroll.'
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await reviewService.createReview({
        courseId: course.id,
        rating: reviewRating,
        comment: reviewComment
      });
      if (res.success) {
        setShowReviewModal(false);
        setReviewComment('');
        fetchCourseDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading course curriculum and details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Course Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The requested course does not exist or has been removed.
        </p>
        <Link to="/courses" className="btn btn-primary">
          Back to Courses
        </Link>
      </div>
    );
  }

  // Group lessons by sections
  const sectionsMap = {};
  (course.lessons || []).forEach((l) => {
    const sec = l.section_name || 'Section 1 - Fundamentals';
    if (!sectionsMap[sec]) sectionsMap[sec] = [];
    sectionsMap[sec].push(l);
  });
  const sections = Object.entries(sectionsMap).map(([name, items]) => ({ name, items }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <div>{feedback.message}</div>
        </div>
      )}

      {/* 1. Header Banner (Udemy Style Hero) */}
      <div className="card" style={{
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        padding: '2.5rem',
        borderRadius: '24px',
        border: 'none',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          {/* Left Column: Info */}
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'var(--primary)', color: '#fff' }}>
                {course.category_name || 'Development'}
              </span>
              <span className="badge" style={{ background: '#334155', color: '#cbd5e1' }}>
                {course.level}
              </span>
              <span className="badge" style={{ background: '#065f46', color: '#a7f3d0' }}>
                <Award size={13} /> Certificate Included
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '1rem' }}>
              {course.title}
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {course.short_description || course.description}
            </p>

            {/* Metadata Bar */}
            <div className="flex items-center gap-4" style={{ flexWrap: 'wrap', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '1.75rem' }}>
              <div className="flex items-center gap-1" style={{ color: '#f59e0b', fontWeight: 700 }}>
                <Star size={16} fill="#f59e0b" />
                <span>{course.avg_rating || 4.8}</span>
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>({course.total_reviews || course.total_students} ratings)</span>
              </div>

              <div className="flex items-center gap-1">
                <User size={15} color="var(--primary)" />
                <span>Instructor: <strong>{course.instructor}</strong></span>
              </div>

              <div className="flex items-center gap-1">
                <Clock size={15} />
                <span>{course.duration}</span>
              </div>

              <div className="flex items-center gap-1">
                <Globe size={15} />
                <span>{course.language || 'English'}</span>
              </div>
            </div>

            {/* CTA Buttons in Hero */}
            <div className="flex items-center gap-3">
              {course.isEnrolled ? (
                <Link to={`/learn/${course.id}`} className="btn btn-primary btn-lg">
                  <PlayCircle size={18} />
                  Start Learning (Enrolled)
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn btn-primary btn-lg"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now Free'}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Preview Thumbnail / Video Card */}
          <div>
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}>
              <img
                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
                alt={course.title}
                style={{ width: '100%', height: '240px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Link
                  to={course.isEnrolled ? `/learn/${course.id}` : '#'}
                  onClick={(e) => { if (!course.isEnrolled) { e.preventDefault(); handleEnroll(); } }}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px var(--primary)'
                  }}
                >
                  <PlayCircle size={32} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Side info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
        gap: '2rem'
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* 2. What You'll Learn */}
          <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              What You'll Learn
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.85rem'
            }}>
              {(course.what_you_will_learn || []).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Course Curriculum */}
          <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Course Curriculum</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {sections.length} Sections • {course.lessons?.length || 0} Lessons • {course.duration} Total Duration
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sections.map((sec, idx) => {
                const isOpen = openSections[sec.name] !== false;
                return (
                  <div key={sec.name} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setOpenSections(prev => ({ ...prev, [sec.name]: !prev[sec.name] }))}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        backgroundColor: 'var(--bg-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        <span>{sec.name}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {sec.items.length} Lessons
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ backgroundColor: 'var(--bg-card)' }}>
                        {sec.items.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between"
                            style={{
                              padding: '0.75rem 1.25rem',
                              borderTop: '1px solid var(--border-color)',
                              fontSize: '0.875rem'
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <PlayCircle size={16} color="var(--primary)" />
                              <span style={{ color: 'var(--text-main)' }}>{lesson.title}</span>
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {lesson.duration || '15 mins'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Requirements & Description */}
          <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>
              Requirements
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {(course.requirements || []).map((req, idx) => (
                <li key={idx} className="flex items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                  {req}
                </li>
              ))}
            </ul>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>
              Course Description
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {course.description}
            </p>
          </div>

          {/* 5. Downloadable PDF Resources */}
          {course.resources && course.resources.length > 0 && (
            <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                Course Resources ({course.resources.length} PDFs)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {course.resources.map((res) => (
                  <PDFResource key={res.id} resource={res} />
                ))}
              </div>
            </div>
          )}

          {/* 6. Student Reviews Section */}
          <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Student Reviews</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Average Rating: ★ {course.avg_rating || 4.8} ({course.reviews?.length || 0} reviews)
                </p>
              </div>

              {course.isEnrolled && (
                <button onClick={() => setShowReviewModal(true)} className="btn btn-primary btn-sm">
                  <Star size={16} /> Write a Review
                </button>
              )}
            </div>

            {(!course.reviews || course.reviews.length === 0) ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No reviews submitted yet for this course. Be the first to review after enrolling!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {course.reviews.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Card */}
        <div>
          <div className="card" style={{ padding: '1.75rem', borderRadius: '16px', position: 'sticky', top: '90px' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.5rem' }}>
              {course.price == 0 ? 'Free' : `$${course.price}`}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Full lifetime access to video curriculum and downloadable resources.
            </p>

            {course.isEnrolled ? (
              <Link to={`/learn/${course.id}`} className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                <PlayCircle size={18} />
                Continue Learning
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>This course includes:</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li className="flex items-center gap-2"><Clock size={15} color="var(--primary)" /> {course.duration} on-demand video</li>
                <li className="flex items-center gap-2"><BookOpen size={15} color="var(--primary)" /> {course.lessons?.length || 0} practical lessons</li>
                <li className="flex items-center gap-2"><Download size={15} color="var(--primary)" /> Downloadable PDF study notes</li>
                <li className="flex items-center gap-2"><Award size={15} color="var(--primary)" /> Certificate of Completion</li>
                <li className="flex items-center gap-2"><Globe size={15} color="var(--primary)" /> Access on Mobile and Desktop</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`Review: ${course.title}`}
      >
        <form onSubmit={handleReviewSubmit}>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <Star
                    size={28}
                    fill={star <= reviewRating ? '#f59e0b' : 'none'}
                    color={star <= reviewRating ? '#f59e0b' : 'var(--text-light)'}
                  />
                </button>
              ))}
              <span style={{ fontWeight: 700, marginLeft: '0.5rem', fontSize: '1.1rem' }}>
                {reviewRating} / 5 Stars
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Feedback / Review</label>
            <textarea
              required
              rows={4}
              placeholder="What did you think of the course curriculum, videos, and study guides?"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className="btn btn-primary"
            >
              <Send size={16} />
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
