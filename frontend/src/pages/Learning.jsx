import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { courseService, lessonService, progressService, resourceService } from '../services/courseService';
import { LessonSidebar } from '../components/LessonSidebar';
import { PDFResource } from '../components/PDFResource';
import { CourseProgress } from '../components/CourseProgress';
import {
  PlayCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const Learning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);

  useEffect(() => {
    fetchCourseAndProgress();
  }, [courseId]);

  const fetchCourseAndProgress = async () => {
    setLoading(true);
    try {
      const [courseRes, lessonsRes, progRes, resRes] = await Promise.all([
        courseService.getCourseById(courseId),
        lessonService.getLessonsByCourse(courseId),
        progressService.getCourseProgress(courseId),
        resourceService.getCourseResources(courseId).catch(() => ({ success: false, data: [] }))
      ]);

      if (courseRes.success) setCourse(courseRes.data);
      if (lessonsRes.success) {
        setLessons(lessonsRes.data);
        if (lessonsRes.data.length > 0) {
          // Set first uncompleted lesson, or first lesson
          const completedIds = progRes?.data?.completedLessonIds || [];
          const firstUnfinished = lessonsRes.data.find(l => !completedIds.includes(l.id));
          setActiveLesson(firstUnfinished || lessonsRes.data[0]);
        }
      }
      if (progRes.success) {
        setProgressData(progRes.data);
        if (progRes.data.progress === 100) {
          setShowCompletionBanner(true);
        }
      }
      if (resRes.success) setResources(resRes.data);
    } catch (err) {
      console.error('Error fetching learning page data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentIndex = lessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const isCurrentCompleted = progressData?.completedLessonIds?.includes(activeLesson?.id);

  const toggleLessonCompleted = async () => {
    if (!activeLesson) return;
    setUpdatingProgress(true);
    try {
      const newStatus = !isCurrentCompleted;
      const res = await progressService.markProgress(courseId, activeLesson.id, newStatus);
      if (res.success) {
        // Refresh progress
        const progRes = await progressService.getCourseProgress(courseId);
        if (progRes.success) {
          setProgressData(progRes.data);
          if (progRes.data.progress === 100) {
            setShowCompletionBanner(true);
            try {
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update lesson progress.');
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading interactive learning player...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Course Header Bar */}
      <div className="card flex items-center justify-between" style={{ padding: '1rem 1.5rem', borderRadius: '16px', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="flex items-center gap-3">
          <Link to={`/courses/${courseId}`} className="btn btn-secondary btn-sm" title="Back to course landing">
            <ChevronLeft size={16} /> Course Overview
          </Link>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {course?.title || 'Course Learning Player'}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Lesson {currentIndex + 1} of {lessons.length}: <strong>{activeLesson?.title}</strong>
            </div>
          </div>
        </div>

        {/* Progress pill & Certificate link */}
        <div className="flex items-center gap-3">
          {progressData && (
            <div style={{ minWidth: '180px' }}>
              <CourseProgress
                progress={progressData.progress}
                completedLessons={progressData.completedLessons}
                totalLessons={progressData.totalLessons}
                height={6}
              />
            </div>
          )}

          {progressData?.progress === 100 && (
            <Link to="/certificates" className="btn btn-primary btn-sm">
              <Award size={16} />
              View Certificate
            </Link>
          )}
        </div>
      </div>

      {/* 100% Completion Notification Banner */}
      {showCompletionBanner && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          padding: '1.5rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 20px rgba(16, 185, 129, 0.25)'
        }}>
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div className="flex items-center gap-3">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={26} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  🎉 Congratulations! You have completed all lessons!
                </h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.95 }}>
                  Your official Certificate of Completion has been generated and is ready for download.
                </p>
              </div>
            </div>

            <Link to="/certificates" className="btn" style={{ backgroundColor: '#ffffff', color: '#059669', fontWeight: 700 }}>
              Claim Certificate
            </Link>
          </div>
        </div>
      )}

      {/* 2-Column Learning Interface */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2.5fr) minmax(320px, 1fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Video Player */}
          <div className="card" style={{ padding: 0, borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000' }}>
            {activeLesson?.video_url ? (
              <video
                key={activeLesson.video_url}
                controls
                autoPlay={false}
                playsInline
                style={{ width: '100%', height: '420px', objectFit: 'contain', backgroundColor: '#000' }}
                src={activeLesson.video_url}
              >
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <div style={{ height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column', gap: '1rem' }}>
                <PlayCircle size={48} />
                <span>No video source assigned for this lesson</span>
              </div>
            )}
          </div>

          {/* Navigation Controls & Mark Complete */}
          <div className="card flex items-center justify-between" style={{ padding: '1.25rem', borderRadius: '16px', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => prevLesson && handleSelectLesson(prevLesson)}
              disabled={!prevLesson}
              className="btn btn-secondary btn-sm"
            >
              <ChevronLeft size={16} />
              Previous Lesson
            </button>

            {/* Mark Completed button */}
            <button
              onClick={toggleLessonCompleted}
              disabled={updatingProgress}
              className={`btn btn-sm ${isCurrentCompleted ? 'btn-secondary' : 'btn-primary'}`}
              style={{
                borderColor: isCurrentCompleted ? 'var(--success)' : undefined,
                color: isCurrentCompleted ? 'var(--success)' : undefined
              }}
            >
              {isCurrentCompleted ? (
                <>
                  <CheckCircle size={16} color="var(--success)" />
                  Completed (Click to undo)
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Mark as Completed
                </>
              )}
            </button>

            <button
              onClick={() => nextLesson && handleSelectLesson(nextLesson)}
              disabled={!nextLesson}
              className="btn btn-secondary btn-sm"
            >
              Next Lesson
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Lesson Details */}
          <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {activeLesson?.title}
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {activeLesson?.section_name} • Duration: {activeLesson?.duration || '15 mins'}
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {activeLesson?.description || 'In this lesson, you will learn the core concepts and practical implementations required for production software.'}
            </p>
          </div>

          {/* Lesson Resources / PDFs */}
          {resources.length > 0 && (
            <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  Course Downloads & PDF Resources
                </h4>
                <Link to="/downloads" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                  View All Downloads
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resources.map((res) => (
                  <PDFResource key={res.id} resource={res} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Curriculum Navigation Sidebar */}
        <div style={{ position: 'sticky', top: '85px' }}>
          <LessonSidebar
            lessons={lessons}
            activeLessonId={activeLesson?.id}
            onSelectLesson={handleSelectLesson}
            progressData={progressData}
            courseTitle={course?.title}
          />
        </div>
      </div>
    </div>
  );
};
