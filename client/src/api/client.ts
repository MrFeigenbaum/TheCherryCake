import axios from 'axios';
import { store, showToast } from '../store';
import { logout } from '../store/authSlice';

type ErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export type ApiError = {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token');

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const response = axios.isAxiosError<ErrorResponse>(error) ? error.response : undefined;

    const apiError: ApiError = {
      status: response?.status ?? 0,
      message: response?.data?.message || 'Server bilan bog‘lanishda xatolik yuz berdi',
      errors: response?.data?.errors,
    };

    store.dispatch(showToast(apiError.message));

    if (apiError.status === 401) {
      store.dispatch(logout());

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(apiError);
  },
);
