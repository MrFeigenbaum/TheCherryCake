import apiClient from './client';

export const getSalesReport = (params) => apiClient.get('/reports/sales', { params }).then(r => r.data);

export const exportReport = (params) => apiClient.get('/reports/export', { params, responseType: 'blob' });
