import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { AdaptiveCourseLayout } from './layouts/AdaptiveCourseLayout';

// Public & Student Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { CourseDetails } from './pages/CourseDetails';
import { Learning } from './pages/Learning';
import { MyLearning } from './pages/MyLearning';
import { Downloads } from './pages/Downloads';
import { Certificates } from './pages/Certificates';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageCourses } from './pages/admin/ManageCourses';
import { ManageLessons } from './pages/admin/ManageLessons';
import { ManageResources } from './pages/admin/ManageResources';
import { ManageStudents } from './pages/admin/ManageStudents';
import { ManageEnrollments } from './pages/admin/ManageEnrollments';
import { ManageReviews } from './pages/admin/ManageReviews';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
          <Routes>
            {/* 1. Public Routes with Header & Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* 2. Adaptive Course Routes (Public if guest, Student LMS if logged in) */}
            <Route element={<AdaptiveCourseLayout />}>
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
            </Route>

            {/* 2. Student LMS Protected Routes */}
            <Route element={<StudentLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/categories" element={<Courses />} />
              <Route path="/progress" element={<MyLearning />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Profile />} />
              <Route path="/learn/:courseId" element={<Learning />} />
            </Route>

            {/* 3. Admin Protected Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="categories" element={<ManageCourses />} />
              <Route path="lessons" element={<ManageLessons />} />
              <Route path="resources" element={<ManageResources />} />
              <Route path="students" element={<ManageStudents />} />
              <Route path="enrollments" element={<ManageEnrollments />} />
              <Route path="reviews" element={<ManageReviews />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
