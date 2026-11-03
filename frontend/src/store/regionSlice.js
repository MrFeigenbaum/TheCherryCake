import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STORAGE_KEY_REGION } from '../constants/storage-keys';
import { getStorageItem, setStorageItem } from '../utils/storage';
import axios from 'axios';

const DEFAULT_REGION = import.meta.env.VITE_DEFAULT_REGION || 'UZ';

export const fetchRegions = createAsyncThunk('region/fetchRegions', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/regions');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialSavedRegion = getStorageItem(STORAGE_KEY_REGION, DEFAULT_REGION);

export const regionSlice = createSlice({
  name: 'region',
  initialState: {
    code: initialSavedRegion,
    currencyCode: 'UZS',
    currencySymbol: "so'm",
    vatRate: 0.12,
    regions: [],
    loading: false,
    error: null
  },
  reducers: {
    setRegion: (state, action) => {
      const code = action.payload;
      state.code = code;
      setStorageItem(STORAGE_KEY_REGION, code);

      const found = state.regions.find(r => r.code === code);
      if (found) {
        state.currencyCode = found.currencyCode || found.currency || 'UZS';
        state.currencySymbol = found.currencySymbol || state.currencyCode;
        state.vatRate = found.vatRate !== undefined ? found.vatRate : 0.12;
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
        state.regions = action.payload || [];
        const current = state.regions.find(r => r.code === state.code) || state.regions[0];
        if (current) {
          state.code = current.code;
          state.currencyCode = current.currencyCode || current.currency || 'UZS';
          state.currencySymbol = current.currencySymbol || state.currencyCode;
          state.vatRate = current.vatRate !== undefined ? current.vatRate : 0.12;
          setStorageItem(STORAGE_KEY_REGION, state.code);
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
