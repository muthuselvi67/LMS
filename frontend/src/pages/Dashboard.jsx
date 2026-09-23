import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentService, certificateService, courseService } from '../services/courseService';
import { CourseProgress } from '../components/CourseProgress';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  PlayCircle,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [myCoursesRes, certRes, allCoursesRes] = await Promise.all([
          enrollmentService.getMyCourses(),
          certificateService.getMyCertificates(),
          courseService.getCourses({ sort: 'popular' })
        ]);

        if (myCoursesRes.success) setEnrolledCourses(myCoursesRes.data);
        if (certRes.success) setCertificates(certRes.data);
        if (allCoursesRes.success) {
          // Filter out already enrolled
          const enrolledIds = (myCoursesRes.data || []).map(c => c.id);
          const rec = (allCoursesRes.data || []).filter(c => !enrolledIds.includes(c.id)).slice(0, 3);
          setRecommended(rec);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Stats calculation
  const totalEnrolled = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(c => c.progress === 100 || c.enrollment_status === 'completed').length;
  const inProgressCourses = totalEnrolled - completedCourses;
  const totalCertificates = certificates.length;
  const learningHours = Math.max(1, (enrolledCourses.reduce((acc, c) => acc + (c.completed_lessons || 0), 0) * 0.4)).toFixed(1);

  const statsCards = [
    { title: 'Total Enrolled', value: totalEnrolled, icon: BookOpen, color: 'var(--primary)', bg: 'var(--primary-light)' },
    { title: 'In Progress', value: inProgressCourses, icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
    { title: 'Completed', value: completedCourses, icon: CheckCircle2, color: 'var(--success)', bg: 'var(--success-light)' },
    { title: 'Certificates', value: totalCertificates, icon: Award, color: '#8b5cf6', bg: '#ede9fe' },
    { title: 'Learning Hours', value: `${learningHours}h`, icon: TrendingUp, color: '#06b6d4', bg: '#cffafe' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)',
        color: '#ffffff',
        padding: '2.25rem',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
          <div className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Student Dashboard
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Continue learning and improve your skills. You have {inProgressCourses} courses in progress.
          </p>
          <Link to="/courses" className="btn" style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 700 }}>
            Browse Available Courses
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Decorative Circle */}
        <div style={{
          position: 'absolute',
          right: '-40px',
          bottom: '-40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* 2. 5 Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {stat.title}
                </span>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: stat.bg,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Continue Learning Section */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Continue Learning</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Pick up right where you left off
            </p>
          </div>
          <Link to="/my-learning" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
            View All ({totalEnrolled})
          </Link>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading your courses...
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <BookOpen size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              You haven't enrolled in any courses yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
              Explore our comprehensive courses on HTML, CSS, JavaScript, React, MySQL, and full-stack engineering.
            </p>
            <Link to="/courses" className="btn btn-primary">
              Explore Available Courses
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="card flex flex-col"
                style={{ borderRadius: '16px', overflow: 'hidden' }}
              >
                {/* Course Image */}
                <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span className={`badge ${course.progress === 100 ? 'badge-success' : 'badge-primary'}`}>
                      {course.progress === 100 ? 'Completed' : `${course.progress}% Complete`}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', lineHeight: 1.3 }}>
                    {course.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Instructor: {course.instructor || 'Learnlike Instructor'}
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1.25rem', marginTop: 'auto' }}>
                    <CourseProgress
                      progress={course.progress}
                      completedLessons={course.completed_lessons}
                      totalLessons={course.total_lessons}
                    />
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/learn/${course.id}`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <PlayCircle size={16} />
                      {course.progress === 100 ? 'Review Lessons' : 'Continue Learning'}
                    </Link>
                    {course.progress === 100 && (
                      <Link
                        to="/certificates"
                        className="btn btn-secondary btn-sm"
                        title="View Certificate"
                      >
                        <Award size={16} color="var(--success)" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Recommended Courses to Explore */}
      {recommended.length > 0 && (
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Recommended for You</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Expand your tech stack with these high-rated courses
              </p>
            </div>
            <Link to="/courses" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
              See All Courses
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {recommended.map((course) => (
              <div key={course.id} className="card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
                <div style={{ height: '140px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {course.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.short_description || course.description}
                </p>
                <Link to={`/courses/${course.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  View Course Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
