import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Responce interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  },
);

export const hospitalAPI = {
  login: (data) => api.post('/hospital/login', data),
  register: (data) => api.post('/hospital/register', data),
  getRequests: (id) => api.get(`/hospital/${id}/requests`),
};

export const childAPI = {
  register: (data) => api.post('/child/register', data),
  getByCode: (code) => api.get(`/child/${code}`),
  addVaccination: (data) => api.post('/child/vaccinate', data),
  schedule: (data) => api.post('/child/schedule', data),
  updateStatus: (data) => api.post('/child/update-appointment', data),
};

export default api;
