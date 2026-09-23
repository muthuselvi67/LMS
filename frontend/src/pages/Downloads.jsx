import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../services/courseService';
import { PDFResource } from '../components/PDFResource';
import { Download, FileText, BookOpen, Compass, Search } from 'lucide-react';

export const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await resourceService.getStudentDownloads();
        if (res.success) {
          setDownloads(res.data);
        }
      } catch (err) {
        console.error('Error fetching downloads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  const filteredDownloads = downloads.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.course_title && d.course_title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>My Downloads</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            All downloadable course study guides, cheatsheets and PDF notes
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search downloads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading downloadable PDF notes...
        </div>
      ) : filteredDownloads.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <FileText size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {search ? 'No Matching Downloads Found' : 'No Downloadable PDF Notes Yet'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
            Enroll in courses to unlock official PDF study cheatsheets and full course notes.
          </p>
          <Link to="/courses" className="btn btn-primary">
            <Compass size={16} /> Explore Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredDownloads.map((item) => (
            <PDFResource key={item.id} resource={item} showCourseTitle={true} />
          ))}
        </div>
      )}
    </div>
  );
};
