import apiClient from './client';

export const getCategories = () => apiClient.get('/categories').then(r => r.data);

export const getProducts = (params) => apiClient.get('/products', { params }).then(r => r.data);

export const getProductById = (id, params) => apiClient.get(`/products/${id}`, { params }).then(r => r.data);