import apiClient from './client';

export const calculateCart = (payload) => apiClient.post('/cart/calculate', payload).then(r => r.data);