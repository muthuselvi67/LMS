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



  const [allCoursesList, setAllCoursesList] = useState([]);

  // Fetch baseline list of all courses for computing level and category counts
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await courseService.getCourses({});
        if (res.success) setAllCoursesList(res.data);
      } catch (err) {}
    };
    fetchAll();
  }, []);

  // Compute context-aware category counts based on active level filter
  const categoryCounts = React.useMemo(() => {
    const map = { total: 0 };
    const filteredByLevel = level !== 'all'
      ? allCoursesList.filter(c => c.level === level || c.level === 'All Levels')
      : allCoursesList;

    map.total = filteredByLevel.length;

    filteredByLevel.forEach(c => {
      const slug = c.category_slug;
      if (slug) {
        map[slug] = (map[slug] || 0) + 1;
      }
    });
    return map;
  }, [allCoursesList, level]);

  // Compute context-aware level counts based on active category filter
  const levelCounts = React.useMemo(() => {
    const filteredByCat = category !== 'all'
      ? allCoursesList.filter(c => 
          c.category_slug === category || 
          c.category_id == category ||
          (c.title && c.title.toLowerCase().includes(category.toLowerCase())) ||
          (c.category_name && c.category_name.toLowerCase().includes(category.toLowerCase()))
        )
      : allCoursesList;

    const counts = { Beginner: 0, Intermediate: 0, Advanced: 0, 'All Levels': 0, total: filteredByCat.length };
    filteredByCat.forEach((c) => {
      if (counts[c.level] !== undefined) {
        counts[c.level]++;
      }
    });
    return counts;
  }, [allCoursesList, category]);

  // Sync filters from URL search params whenever URL changes
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'all';
    const urlLevel = searchParams.get('level') || 'all';
    const urlPrice = searchParams.get('price') || 'all';
    const urlSort = searchParams.get('sort') || 'newest';

    setSearch(urlSearch);
    setCategory(urlCategory);
    setLevel(urlLevel);
    setPrice(urlPrice);
    setSort(urlSort);
  }, [searchParams]);

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
      const next = new URLSearchParams(prev);
      if (search.trim()) next.set('search', search.trim());
      else next.delete('search');
      return next;
    });
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (val && val !== 'all') next.set('category', val);
      else next.delete('category');
      return next;
    });
  };

  const handleLevelChange = (val) => {
    setLevel(val);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (val && val !== 'all') next.set('level', val);
      else next.delete('level');
      return next;
    });
  };

  const handleSortChange = (val) => {
    setSort(val);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (val && val !== 'newest') next.set('sort', val);
      else next.delete('sort');
      return next;
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
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', margin: '10px auto' }}>
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
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="form-select"
            >
              <option value="all">
                All Categories ({categoryCounts.total || 0})
              </option>
              {categories.map((cat) => {
                const count = categoryCounts[cat.slug] || 0;
                return (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Level dropdown */}
          <div>
            <select
              value={level}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="form-select"
            >
              <option value="all">
                All Skill Levels ({levelCounts.total || 0})
              </option>
              <option value="Beginner">Beginner ({levelCounts.Beginner || 0})</option>
              <option value="Intermediate">Intermediate ({levelCounts.Intermediate || 0})</option>
              <option value="Advanced">Advanced ({levelCounts.Advanced || 0})</option>
              <option value="All Levels">Flexible ({levelCounts['All Levels'] || 0})</option>
            </select>
          </div>

          {/* Sort dropdown */}
          <div>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
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
              Showing results for {search ? <strong>"{search}"</strong> : 'selected filters'} ({courses.length} courses found)
            </span>
            <button
              onClick={clearAllFilters}
              style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={14} /> Clear search & filters
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
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <BookOpen size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Matching Courses Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            {category !== 'all' && level !== 'all'
              ? `No ${level} level courses currently available in ${category.toUpperCase()}. Try resetting one of the filters below.`
              : 'Try adjusting your search criteria or resetting filters.'}
          </p>
          <div className="flex items-center justify-center gap-3" style={{ flexWrap: 'wrap' }}>
            {category !== 'all' && (
              <button onClick={() => handleCategoryChange('all')} className="btn btn-secondary btn-sm">
                View All {level !== 'all' ? level : ''} Courses
              </button>
            )}
            {level !== 'all' && (
              <button onClick={() => handleLevelChange('all')} className="btn btn-secondary btn-sm">
                View All {category !== 'all' ? category.toUpperCase() : ''} Courses
              </button>
            )}
            <button onClick={clearAllFilters} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          </div>
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
