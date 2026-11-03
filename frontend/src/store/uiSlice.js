import { createSlice } from '@reduxjs/toolkit';

let nextToastId = 1;

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
    globalLoading: false
  },
  reducers: {
    showToast: (state, action) => {
      const { type = 'info', message } = action.payload;
      const id = nextToastId++;
      state.toasts.push({ id, type, message });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = Boolean(action.payload);
    }
  }
});

export const { showToast, removeToast, setGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;
