import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { PublicNavbar } from '../components/Navbar';
import { BookOpen, Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const PublicLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '4rem',
        paddingBottom: '2rem'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}>
            {/* Column 1: Brand & Tagline */}
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  color: '#fff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.05em', lineHeight: 1 }}>LL</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)' }}>
                  Learnlike <span style={{ color: 'var(--primary)' }}>LMS</span>
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                "Learn Skills. Build Projects. Grow Your Career." Master HTML, CSS, JavaScript, React, and MySQL with structured industry-standard courses.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                Quick Links
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <li><Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link></li>
                <li><Link to="/courses" style={{ color: 'var(--text-muted)' }}>Available Courses</Link></li>
                <li><a href="/#categories" style={{ color: 'var(--text-muted)' }}>Course Categories</a></li>
                <li><a href="/#why-us" style={{ color: 'var(--text-muted)' }}>Why Learn With Us</a></li>
                <li><a href="/#faq" style={{ color: 'var(--text-muted)' }}>Frequently Asked Questions</a></li>
              </ul>
            </div>

            {/* Column 3: Courses */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                Featured Tracks
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <li>HTML 5 Web Development</li>
                <li>CSS 3 & Responsive Design</li>
                <li>JavaScript Mastery & ES6+</li>
                <li>React.js Frontend Architecture</li>
                <li>MySQL Relational Databases</li>
                <li>Full Stack Engineering</li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                Contact & Support
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <div className="flex items-center gap-2">
                  <Mail size={16} color="var(--primary)" />
                  <span>support@learnlike.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} color="var(--primary)" />
                  <span>+1 (800) 555-LEARN</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} color="var(--primary)" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              © {new Date().getFullYear()} Learnlike LMS. All rights reserved. Built with React, Express, and MySQL.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
