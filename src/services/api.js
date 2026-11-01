import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standard error formatting matching API shape: { error: { code, message, details } }
    const message = error.response?.data?.error?.message || error.message || 'An unexpected error occurred';
    error.formattedMessage = message;
    return Promise.reject(error);
  }
);

export default api;

