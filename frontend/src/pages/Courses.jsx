import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { courseService, categoryService, enrollmentService } from '../services/courseService';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters state from search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [level, setLevel] = useState(searchParams.get('level') || 'all');
  const [price, setPrice] = useState(searchParams.get('price') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // Load categories and enrolled courses
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const catRes = await categoryService.getCategories();
        if (catRes.success) setCategories(catRes.data);

        if (isAuthenticated) {
          const myRes = await enrollmentService.getMyCourses();
          if (myRes.success) {
            setEnrolledCourseIds(myRes.data.map((c) => c.id));
          }
        }
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    };
    fetchInitial();
  }, [isAuthenticated]);

  // Load courses based on active filters
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category && category !== 'all') params.category = category;
        if (level && level !== 'all') params.level = level;
        if (price && price !== 'all') params.price = price;
        if (sort) params.sort = sort;

        const res = await courseService.getCourses(params);
        if (res.success) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, category, level, price, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (search) prev.set('search', search);
      else prev.delete('search');
      return prev;
    });
  };

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      return navigate('/login', { state: { from: { pathname: `/courses/${courseId}` } } });
    }

    setEnrollingId(courseId);
    setFeedback(null);
    try {
      const res = await enrollmentService.enroll(courseId);
      if (res.success) {
        setEnrolledCourseIds(prev => [...prev, courseId]);
        setFeedback({ type: 'success', message: '🎉 Successfully enrolled! Redirecting to lesson...' });
        setTimeout(() => {
          navigate(`/learn/${courseId}`);
        }, 1000);
      }
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to enroll in course.'
      });
    } finally {
      setEnrollingId(null);
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory('all');
    setLevel('all');
    setPrice('all');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>Available Courses</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Explore our structured software engineering courses and start learning today.
        </p>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <div>{feedback.message}</div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search title, instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
          </form>

          {/* Category dropdown */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name} ({cat.course_count || 1})
                </option>
              ))}
            </select>
          </div>

          {/* Level dropdown */}
          <div>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="form-select"
            >
              <option value="all">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>

          {/* Sort dropdown */}
          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-select"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="popular">Sort by: Most Popular</option>
              <option value="rating">Sort by: Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Clear Filters indicator */}
        {(search || category !== 'all' || level !== 'all' || price !== 'all' || sort !== 'newest') && (
          <div className="flex items-center justify-between" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Showing filtered results ({courses.length} courses found)
            </span>
            <button
              onClick={clearAllFilters}
              style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
            >
              <X size={14} /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading available courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <BookOpen size={40} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Courses Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try adjusting your search criteria or resetting filters.
          </p>
          <button onClick={clearAllFilters} className="btn btn-primary btn-sm">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled}
                onEnroll={handleEnroll}
                isEnrolling={enrollingId === course.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
