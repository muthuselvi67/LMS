const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const progressRoutes = require('./routes/progressRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (PDFs)
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
const pdfsPath = path.join(uploadsPath, 'pdfs');
if (!fs.existsSync(pdfsPath)) {
  fs.mkdirSync(pdfsPath, { recursive: true });
}

// Generate starter sample PDFs if not exist
const starterPdfs = [
  'html-complete-notes.pdf',
  'css-complete-notes.pdf',
  'javascript-notes.pdf',
  'react-notes.pdf',
  'mysql-notes.pdf',
  'sql-notes.pdf',
  'fullstack-notes.pdf'
];

starterPdfs.forEach(file => {
  const filePath = path.join(pdfsPath, file);
  if (!fs.existsSync(filePath)) {
    const title = file.replace(/-/g, ' ').replace('.pdf', '').toUpperCase();
    const minimalPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 140 >> stream
BT
/F1 22 Tf
50 720 Td
(LEARNLIKE LMS - OFFICIAL STUDY GUIDE) Tj
/F1 14 Tf
0 -40 Td
(${title}) Tj
/F1 11 Tf
0 -30 Td
(Learn Skills. Build Projects. Grow Your Career.) Tj
ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000060 00000 n
0000000117 00000 n
0000000227 00000 n
0000000418 00000 n
trailer << /Size 6 /Root 1 0 R >>
startxref
487
%%EOF`;
    fs.writeFileSync(filePath, minimalPdf);
  }
});

app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Learnlike LMS API is online and operational',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server and initialize database
app.listen(PORT, async () => {
  console.log(`===========================================`);
  console.log(`  LEARNLIKE LMS API Server running on port ${PORT}`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`===========================================`);
  
  await initDatabase();
});
