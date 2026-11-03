import apiClient from './client';

export const getAdminProducts = () => apiClient.get('/admin/products').then(r => r.data);
export const createAdminProduct = (data) => apiClient.post('/admin/products', data).then(r => r.data);
export const updateAdminProduct = (id, data) => apiClient.put(`/admin/products/${id}`, data).then(r => r.data);
export const deleteAdminProduct = (id) => apiClient.delete(`/admin/products/${id}`).then(r => r.data);

export const getAdminPrices = () => apiClient.get('/admin/prices').then(r => r.data);
export const updateAdminPrices = (data) => apiClient.put('/admin/prices', data).then(r => r.data);

export const getAdminRegions = () => apiClient.get('/admin/regions').then(r => r.data);
export const updateAdminRegion = (id, data) => apiClient.put(`/admin/regions/${id}`, data).then(r => r.data);

export const getAdminDiscounts = () => apiClient.get('/admin/discounts').then(r => r.data);
export const createAdminDiscount = (data) => apiClient.post('/admin/discounts', data).then(r => r.data);
export const deleteAdminDiscount = (id) => apiClient.delete(`/admin/discounts/${id}`).then(r => r.data);

export const getAdminPromoCodes = () => apiClient.get('/admin/promo-codes').then(r => r.data);
export const createAdminPromoCode = (data) => apiClient.post('/admin/promo-codes', data).then(r => r.data);

export const getAdminOrders = (params) => apiClient.get('/admin/orders', { params }).then(r => r.data);
export const updateAdminOrderStatus = (id, status) => apiClient.patch(`/admin/orders/${id}/status`, { status }).then(r => r.data);
