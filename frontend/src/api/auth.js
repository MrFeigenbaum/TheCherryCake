import apiClient from './client';

export const login = (credentials) => apiClient.post('/auth/login', credentials).then(r => r.data);

export const register = (userData) => apiClient.post('/auth/register', userData).then(r => r.data);
