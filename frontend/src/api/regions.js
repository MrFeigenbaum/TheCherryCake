import apiClient from './client';

export const getRegions = () => apiClient.get('/regions').then(r => r.data);