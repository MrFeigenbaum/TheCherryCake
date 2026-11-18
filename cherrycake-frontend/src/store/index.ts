import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { REGION_TO_LANGUAGE, type SupportedLanguage } from '../i18n/translations';

export interface Region {
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  vatRate: number;
}

export const INITIAL_REGIONS: Region[] = [
  { code: 'UZB', name: 'Uzbekistan', currencyCode: 'UZS', currencySymbol: "so'm", vatRate: 0.15 },
  { code: 'KAZ', name: 'Kazakhstan', currencyCode: 'KZT', currencySymbol: '₸', vatRate: 0.20 },
  { code: 'GEO', name: 'Georgia', currencyCode: 'GEL', currencySymbol: '₾', vatRate: 0.12 },
  { code: 'UKR', name: 'Ukraine', currencyCode: 'UAH', currencySymbol: '₴', vatRate: 0.08 },
  { code: 'CHN', name: 'China', currencyCode: 'CNY', currencySymbol: '¥', vatRate: 0.18 },
  { code: 'ARM', name: 'Armenia', currencyCode: 'AMD', currencySymbol: '֏', vatRate: 0.20 },
  { code: 'AZE', name: 'Azerbaijan', currencyCode: 'AZN', currencySymbol: '₼', vatRate: 0.18 },
  { code: 'TUR', name: 'Turkey', currencyCode: 'TRY', currencySymbol: '₺', vatRate: 0.18 },
  { code: 'MDA', name: 'Moldova', currencyCode: 'MDL', currencySymbol: 'L', vatRate: 0.20 },
  { code: 'EST', name: 'Estonia', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.22 },
  { code: 'LVA', name: 'Latvia', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.21 },
  { code: 'LTU', name: 'Lithuania', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.21 },
  { code: 'FIN', name: 'Finland', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.24 },
  { code: 'SWE', name: 'Sweden', currencyCode: 'SEK', currencySymbol: 'kr', vatRate: 0.25 },
];

const savedRegionCode = typeof window !== 'undefined' ? localStorage.getItem('cc_region') || 'UZB' : 'UZB';
const initialRegion = INITIAL_REGIONS.find((r) => r.code === savedRegionCode) || INITIAL_REGIONS[0];

// 1. Region Slice
export const regionSlice = createSlice({
  name: 'region',
  initialState: {
    code: initialRegion.code,
    selected: initialRegion.code,
    name: initialRegion.name,
    currencyCode: initialRegion.currencyCode,
    currencySymbol: initialRegion.currencySymbol,
    vatRate: initialRegion.vatRate,
    regions: INITIAL_REGIONS,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setRegion: (state, action: PayloadAction<string>) => {
      const code = action.payload;
      state.code = code;
      state.selected = code;
      const found = state.regions.find((r) => r.code === code);
      if (found) {
        state.name = found.name;
        state.currencyCode = found.currencyCode;
        state.currencySymbol = found.currencySymbol;
        state.vatRate = found.vatRate;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('cc_region', code);
      }
    },
    setRegionCode: (state, action: PayloadAction<string>) => {
      regionSlice.caseReducers.setRegion(state, action);
    },
    setRegionDetails: (state, action: PayloadAction<Region>) => {
      const r = action.payload;
      state.code = r.code;
      state.selected = r.code;
      state.name = r.name;
      state.currencyCode = r.currencyCode;
      state.currencySymbol = r.currencySymbol;
      state.vatRate = r.vatRate;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cc_region', r.code);
      }
    },
  },
});

export const { setRegion, setRegionCode, setRegionDetails } = regionSlice.actions;

// 1.1 Language Slice
const savedLanguage = typeof window !== 'undefined' ? (localStorage.getItem('cc_language') as SupportedLanguage | null) : null;
const initialLanguage: SupportedLanguage = savedLanguage || REGION_TO_LANGUAGE[savedRegionCode] || 'en';

export const languageSlice = createSlice({
  name: 'language',
  initialState: {
    current: initialLanguage,
    code: initialLanguage,
  },
  reducers: {
    setLanguage: (state, action: PayloadAction<SupportedLanguage | string>) => {
      const lang = (action.payload || 'en') as SupportedLanguage;
      state.current = lang;
      state.code = lang;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cc_language', lang);
      }
    },
    setLanguageFromRegion: (state, action: PayloadAction<string>) => {
      const regionCode = (action.payload || '').toUpperCase();
      const mappedLang = REGION_TO_LANGUAGE[regionCode] || 'en';
      state.current = mappedLang;
      state.code = mappedLang;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cc_language', mappedLang);
      }
    },
  },
});

export const { setLanguage, setLanguageFromRegion } = languageSlice.actions;

// 2. Auth Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as { id?: string; email?: string; role?: string; name?: string } | null,
    token: null as string | null,
    status: 'idle',
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

// 3. UI Slice
const savedTheme = typeof window !== 'undefined'
  ? ((localStorage.getItem('cherry_theme') as 'dark' | 'light') || 'dark')
  : 'dark';

if (typeof window !== 'undefined') {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: savedTheme,
    toast: '',
    toasts: [] as { id: number; message: string; type: string }[],
    isCartDrawerOpen: false,
    isCustomCakeOpen: false,
    isBookingModalOpen: false,
    isAboutModalOpen: false,
    globalLoading: false,
  },
  reducers: {
    toggleTheme: (state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = next;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cherry_theme', next);
        document.documentElement.setAttribute('data-theme', next);
      }
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cherry_theme', action.payload);
        document.documentElement.setAttribute('data-theme', action.payload);
      }
    },
    showToast: (state, action: PayloadAction<string>) => {
      state.toast = action.payload;
      state.toasts.push({ id: Date.now(), message: action.payload, type: 'info' });
    },
    hideToast: (state) => {
      state.toast = '';
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
    openAboutModal: (state) => {
      state.isAboutModalOpen = true;
    },
    closeAboutModal: (state) => {
      state.isAboutModalOpen = false;
    },
    openBookingModal: (state) => {
      state.isBookingModalOpen = true;
    },
    closeBookingModal: (state) => {
      state.isBookingModalOpen = false;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  showToast,
  hideToast,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  openCustomCake,
  closeCustomCake,
  openAboutModal,
  closeAboutModal,
  openBookingModal,
  closeBookingModal,
} = uiSlice.actions;

// 4. Cart Slice
export type CartItem = {
  id?: string;
  productId: number;
  name: string;
  quantity: number;
  unitPrice?: number;
  imageUrl?: string;
  modifierIds?: number[];
  photoUrl?: string | null;
};

export type StoredCartItem = CartItem | string;

export function isCartItem(item: StoredCartItem): item is CartItem {
  return typeof item !== 'string';
}

function readCart(): StoredCartItem[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('cc_cart');
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const calculateCart = createAsyncThunk(
  'cart/calculate',
  async (_overridePromo, { getState }) => {
    const state = getState() as RootState;
    return { totals: state.cart.totals, promoCode: state.cart.promoCode };
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: readCart(),
    totals: {
      subtotal: 0,
      vatRate: 0.12,
      vatAmount: 0,
      amountInclVat: 0,
      discountRate: 0,
      discountAmount: 0,
      deliveryFee: 0,
      total: 0,
      currencyCode: 'UZS',
    },
    promoCode: null as string | null,
    promoError: null as string | null,
    deliveryZoneId: null as string | null,
    status: 'idle',
  },
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const item = action.payload;
      if (typeof item === 'string') {
        state.items.push(item);
      } else {
        const existing = state.items.find(
          (i) => isCartItem(i) && i.productId === item.productId
        );
        if (existing && isCartItem(existing)) {
          existing.quantity += item.quantity || 1;
        } else {
          state.items.push({
            ...item,
            id: item.id || `${item.productId}-${Date.now()}`,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
          });
        }
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('cc_cart', JSON.stringify(state.items));
      }
    },
    addItem: (state, action: PayloadAction<any>) => {
      cartSlice.caseReducers.addToCart(state, action);
    },
    removeFromCart: (state, action: PayloadAction<any>) => {
      const target = action.payload;
      state.items = state.items.filter((item) => {
        if (typeof target === 'string') return item !== target;
        if (isCartItem(item)) return item.id !== target && item.productId !== target;
        return true;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('cc_cart', JSON.stringify(state.items));
      }
    },
    removeItem: (state, action: PayloadAction<any>) => {
      cartSlice.caseReducers.removeFromCart(state, action);
    },
    updateCartQuantity: (state, action: PayloadAction<{ id?: string; productId?: number; quantity: number }>) => {
      const { id, productId, quantity } = action.payload;
      const found = state.items.find(
        (i) => isCartItem(i) && ((id && i.id === id) || (productId && i.productId === productId))
      );
      if (found && isCartItem(found)) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i !== found);
        } else {
          found.quantity = quantity;
        }
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('cc_cart', JSON.stringify(state.items));
      }
    },
    updateQuantity: (state, action: PayloadAction<any>) => {
      cartSlice.caseReducers.updateCartQuantity(state, action);
    },
    clearCart: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cc_cart');
      }
    },
  },
});

export const {
  addToCart,
  addItem,
  removeFromCart,
  removeItem,
  updateCartQuantity,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

// 5. Store Configuration
export const store = configureStore({
  reducer: {
    region: regionSlice.reducer,
    language: languageSlice.reducer,
    cart: cartSlice.reducer,
    ui: uiSlice.reducer,
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
