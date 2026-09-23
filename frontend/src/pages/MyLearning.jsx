import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../services/courseService';
import { CourseProgress } from '../components/CourseProgress';
import { BookOpen, PlayCircle, Award, Compass, Clock, CheckCircle2 } from 'lucide-react';

export const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, in_progress, completed

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await enrollmentService.getMyCourses();
        if (res.success) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => {
    if (filter === 'in_progress') return c.progress < 100;
    if (filter === 'completed') return c.progress === 100 || c.enrollment_status === 'completed';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>My Learning</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Track and manage your enrolled course journeys
          </p>
        </div>

        {/* Tab Filters */}
        <div className="card flex items-center p-1" style={{ padding: '0.25rem', borderRadius: '10px', gap: '0.25rem' }}>
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            All Courses ({courses.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`btn btn-sm ${filter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            In Progress ({courses.filter(c => c.progress < 100).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            Completed ({courses.filter(c => c.progress === 100).length})
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading your learning courses...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <BookOpen size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {filter === 'all' ? 'No Enrolled Courses Found' : `No ${filter.replace('_', ' ')} courses`}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
            Discover hundreds of interactive coding lessons in HTML, CSS, JavaScript, React, and MySQL.
          </p>
          <Link to="/courses" className="btn btn-primary">
            <Compass size={16} /> Browse Available Courses
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredCourses.map((course) => (
            <div key={course.id} className="card flex flex-col" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
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

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', lineHeight: 1.3 }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Instructor: {course.instructor || 'Learnlike Instructor'}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: '1.25rem', marginTop: 'auto' }}>
                  <CourseProgress
                    progress={course.progress}
                    completedLessons={course.completed_lessons}
                    totalLessons={course.total_lessons}
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  <Link to={`/courses/${course.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    View Course
                  </Link>

                  <Link to={`/learn/${course.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <PlayCircle size={16} />
                    {course.progress === 100 ? 'Review' : 'Continue'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
