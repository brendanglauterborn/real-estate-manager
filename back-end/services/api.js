import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (agentData) => api.post('/auth/register', agentData),
};

// Agent services
export const agentService = {
  getAgentById: (id) => api.get(`/agent/${id}`),
};

// Listing services
export const listingService = {
  getListingsByAgentId: (agentId) => api.get(`/listing/agent/${agentId}`),
  createListing: (listing) => api.post('/listing', listing),
  updateListing: (id, listing) => api.put(`/listing/${id}`, listing),
  deleteListing: (id) => api.delete(`/listing/${id}`),
};

// Property services
export const propertyService = {
  getAllProperties: () => api.get('/property'),
  getPropertyById: (id) => api.get(`/property/${id}`),
};

// Client services
export const clientService = {
  getClientsByAgentId: (agentId) => api.get(`/client/agent/${agentId}`),
};

// Appointment services
export const appointmentService = {
  getAppointmentsByAgentId: (agentId) => api.get(`/appointment/agent/${agentId}`),
  getAppointmentsByListingId: (listingId) => api.get(`/appointment/listing/${listingId}`),
  createAppointment: (appointment) => api.post('/appointment', appointment),
};

export default api; 