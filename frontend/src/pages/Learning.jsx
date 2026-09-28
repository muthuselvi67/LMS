import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { courseService, lessonService, progressService, resourceService, certificateService } from '../services/courseService';
import { LessonSidebar } from '../components/LessonSidebar';
import { PDFResource } from '../components/PDFResource';
import { CourseProgress } from '../components/CourseProgress';
import { CertificateCard } from '../components/CertificateCard';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
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
  RefreshCw,
  Check,
  Lock
} from 'lucide-react';

export const Learning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  const [completedToast, setCompletedToast] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certData, setCertData] = useState(null);
  const [loadingCert, setLoadingCert] = useState(false);

  const iframeRef = useRef(null);

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
          if (progRes.data.certificate) {
            setCertData(progRes.data.certificate);
          }
        }
      }
      if (resRes.success) setResources(resRes.data);
    } catch (err) {
      console.error('Error fetching learning page data:', err);
    } finally {
      setLoading(false);
    }
  };

  const isCourseCompleted =
    progressData?.progress === 100 ||
    (lessons.length > 0 && (progressData?.completedLessons || progressData?.completedLessonIds?.length) === lessons.length);

  const handleOpenCertificate = async () => {
    if (!isCourseCompleted) return;
    setLoadingCert(true);
    try {
      let cert = certData;
      if (!cert) {
        const res = await certificateService.getCertificate(courseId).catch(() => null);
        if (res?.success && res.data) {
          cert = res.data;
        } else {
          const genRes = await certificateService.generateCertificate(courseId).catch(() => null);
          if (genRes?.success && genRes.data) {
            cert = genRes.data;
          }
        }
      }
      if (cert) {
        setCertData(cert);
        setShowCertModal(true);
      } else {
        alert('Your certificate will be ready once all lessons are completed!');
      }
    } catch (err) {
      console.error('Error opening certificate:', err);
    } finally {
      setLoadingCert(false);
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

  // Universal toggle completion with instant optimistic update
  const handleToggleLessonCompleted = async (targetLessonId, explicitStatus = null) => {
    const targetId = targetLessonId || activeLesson?.id;
    if (!targetId) return;

    const currentCompleted = progressData?.completedLessonIds?.includes(targetId) || false;
    const newStatus = explicitStatus !== null ? explicitStatus : !currentCompleted;

    // Avoid redundant API calls if already in target state
    if (explicitStatus !== null && currentCompleted === explicitStatus) {
      return;
    }

    // 1. Instant optimistic UI update so tick marks and progress update with zero lag
    setProgressData((prev) => {
      if (!prev) return prev;
      const prevIds = prev.completedLessonIds || [];
      const newIds = newStatus
        ? (prevIds.includes(targetId) ? prevIds : [...prevIds, targetId])
        : prevIds.filter((id) => id !== targetId);

      const total = prev.totalLessons || lessons.length || 1;
      const count = newIds.length;
      const progressPercent = Math.min(100, Math.round((count / total) * 100));

      return {
        ...prev,
        completedLessons: count,
        progress: progressPercent,
        completedLessonIds: newIds
      };
    });

    if (newStatus) {
      const finishedLesson = lessons.find((l) => l.id === targetId);
      setCompletedToast(`Completed: ${finishedLesson?.title || 'Lesson'}! Tick mark added.`);
      setTimeout(() => setCompletedToast(null), 3500);
    }

    // 2. Persist to backend
    setUpdatingProgress(true);
    try {
      const res = await progressService.markProgress(courseId, targetId, newStatus);
      if (res.success) {
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
      console.error('Failed to update progress on backend:', err);
      // Revert if failed
      try {
        const progRes = await progressService.getCourseProgress(courseId);
        if (progRes.success) setProgressData(progRes.data);
      } catch (e) {}
    } finally {
      setUpdatingProgress(false);
    }
  };

  // Next lesson advances (does not force auto-completion unless full video watched)
  const handleNextLesson = () => {
    if (nextLesson) {
      handleSelectLesson(nextLesson);
    }
  };

  // Automatically detect YouTube video finished playback via postMessage & YT Iframe API
  useEffect(() => {
    const handleYouTubeMessage = (e) => {
      try {
        let data = e.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (err) {
            return;
          }
        }
        if (!data) return;

        // In YouTube Iframe API, state 0 or info.playerState 0 means ENDED
        const isEnded =
          (data.event === 'onStateChange' && (data.info === 0 || data.info?.playerState === 0)) ||
          (data.event === 'infoDelivery' && (data.info?.playerState === 0 || data.info?.currentTime >= data.info?.duration - 1));

        if (isEnded && activeLesson?.id) {
          console.log('Full video playback finished detected via postMessage, marking completed:', activeLesson.id);
          handleToggleLessonCompleted(activeLesson.id, true);
        }
      } catch (err) {
        // Ignore third-party origin message parse errors
      }
    };

    window.addEventListener('message', handleYouTubeMessage);
    return () => window.removeEventListener('message', handleYouTubeMessage);
  }, [activeLesson?.id, lessons, progressData]);

  // Tell YouTube iframe to broadcast player events
  const handleIframeLoad = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'listening' }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }),
          '*'
        );
      }
    } catch (err) {}
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

          {isCourseCompleted && (
            <button onClick={handleOpenCertificate} className="btn btn-primary btn-sm">
              <Award size={16} />
              View Certificate
            </button>
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

            <button onClick={handleOpenCertificate} className="btn" style={{ backgroundColor: '#ffffff', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} />
              Download Certificate
            </button>
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
          <div className="card" style={{ padding: 0, borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000', position: 'relative' }}>
            {(() => {
              const url = activeLesson?.video_url;
              if (!url) {
                return (
                  <div style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column', gap: '1rem' }}>
                    <PlayCircle size={48} />
                    <span>No video source assigned for this lesson</span>
                  </div>
                );
              }

              // Detect YouTube URL formats (watch, youtu.be, embed)
              const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
              if (ytMatch && ytMatch[1]) {
                const embedUrl = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
                return (
                  <iframe
                    ref={iframeRef}
                    key={embedUrl}
                    src={embedUrl}
                    title={activeLesson?.title || 'Lesson Video'}
                    style={{ width: '100%', height: '440px', border: 'none', display: 'block' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                  />
                );
              }

              // Direct HTML5 video with automatic fallback for dead links
              return (
                <video
                  key={url}
                  controls
                  autoPlay={false}
                  playsInline
                  style={{ width: '100%', height: '440px', objectFit: 'contain', backgroundColor: '#000', display: 'block' }}
                  src={url}
                  onEnded={() => {
                    if (activeLesson?.id) {
                      console.log('HTML5 video ended, auto-marking completed:', activeLesson.id);
                      handleToggleLessonCompleted(activeLesson.id, true);
                    }
                  }}
                  onTimeUpdate={(e) => {
                    if (activeLesson?.id && e.target.duration > 0) {
                      if (e.target.currentTime >= e.target.duration - 1 || (e.target.currentTime / e.target.duration) >= 0.98) {
                        handleToggleLessonCompleted(activeLesson.id, true);
                      }
                    }
                  }}
                  onError={(e) => {
                    console.warn('Primary video failed, falling back to backup mirror:', e);
                    e.target.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
                    e.target.load();
                  }}
                >
                  Your browser does not support HTML5 video.
                </video>
              );
            })()}
          </div>

          {/* Real-time completion feedback toast */}
          {completedToast && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ecfdf5',
              border: '1px solid #10b981',
              color: '#065f46',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.12)',
              animation: 'fadeIn 0.2s ease-in-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle size={20} color="#10b981" />
                <span>{completedToast}</span>
              </div>
              <button
                onClick={() => setCompletedToast(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065f46', fontSize: '1rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>
          )}

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
              onClick={() => handleToggleLessonCompleted(activeLesson?.id)}
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
              onClick={handleNextLesson}
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

          {/* Official Course Certificate of Completion (Unlocked ONLY after completing all videos) */}
          <div className="card" style={{
            padding: '1.75rem',
            borderRadius: '16px',
            border: isCourseCompleted ? '2px solid #10b981' : '1px solid var(--border-color)',
            background: isCourseCompleted
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.03) 100%)'
              : 'var(--bg-card)'
          }}>
            <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1.25rem' }}>
              <div className="flex items-center gap-4" style={{ flex: 1, minWidth: '280px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: isCourseCompleted ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-subtle)',
                  color: isCourseCompleted ? '#059669' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isCourseCompleted ? <Award size={32} color="#059669" /> : <Lock size={28} color="var(--text-muted)" />}
                </div>

                <div>
                  <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {isCourseCompleted ? 'Official Certificate of Completion' : 'Course Certificate of Completion'}
                    </h4>
                    <span className={`badge ${isCourseCompleted ? 'badge-success' : 'badge-gray'}`}>
                      {isCourseCompleted ? 'Unlocked 🎓' : 'Locked 🔒'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                    {isCourseCompleted
                      ? `Congratulations! You have completed all ${progressData?.totalLessons || lessons.length} lessons in this course. Your verified certificate is ready to download.`
                      : `Complete all ${progressData?.totalLessons || lessons.length} videos to unlock and download your certificate (${progressData?.completedLessons || 0}/${progressData?.totalLessons || lessons.length} completed).`}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isCourseCompleted ? (
                  <button
                    onClick={handleOpenCertificate}
                    disabled={loadingCert}
                    className="btn btn-primary"
                    style={{
                      backgroundColor: '#10b981',
                      borderColor: '#10b981',
                      color: '#ffffff',
                      fontWeight: 700,
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.925rem',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Award size={18} />
                    {loadingCert ? 'Loading...' : 'Download Certificate (PDF)'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn btn-secondary"
                    style={{ opacity: 0.6, cursor: 'not-allowed', padding: '0.75rem 1.25rem' }}
                    title="Complete all course lessons to unlock your certificate"
                  >
                    <Lock size={16} />
                    Locked (Complete All Videos to Download)
                  </button>
                )}
              </div>
            </div>

            {/* Optional Supplementary Study Notes (clearly distinct and collapsible) */}
            {resources.length > 0 && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <details style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '0.75rem 1rem', border: '1px solid var(--border-color)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', userSelect: 'none' }}>
                    📁 Optional Supplementary Study Notes ({resources.length} PDF Reference)
                  </summary>
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {resources.map((res) => (
                      <PDFResource key={res.id} resource={res} />
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>

        {/* Right Curriculum Navigation Sidebar */}
        <div style={{ position: 'sticky', top: '85px' }}>
          <LessonSidebar
            lessons={lessons}
            activeLessonId={activeLesson?.id}
            onSelectLesson={handleSelectLesson}
            onToggleComplete={handleToggleLessonCompleted}
            progressData={progressData}
            courseTitle={course?.title}
          />
        </div>
      </div>

      {/* Certificate Viewer & Download Modal */}
      <Modal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        title="Official Certificate of Completion"
        maxWidth="900px"
      >
        {certData && (
          <CertificateCard
            certificate={certData}
            studentName={certData.student_name || user?.name}
            courseTitle={certData.course_title || course?.title}
          />
        )}
      </Modal>
    </div>
  );
};
