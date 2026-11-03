import apiClient from './client';

export const createBooking = (payload) => apiClient.post('/bookings', payload).then(r => r.data);

export const getMyBookings = () => apiClient.get('/bookings/my').then(r => r.data);
