import React, { useState, useMemo } from 'react';
import { PlayCircle, CheckCircle, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { CourseProgress } from './CourseProgress';

export const LessonSidebar = ({ lessons = [], activeLessonId, onSelectLesson, onToggleComplete, progressData, courseTitle }) => {
  // Group lessons by section_name
  const sections = useMemo(() => {
    const map = {};
    lessons.forEach((lesson) => {
      const sec = lesson.section_name || 'Section 1 - Course Fundamentals';
      if (!map[sec]) {
        map[sec] = [];
      }
      map[sec].push(lesson);
    });
    return Object.entries(map).map(([name, items]) => ({ name, items }));
  }, [lessons]);

  // Open active section by default
  const [openSections, setOpenSections] = useState(() => {
    const initial = {};
    sections.forEach((sec, idx) => {
      initial[sec.name] = true;
    });
    return initial;
  });

  const toggleSection = (name) => {
    setOpenSections(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const completedIds = progressData?.completedLessonIds || [];

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: '800px'
    }}>
      {/* Header */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
          {courseTitle || 'Course Curriculum'}
        </h4>

        {progressData && (
          <CourseProgress
            progress={progressData.progress}
            completedLessons={progressData.completedLessons}
            totalLessons={progressData.totalLessons}
            height={6}
          />
        )}
      </div>

      {/* Sections & Lessons list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
        {sections.map((section, secIdx) => {
          const isOpen = openSections[section.name] !== false;
          const sectionCompletedCount = section.items.filter(item => completedIds.includes(item.id)).length;

          return (
            <div key={section.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.name)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-hover)',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isOpen ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    {section.name}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 500 }}>
                  {sectionCompletedCount}/{section.items.length}
                </span>
              </button>

              {/* Lessons */}
              {isOpen && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {section.items.map((lesson, lessonIdx) => {
                    const isActive = lesson.id === activeLessonId;
                    const isDone = completedIds.includes(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onSelectLesson(lesson);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                          borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                          borderTop: 'none',
                          borderRight: 'none',
                          borderBottom: 'none',
                          textAlign: 'left',
                          transition: 'background-color 0.15s ease',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleComplete) {
                                onToggleComplete(lesson.id);
                              }
                            }}
                            title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '2px',
                              margin: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              borderRadius: '50%',
                              flexShrink: 0,
                              transition: 'transform 0.15s ease, opacity 0.15s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.25)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                          >
                            {isDone ? (
                              <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0 }} />
                            ) : (
                              <PlayCircle size={18} color={isActive ? 'var(--primary)' : 'var(--text-light)'} style={{ flexShrink: 0 }} />
                            )}
                          </button>

                          <span style={{
                            fontSize: '0.825rem',
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'var(--primary)' : 'var(--text-main)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {lesson.title}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                          {lesson.duration || '10m'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
