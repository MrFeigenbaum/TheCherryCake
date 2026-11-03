import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STORAGE_KEY_CART } from '../constants/storage-keys';
import { getStorageItem, setStorageItem } from '../utils/storage';
import axios from 'axios';

const savedCart = getStorageItem(STORAGE_KEY_CART, { items: [] });

export const calculateCart = createAsyncThunk(
  'cart/calculate',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const regionCode = state.region.code;
      const payload = {
        region: regionCode,
        items: state.cart.items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          modifierIds: i.modifierIds || []
        })),
        promoCode: state.cart.promoCode || undefined,
        deliveryZoneId: state.cart.deliveryZoneId || undefined
      };
      const res = await axios.post('/api/cart/calculate', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: savedCart.items || [],
    totals: {
      subtotal: 0,
      vatRate: 0.12,
      vatAmount: 0,
      amountInclVat: 0,
      discountRate: 0,
      discountAmount: 0,
      deliveryFee: 0,
      total: 0,
      currencyCode: 'UZS'
    },
    promoCode: null,
    deliveryZoneId: null,
    status: 'idle'
  },
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i.productId === item.productId);
      if (existing) {
        existing.quantity += (item.quantity || 1);
      } else {
        state.items.push({
          productId: item.productId,
          name: item.name,
          unitPrice: item.unitPrice,
          imageUrl: item.imageUrl,
          quantity: item.quantity || 1,
          modifierIds: item.modifierIds || []
        });
      }
      setStorageItem(STORAGE_KEY_CART, { items: state.items });
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.productId !== action.payload);
      setStorageItem(STORAGE_KEY_CART, { items: state.items });
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i.productId === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.productId !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      setStorageItem(STORAGE_KEY_CART, { items: state.items });
    },
    setPromoCode: (state, action) => {
      state.promoCode = action.payload;
    },
    setDeliveryZoneId: (state, action) => {
      state.deliveryZoneId = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
      state.deliveryZoneId = null;
      state.totals = {
        subtotal: 0,
        vatRate: 0.12,
        vatAmount: 0,
        amountInclVat: 0,
        discountRate: 0,
        discountAmount: 0,
        deliveryFee: 0,
        total: 0,
        currencyCode: 'UZS'
      };
      setStorageItem(STORAGE_KEY_CART, { items: [] });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(calculateCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totals = action.payload;
      })
      .addCase(calculateCart.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const { addItem, removeItem, updateQuantity, setPromoCode, setDeliveryZoneId, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
