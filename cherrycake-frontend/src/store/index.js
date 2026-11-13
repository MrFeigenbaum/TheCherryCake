import { configureStore } from '@reduxjs/toolkit';
import regionReducer from './regionSlice';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    region: regionReducer,
    cart: cartReducer,
    auth: authReducer,
    ui: uiReducer
  }
});

export default store;