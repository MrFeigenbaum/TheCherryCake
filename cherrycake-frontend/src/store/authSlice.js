import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEY_TOKEN, STORAGE_KEY_USER } from '../constants/storage-keys';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

const savedToken = getStorageItem(STORAGE_KEY_TOKEN, null);
const savedUser = getStorageItem(STORAGE_KEY_USER, null);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: savedToken,
    user: savedUser,
    status: 'idle'
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      setStorageItem(STORAGE_KEY_TOKEN, token);
      setStorageItem(STORAGE_KEY_USER, user);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      removeStorageItem(STORAGE_KEY_TOKEN);
      removeStorageItem(STORAGE_KEY_USER);
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;