import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STORAGE_KEY_REGION } from '../constants/storage-keys';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { CURRENCY_SYMBOLS } from '../utils/format-money';
import apiClient from '../api/client';

const DEFAULT_REGION = import.meta.env.VITE_DEFAULT_REGION || 'UZ';

export const RATES_PER_CU = {
  UZS: 3000,
  UZB: 3000,
  UZ: 3000,
  KZT: 120,
  KAZ: 120,
  KZ: 120,
  GEL: 0.65,
  GEO: 0.65,
  GE: 0.65,
  UAH: 10,
  UKR: 10,
  UA: 10,
  CNY: 1.75,
  CHN: 1.75,
  CN: 1.75,
  EUR: 0.24,
  SEK: 2.5,
  BYN: 0.8,
  AMD: 100,
  RUB: 24,
  USD: 0.26
};

export const INITIAL_REGIONS = [
  { code: 'UZ', name: 'Узбекистан', currencyCode: 'UZS', currencySymbol: "so'm", vatRate: 0.12, exchangeRate: 3000, flag: '🇺🇿' },
  { code: 'KZ', name: 'Казахстан', currencyCode: 'KZT', currencySymbol: '₸', vatRate: 0.12, exchangeRate: 120, flag: '🇰🇿' },
  { code: 'GE', name: 'Грузия', currencyCode: 'GEL', currencySymbol: '₾', vatRate: 0.18, exchangeRate: 0.65, flag: '🇬🇪' },
  { code: 'UA', name: 'Украина', currencyCode: 'UAH', currencySymbol: '₴', vatRate: 0.20, exchangeRate: 10, flag: '🇺🇦' },
  { code: 'CN', name: 'Китай', currencyCode: 'CNY', currencySymbol: '¥', vatRate: 0.13, exchangeRate: 1.75, flag: '🇨🇳' },
  { code: 'SE', name: 'Швеция', currencyCode: 'SEK', currencySymbol: 'kr', vatRate: 0.12, exchangeRate: 2.5, flag: '🇸🇪' },
  { code: 'FI', name: 'Финляндия', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.14, exchangeRate: 0.24, flag: '🇫🇮' },
  { code: 'BY', name: 'Беларусь', currencyCode: 'BYN', currencySymbol: 'Br', vatRate: 0.20, exchangeRate: 0.8, flag: '🇧🇾' },
  { code: 'EE', name: 'Эстония', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.22, exchangeRate: 0.24, flag: '🇪🇪' },
  { code: 'LT', name: 'Литва', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.21, exchangeRate: 0.24, flag: '🇱🇹' },
  { code: 'LV', name: 'Латвия', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.21, exchangeRate: 0.24, flag: '🇱🇻' },
  { code: 'AM', name: 'Армения', currencyCode: 'AMD', currencySymbol: '֏', vatRate: 0.20, exchangeRate: 100, flag: '🇦🇲' }
];

export const fetchRegions = createAsyncThunk('region/fetchRegions', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get('/regions');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialSavedRegion = getStorageItem(STORAGE_KEY_REGION, DEFAULT_REGION);
const defaultActive = INITIAL_REGIONS.find((r) => r.code === initialSavedRegion) || INITIAL_REGIONS[0];

export const regionSlice = createSlice({
  name: 'region',
  initialState: {
    code: defaultActive.code,
    currencyCode: defaultActive.currencyCode,
    currencySymbol: defaultActive.currencySymbol,
    vatRate: defaultActive.vatRate,
    exchangeRate: defaultActive.exchangeRate || 3000,
    regions: INITIAL_REGIONS,
    loading: false,
    error: null
  },
  reducers: {
    setRegion: (state, action) => {
      const code = action.payload;
      state.code = code;
      setStorageItem(STORAGE_KEY_REGION, code);

      const found = state.regions.find((r) => r.code === code);
      if (found) {
        state.currencyCode = found.currencyCode || found.currency || 'UZS';
        state.currencySymbol = found.currencySymbol || CURRENCY_SYMBOLS[state.currencyCode] || state.currencyCode;
        state.vatRate = found.vatRate !== undefined ? found.vatRate : 0.12;
        state.exchangeRate = found.exchangeRate || RATES_PER_CU[state.currencyCode] || RATES_PER_CU[found.code] || 3000;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.regions = action.payload.map((r) => {
            const cur = r.currencyCode || r.currency || 'UZS';
            return {
              ...r,
              currencySymbol: r.currencySymbol || CURRENCY_SYMBOLS[cur] || cur,
              exchangeRate: r.exchangeRate || RATES_PER_CU[cur] || RATES_PER_CU[r.code] || 3000
            };
          });
          const current = state.regions.find((r) => r.code === state.code) || state.regions[0];
          if (current) {
            state.code = current.code;
            state.currencyCode = current.currencyCode || current.currency || 'UZS';
            state.currencySymbol = current.currencySymbol || CURRENCY_SYMBOLS[state.currencyCode] || state.currencyCode;
            state.vatRate = current.vatRate !== undefined ? current.vatRate : 0.12;
            state.exchangeRate = current.exchangeRate || RATES_PER_CU[state.currencyCode] || 3000;
            setStorageItem(STORAGE_KEY_REGION, state.code);
          }
        }
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setRegion } = regionSlice.actions;
export default regionSlice.reducer;