import api from './api';

export const courseService = {
  async getCourses(params = {}) {
    const res = await api.get('/courses', { params });
    return res.data;
  },

  async getCourseById(id) {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },

  async createCourse(data) {
    const res = await api.post('/courses', data);
    return res.data;
  },

  async updateCourse(id, data) {
    const res = await api.put(`/courses/${id}`, data);
    return res.data;
  },

  async deleteCourse(id) {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  }
};

export const categoryService = {
  async getCategories() {
    const res = await api.get('/categories');
    return res.data;
  },

  async createCategory(data) {
    const res = await api.post('/categories', data);
    return res.data;
  },

  async updateCategory(id, data) {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  },

  async deleteCategory(id) {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  }
};

export const lessonService = {
  async getLessonsByCourse(courseId) {
    const res = await api.get(`/lessons/course/${courseId}`);
    return res.data;
  },

  async createLesson(data) {
    const res = await api.post('/lessons', data);
    return res.data;
  },

  async updateLesson(id, data) {
    const res = await api.put(`/lessons/${id}`, data);
    return res.data;
  },

  async deleteLesson(id) {
    const res = await api.delete(`/lessons/${id}`);
    return res.data;
  }
};

export const enrollmentService = {
  async enroll(courseId) {
    const res = await api.post('/enrollments', { courseId });
    return res.data;
  },

  async getMyCourses() {
    const res = await api.get('/enrollments/my-courses');
    return res.data;
  },

  async checkEnrollment(courseId) {
    const res = await api.get(`/enrollments/${courseId}`);
    return res.data;
  }
};

export const progressService = {
  async markProgress(courseId, lessonId, completed = true) {
    const res = await api.post('/progress', { courseId, lessonId, completed });
    return res.data;
  },

  async getCourseProgress(courseId) {
    const res = await api.get(`/progress/${courseId}`);
    return res.data;
  }
};

export const resourceService = {
  async getCourseResources(courseId) {
    const res = await api.get(`/resources/course/${courseId}`);
    return res.data;
  },

  async getStudentDownloads() {
    const res = await api.get('/resources/downloads');
    return res.data;
  },

  async getAllResourcesAdmin() {
    const res = await api.get('/resources/admin/all');
    return res.data;
  },

  async uploadResource(formData) {
    const res = await api.post('/resources/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  async deleteResource(id) {
    const res = await api.delete(`/resources/${id}`);
    return res.data;
  },

  getDownloadUrl(id) {
    return `/api/resources/download/${id}`;
  }
};

export const reviewService = {
  async getReviews(courseId) {
    const res = await api.get(`/reviews/course/${courseId}`);
    return res.data;
  },

  async createReview(data) {
    const res = await api.post('/reviews', data);
    return res.data;
  },

  async getAllReviewsAdmin() {
    const res = await api.get('/reviews/admin/all');
    return res.data;
  },

  async deleteReview(id) {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  }
};

export const certificateService = {
  async getMyCertificates() {
    const res = await api.get('/certificates');
    return res.data;
  },

  async getCertificate(courseId) {
    const res = await api.get(`/certificates/${courseId}`);
    return res.data;
  },

  async generateCertificate(courseId) {
    const res = await api.post('/certificates/generate', { courseId });
    return res.data;
  },

  async getAllCertificatesAdmin() {
    const res = await api.get('/certificates/admin/all');
    return res.data;
  }
};

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getStudents() {
    const res = await api.get('/admin/students');
    return res.data;
  },

  async getStudentDetails(id) {
    const res = await api.get(`/admin/students/${id}`);
    return res.data;
  },

  async getEnrollments() {
    const res = await api.get('/admin/enrollments');
    return res.data;
  }
};
