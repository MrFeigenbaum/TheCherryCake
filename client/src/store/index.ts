import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import authReducer from './authSlice';

type RegionState = {
  code: string;
  currencyCode: string | null;
  currencySymbol: string | null;
  vatRate: number | null;
  selected: string;
};

const savedRegion = localStorage.getItem('cc_region');

const initialRegionState: RegionState = {
  code: savedRegion || import.meta.env.VITE_DEFAULT_REGION || 'UZ',
  currencyCode: null,
  currencySymbol: null,
  vatRate: null,
  selected: 'Tashkent',
};

const regionSlice = createSlice({
  name: 'region',
  initialState: initialRegionState,
  reducers: {
    setRegionCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },

    setRegion: (state, action: PayloadAction<string>) => {
      state.selected = action.payload;
    },

    setRegionDetails: (
      state,
      action: PayloadAction<{
        code: string;
        currencyCode: string;
        currencySymbol: string;
        vatRate: number;
      }>,
    ) => {
      state.code = action.payload.code;
      state.currencyCode = action.payload.currencyCode;
      state.currencySymbol = action.payload.currencySymbol;
      state.vatRate = action.payload.vatRate;
    },
  },
});

type CartTotals = {
  subtotal: number;
  vatAmount: number;
  amountInclVat: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  currencyCode: string;
};

type CartState = {
  items: string[];
  totals: CartTotals;
  promoCode: string | null;
  deliveryZoneId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialCartTotals: CartTotals = {
  subtotal: 0,
  vatAmount: 0,
  amountInclVat: 0,
  discountAmount: 0,
  deliveryFee: 0,
  total: 0,
  currencyCode: 'UZS',
};

const initialCartState: CartState = {
  items: [],
  totals: initialCartTotals,
  promoCode: null,
  deliveryZoneId: null,
  status: 'idle',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addToCart: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload);
    },

    clearCart: (state) => {
      state.items = [];
      state.totals = { ...initialCartTotals };
      state.promoCode = null;
      state.deliveryZoneId = null;
      state.status = 'idle';
    },

    setCartTotals: (state, action: PayloadAction<CartTotals>) => {
      state.totals = action.payload;
    },
  },
});

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

type UiState = {
  toast: string;
  toasts: ToastItem[];
  globalLoading: boolean;
};

const initialUiState: UiState = {
  toast: '',
  toasts: [],
  globalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUiState,
  reducers: {
    showToast: (state, action: PayloadAction<string>) => {
      state.toast = action.payload;
    },

    hideToast: (state) => {
      state.toast = '';
    },

    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    addToast: (state, action: PayloadAction<ToastItem>) => {
      state.toasts.push(action.payload);
    },

    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { setRegion, setRegionDetails, setRegionCode } = regionSlice.actions;

export const { addToCart, clearCart, setCartTotals } = cartSlice.actions;

export const { showToast, hideToast, setGlobalLoading, addToast, removeToast } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    region: regionSlice.reducer,
    cart: cartSlice.reducer,
    ui: uiSlice.reducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
