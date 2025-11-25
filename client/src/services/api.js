import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data).then((r) => r.data);
export const register = (data) => api.post('/auth/register', data).then((r) => r.data);
export const getMe = () => api.get('/auth/me').then((r) => r.data);

// Events
export const getEvents = () => api.get('/events').then((r) => r.data);
export const getEvent = (id) => api.get(`/events/${id}`).then((r) => r.data);

// Sessions
export const getSession = (id) => api.get(`/sessions/${id}`).then((r) => r.data);
export const getSessionSeats = (id) => api.get(`/sessions/${id}/seats`).then((r) => r.data);

// Bookings
export const holdSeats = (data) => api.post('/bookings/hold', data).then((r) => r.data);
export const confirmBooking = (id) => api.post(`/bookings/${id}/confirm`).then((r) => r.data);
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`).then((r) => r.data);
export const getMyBookings = () => api.get('/bookings/my').then((r) => r.data);

// Admin
export const createEvent = (data) => api.post('/admin/events', data).then((r) => r.data);
export const updateEvent = (id, data) => api.put(`/admin/events/${id}`, data).then((r) => r.data);
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`).then((r) => r.data);
export const createSession = (data) => api.post('/admin/sessions', data).then((r) => r.data);
export const getAdminBookings = () => api.get('/admin/bookings').then((r) => r.data);
export const getAnalytics = () => api.get('/admin/analytics').then((r) => r.data);

export default api;

