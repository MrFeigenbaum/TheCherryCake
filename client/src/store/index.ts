
import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type RegionCode = string;

type CountryInfo = {
  name: string;
  currencyCode: string;
  currencySymbol: string;
  vatRate: number;
};

type RegionState = {
  code: RegionCode;
  selected: RegionCode;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  vatRate: number;
};

type RegionDetails = {
  code: string;
  name: string;
  currencyCode?: string;
  currencySymbol: string;
  vatRate?: number;
};

// Fallback countries used when the API is unavailable.
const countries: Record<string, CountryInfo> = {
  UZB: {
    name: 'Uzbekistan',
    currencyCode: 'UZS',
    currencySymbol: "so'm",
    vatRate: 0.15,
  },
  KAZ: {
    name: 'Kazakhstan',
    currencyCode: 'KZT',
    currencySymbol: '\u20B8',
    vatRate: 0.20,
  },
  GEO: {
    name: 'Georgia',
    currencyCode: 'GEL',
    currencySymbol: '\u20BE',
    vatRate: 0.12,
  },
  UKR: {
    name: 'Ukraine',
    currencyCode: 'UAH',
    currencySymbol: '\u20B4',
    vatRate: 0.08,
  },
  CHN: {
    name: 'China',
    currencyCode: 'CNY',
    currencySymbol: '\u00A5',
    vatRate: 0.18,
  },
};

const isRegionCode = (value: string): boolean => {
  return /^[A-Z]{3}$/.test(value);
};

const savedRegion = localStorage.getItem('cc_region');
const envRegion = import.meta.env.VITE_DEFAULT_REGION || 'UZB';

const initialCode: RegionCode =
  savedRegion && isRegionCode(savedRegion)
    ? savedRegion
    : isRegionCode(envRegion)
      ? envRegion
      : 'UZB';

const initialRegionState: RegionState = {
  code: initialCode,
  selected: initialCode,
  ...(countries[initialCode] ?? countries.UZB),
};

const regionSlice = createSlice({
  name: 'region',
  initialState: initialRegionState,
  reducers: {
    setRegion: (state, action: PayloadAction<string>) => {
      const code = action.payload;
      const country = countries[code];

      if (!country) {
        return;
      }

      state.code = code;
      state.selected = code;
      state.name = country.name;
      state.currencyCode = country.currencyCode;
      state.currencySymbol = country.currencySymbol;
      state.vatRate = country.vatRate;
    },

    setRegionCode: (state, action: PayloadAction<string>) => {
      const code = action.payload;
      const country = countries[code];

      if (!country) {
        return;
      }

      state.code = code;
      state.selected = code;
      state.name = country.name;
      state.currencyCode = country.currencyCode;
      state.currencySymbol = country.currencySymbol;
      state.vatRate = country.vatRate;
    },

    setRegionDetails: (
      state,
      action: PayloadAction<RegionDetails>
    ) => {
      const {
        code,
        name,
        currencyCode,
        currencySymbol,
        vatRate,
      } = action.payload;

      if (!isRegionCode(code)) {
        return;
      }

      const fallbackCountry = countries[code];

      const resolvedCurrencyCode =
        currencyCode ?? fallbackCountry?.currencyCode;

      const resolvedVatRate =
        vatRate ?? fallbackCountry?.vatRate;

      if (
        !name.trim() ||
        !resolvedCurrencyCode ||
        !currencySymbol ||
        resolvedVatRate === undefined ||
        !Number.isFinite(resolvedVatRate) ||
        resolvedVatRate < 0
      ) {
        return;
      }

      state.code = code;
      state.selected = code;
      state.name = name;
      state.currencyCode = resolvedCurrencyCode;
      state.currencySymbol = currencySymbol;
      state.vatRate = resolvedVatRate;
    },
  },
});

// Cart state
type CartState = {
  items: string[];
};

const initialCartState: CartState = {
  items: [],
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
    },
  },
});

// UI state
type UiState = {
  toast: string;
};

const initialUiState: UiState = {
  toast: '',
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
  },
});

// Redux actions
export const {
  setRegion,
  setRegionCode,
  setRegionDetails,
} = regionSlice.actions;

export const {
  addToCart,
  clearCart,
} = cartSlice.actions;

export const {
  showToast,
  hideToast,
} = uiSlice.actions;

// Redux store
export const store = configureStore({
  reducer: {
    region: regionSlice.reducer,
    cart: cartSlice.reducer,
    ui: uiSlice.reducer,
  },
});

// Persist selected region in localStorage.
let previousRegion = store.getState().region.code;

store.subscribe(() => {
  const currentRegion = store.getState().region.code;

  if (currentRegion !== previousRegion) {
    previousRegion = currentRegion;

    localStorage.setItem(
      'cc_region',
      currentRegion
    );
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
