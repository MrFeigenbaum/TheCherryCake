import axios from 'axios';
import { store, showToast } from '../store';

export const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      'Server bilan bog‘lanishda xatolik yuz berdi';

    store.dispatch(showToast(message));
    return Promise.reject(error);
  }
);
