import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService, categoryService } from '../services/courseService';
import { CourseCard } from '../components/CourseCard';
import { ReviewCard } from '../components/ReviewCard';
import {
  Sparkles,
  BookOpen,
  Award,
  Download,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Code,
  Palette,
  FileCode,
  Atom,
  Database,
  Cpu
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [popularCourses, setPopularCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          courseService.getCourses({ sort: 'popular' }),
          categoryService.getCategories()
        ]);
        if (courseRes.success) setPopularCourses(courseRes.data.slice(0, 6));
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const whyUsCards = [
    {
      icon: BookOpen,
      title: 'Expert Learning Content',
      desc: 'Structured curricula crafted by industry experts covering fundamental to advanced mastery.'
    },
    {
      icon: Layers,
      title: 'Practical Projects',
      desc: 'Build real-world web apps, databases, and responsive layouts that look great on your portfolio.'
    },
    {
      icon: Download,
      title: 'Downloadable Resources',
      desc: 'Comprehensive PDF study notes, architecture cheatsheets, and code guides for offline study.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      desc: 'Real-time granular lesson progress percentage calculation with automated milestone indicators.'
    },
    {
      icon: Award,
      title: 'Verified Certificates',
      desc: 'Earn official, verifiable Certificates of Completion upon 100% course curriculum completion.'
    },
    {
      icon: Clock,
      title: 'Learn at Your Own Pace',
      desc: 'Lifetime access to video lessons, quizzes, and resources. Learn anytime, anywhere, on any device.'
    }
  ];

  const categoryIcons = {
    'HTML': Code,
    'CSS': Palette,
    'JavaScript': FileCode,
    'React.js': Atom,
    'MySQL': Database,
    'SQL': Layers,
    'Full Stack Development': Cpu
  };

  const sampleReviews = [
    {
      id: 1,
      user_name: 'Alex Johnson',
      rating: 5,
      comment: 'Learnlike LMS helped me master React.js and SQL in just 4 weeks. The step-by-step videos and downloadable PDF notes are top-notch!',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_name: 'Priya Sharma',
      rating: 5,
      comment: 'The HTML5 and CSS3 courses are phenomenal. The interface is clean, fast, and the progress tracking kept me motivated until completion.',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      user_name: 'Marcus Vance',
      rating: 5,
      comment: 'Getting a verifiable Certificate of Completion after finishing all MySQL lessons was super rewarding. Fantastic platform!',
      created_at: new Date().toISOString()
    }
  ];

  const faqs = [
    {
      q: 'How does Learnlike LMS work?',
      a: 'Learnlike LMS provides structured video-based programming courses. You can enroll in courses, stream lessons, download official study PDF notes, complete modules, and earn completion certificates.'
    },
    {
      q: 'Are the course PDF resources free to download?',
      a: 'Yes! Once you enroll in any course on Learnlike LMS, all accompanying PDF reference notes and cheatsheets are immediately available in your downloads section.'
    },
    {
      q: 'How do I earn a Certificate of Completion?',
      a: 'When you complete 100% of all lessons in a course, our progress engine automatically generates your unique Certificate of Completion, which you can print or download.'
    },
    {
      q: 'What technologies can I learn on Learnlike LMS?',
      a: 'You can master HTML5, CSS3, JavaScript ES6+, React.js, MySQL, SQL, and Full Stack Web Development with Node.js and Express.'
    },
    {
      q: 'Is Learnlike LMS suitable for beginners?',
      a: 'Absolutely! Our courses start from absolute beginner fundamentals and gradually build up to advanced production-level architectures.'
    }
  ];

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 6rem 0',
        background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-main) 100%)',
        borderBottom: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '3.5rem'
          }}>
            {/* Left Content */}
            <div>
              <h1 style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                color: 'var(--text-main)'
              }}>
                Learn Skills. <br />
                <span style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Build Projects.
                </span> <br />
                Grow Your Career.
              </h1>

              <p style={{
                fontSize: '1.125rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '540px'
              }}>
                Master HTML, CSS, JavaScript, React.js, MySQL and SQL through structured courses, practical lessons and downloadable learning resources.
              </p>

              <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
                <Link to="/courses" className="btn btn-primary btn-lg">
                  Explore Courses
                  <ArrowRight size={18} />
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Start Learning Free
                </Link>
              </div>

              {/* Key Trust Metrics */}
              <div className="flex items-center gap-6" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>7+</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Core Tech Tracks</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>100%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Free Access</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Verified</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Certificates</div>
                </div>
              </div>
            </div>

            {/* Right Hero Illustration / Visual Card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: '-20px',
                background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
                zIndex: 0
              }} />

              <div className="card" style={{
                position: 'relative',
                zIndex: 1,
                padding: '2rem',
                borderRadius: '24px',
                boxShadow: 'var(--shadow-xl)',
                border: '1.5px solid var(--border-color)',
                background: 'var(--bg-card)'
              }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  </div>
                  <span className="badge badge-primary">Interactive LMS</span>
                </div>

                {/* Course preview snippet inside hero */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', height: '200px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                    alt="Online Learning"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Full Stack Web Development
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    React.js • Express.js • MySQL • JWT Auth
                  </p>
                </div>

                {/* Simulated Progress bar */}
                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div className="flex items-center justify-between" style={{ fontSize: '0.825rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                    <span>Course Progress</span>
                    <span style={{ color: 'var(--primary)' }}>78% Completed</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '999px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR COURSES SECTION */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="flex items-center justify-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Curated Curriculum</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Popular Courses</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Start learning with our most popular software engineering courses.
              </p>
            </div>
            <Link to="/courses" className="btn btn-outline">
              View All Courses
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading popular courses...
            </div>
          ) : (
            <div className="course-grid">
              {popularCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. WHY LEARN WITH US */}
      <section id="why-us" style={{
        padding: '5rem 0',
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>The Learnlike Advantage</div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Why Learn With Us
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Everything you need to master modern web technologies, build complete applications, and launch your software development career.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem'
          }}>
            {whyUsCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '2rem',
                    borderRadius: '16px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. COURSE CATEGORIES */}
      <section id="categories" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Domain Specializations</div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Explore Categories
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Select a category below to explore focused curriculums and project lessons.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.name] || Code;
              return (
                <div
                  key={cat.id}
                  className="card"
                  style={{
                    padding: '1.75rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/courses?category=${cat.slug}`)}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <Icon size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '1.25rem' }}>
                    {cat.course_count || 1} Courses Available
                  </p>
                  <Link
                    to={`/courses?category=${cat.slug}`}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 'auto', width: '100%' }}
                  >
                    Explore
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. STUDENT REVIEWS */}
      <section style={{
        padding: '5rem 0',
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Success Stories</div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              What Our Students Say
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Join thousands of learners achieving their career milestones on Learnlike LMS.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {sampleReviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Got Questions?</div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Everything you need to know about our courses, certifications, and resources.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{ borderRadius: '12px', overflow: 'hidden' }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'var(--text-main)'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      color="var(--text-muted)"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                        marginLeft: '1rem'
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 1.5rem 1.25rem 1.5rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.925rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to Start Your Learning Journey?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Create your account today and gain immediate access to all courses, PDF study notes, and completion certificates.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', color: 'var(--primary)', borderColor: '#ffffff' }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
