# Learnlike LMS - Production Learning Management System

> **"Learn Skills. Build Projects. Grow Your Career."**

**Learnlike LMS** is a full-stack, production-grade Learning Management System (LMS) web application engineered with a **React.js** frontend, **Node.js & Express.js** REST API backend, and a **MySQL** relational database with **Multer** PDF resource storage, **JWT** authentication, and **bcrypt** password hashing.

---

## 🌟 Key Features

### 🎓 Student Experience
- **Authentication**: Secure JWT registration, login, session persistence, and bcrypt password hashing.
- **LMS Dashboard**: Overview of enrolled courses, real-time learning stats, continue learning quick-resume, and personalized recommendations.
- **Udemy-Style Course Marketplace**: Search by title/instructor/category, multi-attribute filtering (category, skill level, price, duration), and sorting (newest, popular, rating, price).
- **Course Landing Page**: Detailed curriculum outline, learning objectives ("What You'll Learn"), requirements, ratings breakdown, and student reviews.
- **Interactive Video Player**: Dedicated lesson viewer with collapsible curriculum sidebar, HTML5 video player, previous/next lesson controls, and downloadable PDF notes.
- **Progress Tracking**: Granular lesson progress computation (`Completed / Total * 100`) with visual animated progress bars.
- **Verifiable Certificates**: Automated generation of official Certificates of Completion upon 100% curriculum completion, with high-res printable and PDF download support.
- **My Downloads**: Centralized repository of all downloadable PDF notes and cheatsheets from enrolled courses.
- **Reviews & Ratings**: Star ratings and feedback submission for enrolled courses.
- **Profile & Settings**: Profile editing and secure password management.

### 🛡️ Admin Management
- **Analytics Dashboard**: Live KPI cards for total students, courses, enrollments, completions, PDF files, reviews, and category distribution.
- **Course Management**: Full CRUD operations for courses with thumbnail, level, duration, and pricing configuration.
- **Curriculum & Lesson Management**: Add, edit, delete, and reorder lessons with video stream URLs and section groupings.
- **PDF Resource System**: Multer-powered PDF file uploads with metadata cataloging, validation, and storage.
- **Student Progress Inspection**: Roster of registered learners with detailed course-by-course progress inspection modals.
- **Enrollment Register**: Complete history and status monitoring of all course registrations.
- **Review Moderation**: Review management and content moderation capabilities.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, Axios, Lucide Icons, Canvas-Confetti, CSS3 Custom Properties |
| **Backend** | Node.js, Express.js, JWT (`jsonwebtoken`), bcrypt (`bcryptjs`), Multer, CORS, dotenv |
| **Database** | MySQL Server 8.0+, `mysql2/promise` Connection Pooling |
| **Storage** | Local Filesystem (`backend/uploads/pdfs/`) & MySQL Metadata Table |

---

## 📁 Project Architecture

```
LEARNLIKE/LMS/
├── database/
│   └── database.sql              # Complete DDL schema & seed data (9 relational tables)
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool & auto-bootstrap
│   ├── controllers/              # REST API controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── certificateController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   ├── lessonController.js
│   │   ├── progressController.js
│   │   ├── resourceController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js    # Admin authorization check
│   │   ├── authMiddleware.js     # JWT token verification
│   │   ├── errorHandler.js       # Global error formatting
│   │   └── uploadMiddleware.js   # Multer PDF file filter and storage
│   ├── routes/                   # Modular route endpoints
│   ├── uploads/pdfs/             # Uploaded PDF resources directory
│   ├── server.js                 # Express server entry point
│   ├── .env                      # Database & JWT configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components (Navbar, Sidebar, Cards, Modals)
│   │   ├── context/              # AuthContext & ThemeContext
│   │   ├── layouts/              # PublicLayout, StudentLayout, AdminLayout
│   │   ├── pages/                # Home, Login, Register, Dashboard, Courses, Learning, etc.
│   │   ├── pages/admin/          # Admin Dashboard, ManageCourses, ManageLessons, etc.
│   │   ├── services/             # Axios API service integrations
│   │   ├── App.jsx               # App routing configuration
│   │   ├── index.css             # Design tokens & responsive styles
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- **Node.js** (v18+)
- **MySQL Server** (v8.0+)

### 2. Database Initialization
Import the database schema and sample data into MySQL:

```bash
# Using MySQL CLI:
mysql -u root -p < database/database.sql
```

The database initializes:
- `learnlike_lms` database
- 9 relational tables (`users`, `categories`, `courses`, `lessons`, `enrollments`, `lesson_progress`, `resources`, `reviews`, `certificates`)
- 7 comprehensive courses (HTML, CSS, JavaScript, React.js, MySQL, SQL, Full Stack)
- 59 curriculum lessons

### 3. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend REST API starts on `http://localhost:5000`.

#### Environment Configuration (`backend/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=learnlike_lms
JWT_SECRET=learnlike_super_secret_jwt_key_2026_secure
NODE_ENV=development
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend application starts on `http://localhost:3000`.

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with two demo accounts for testing:

### 🛡️ Admin Account
- **Email:** `admin@learnlike.com`
- **Password:** `password`
- **Role:** `admin` (Access to Admin Dashboard, Course Management, Lesson Authoring, PDF Uploads, Moderation)

### 🎓 Student Account
- **Email:** `student@learnlike.com`
- **Password:** `password`
- **Role:** `student` (Pre-enrolled in HTML 5 and React courses with sample progress)

*(Both accounts are accessible via 1-click fill buttons on the `/login` page).*

---

## 📄 PDF Upload & Download Flow

1. **Upload (Admin):**
   - Navigate to `/admin/resources` -> Click **"Upload PDF Resource"**.
   - Select Course, optional Lesson, title, and `.pdf` file.
   - Handled via **Multer** into `backend/uploads/pdfs/` with sanitized filenames and metadata saved to MySQL.
2. **Download (Student):**
   - Enrolled students can download directly from the course lesson viewer or via the **"My Downloads"** page (`/downloads`).
   - Verified through the `/api/resources/download/:id` endpoint.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student/admin | Public |
| `POST` | `/api/auth/login` | Login and receive JWT token | Public |
| `GET` | `/api/auth/profile` | Get current user profile | Authenticated |
| `GET` | `/api/courses` | List courses with search/filter/sort | Public |
| `GET` | `/api/courses/:id` | Get course details, lessons & reviews | Public / Auth |
| `POST` | `/api/courses` | Create new course | Admin |
| `POST` | `/api/enrollments` | Enroll in course | Authenticated |
| `GET` | `/api/enrollments/my-courses` | Get enrolled courses & progress | Authenticated |
| `POST` | `/api/progress` | Mark lesson completed / toggle | Authenticated |
| `POST` | `/api/certificates/generate` | Generate completion certificate | Authenticated |
| `POST` | `/api/resources/upload` | Upload PDF resource | Admin (Multer) |
| `GET` | `/api/resources/download/:id` | Download course PDF | Enrolled / Admin |
| `POST` | `/api/reviews` | Submit course review | Enrolled |
| `GET` | `/api/admin/stats` | Aggregate dashboard KPI metrics | Admin |

---

## 📜 License
Developed for Learnlike LMS. All rights reserved.
