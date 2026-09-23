import React from 'react';
import { FileText, Download } from 'lucide-react';
import { resourceService } from '../services/courseService';

export const PDFResource = ({ resource, showCourseTitle = false }) => {
  const downloadUrl = resourceService.getDownloadUrl(resource.id);

  return (
    <div
      className="card flex items-center justify-between"
      style={{
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        transition: 'transform 0.15s ease, border-color 0.15s ease'
      }}
    >
      <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
        {/* PDF Icon container */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--danger-light)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <FileText size={22} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{
            fontSize: '0.925rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: '0.2rem'
          }}>
            {resource.title}
          </h4>
          <div className="flex items-center gap-2" style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <span>{resource.file_name}</span>
            <span>•</span>
            <span className="badge badge-gray" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
              {resource.file_size || 'PDF'}
            </span>
            {showCourseTitle && resource.course_title && (
              <>
                <span>•</span>
                <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{resource.course_title}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <a
        href={downloadUrl}
        download
        className="btn btn-secondary btn-sm"
        style={{ marginLeft: '1rem', flexShrink: 0 }}
      >
        <Download size={15} />
        <span>Download PDF</span>
      </a>
    </div>
  );
};
