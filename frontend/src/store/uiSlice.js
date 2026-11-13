import { createSlice } from '@reduxjs/toolkit';

let nextToastId = 1;

const initialTheme = typeof window !== 'undefined'
  ? (localStorage.getItem('cherry_theme') || 'dark')
  : 'dark';

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
    globalLoading: false,
    theme: initialTheme,
    isCartDrawerOpen: false,
    isCustomCakeOpen: false,
    isBookingModalOpen: false,
    isAboutModalOpen: false
  },
  reducers: {
    openAboutModal: (state) => {
      state.isAboutModalOpen = true;
    },
    closeAboutModal: (state) => {
      state.isAboutModalOpen = false;
    },
    openCartDrawer: (state) => {
      state.isCartDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isCartDrawerOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    openCustomCake: (state) => {
      state.isCustomCakeOpen = true;
    },
    closeCustomCake: (state) => {
      state.isCustomCakeOpen = false;
    },
    openBookingModal: (state) => {
      state.isBookingModalOpen = true;
    },
    closeBookingModal: (state) => {
      state.isBookingModalOpen = false;
    },
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
    },
    toggleTheme: (state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = next;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cherry_theme', next);
        document.documentElement.setAttribute('data-theme', next);
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cherry_theme', action.payload);
        document.documentElement.setAttribute('data-theme', action.payload);
      }
    }
  }
});

export const {
  showToast,
  removeToast,
  setGlobalLoading,
  toggleTheme,
  setTheme,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  openCustomCake,
  closeCustomCake,
  openBookingModal,
  closeBookingModal,
  openAboutModal,
  closeAboutModal
} = uiSlice.actions;
export default uiSlice.reducer;
