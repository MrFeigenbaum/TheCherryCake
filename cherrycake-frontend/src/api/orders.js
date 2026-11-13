import apiClient from './client';

export const createOrder = (payload) => apiClient.post('/orders', payload).then(r => r.data);

export const getMyOrders = () => apiClient.get('/orders/my').then(r => r.data);

export const getOrderById = (id) => apiClient.get(`/orders/${id}`).then(r => r.data);

export const getPickupPoints = (params) => apiClient.get('/pickup-points', { params }).then(r => r.data);

export const getDeliveryZones = (params) => apiClient.get('/delivery-zones', { params }).then(r => r.data);

export const getTimeSlots = (params) => apiClient.get('/time-slots', { params }).then(r => r.data);