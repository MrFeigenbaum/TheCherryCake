import axios from 'axios';
import { store } from '../store';
import { showToast } from '../store/uiSlice';
import { logout } from '../store/authSlice';
import { STORAGE_KEY_TOKEN } from '../constants/storage-keys';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: attach cc_token as Bearer if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle ErrorResponse and 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const data = error.response ? error.response.data : null;

    let message = 'Произошла непредвиденная ошибка';
    let errors = [];

    if (data && typeof data === 'object') {
      if (data.message) {
        message = data.message;
      }
      if (Array.isArray(data.errors)) {
        errors = data.errors;
      }
    } else if (error.message) {
      message = error.message;
    }

    // Single point of failure notification -> dispatch toast
    store.dispatch(showToast({ type: 'error', message }));

    // 401 Unauthorized handling -> clear auth and redirect to /login
    if (status === 401) {
      store.dispatch(logout());
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject({
      status,
      message,
      errors,
      rawError: error
    });
  }
);

export default apiClient;