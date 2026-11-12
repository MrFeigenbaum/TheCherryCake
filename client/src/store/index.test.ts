import { describe, it, expect } from 'vitest';

import {
  store,
  setRegion,
  setRegionCode,
  addToCart,
  clearCart,
  showToast,
  hideToast,
} from './index';

describe('Redux Store', () => {
  it('should update selected country', () => {
    store.dispatch(setRegion('KAZ'));

    expect(store.getState().region.code).toBe('KAZ');
    expect(store.getState().region.selected).toBe('KAZ');
  });

  it('should update currency and VAT for Uzbekistan', () => {
    store.dispatch(setRegionCode('UZB'));

    const region = store.getState().region;

    expect(region.code).toBe('UZB');
    expect(region.currencyCode).toBe('UZS');
    expect(region.vatRate).toBe(0.15);
  });

  it('should update currency and VAT when switching countries', () => {
    const countries = [
      { code: 'UZB', currency: 'UZS', vat: 0.15 },
      { code: 'KAZ', currency: 'KZT', vat: 0.20 },
      { code: 'GEO', currency: 'GEL', vat: 0.12 },
      { code: 'UKR', currency: 'UAH', vat: 0.08 },
      { code: 'CHN', currency: 'CNY', vat: 0.18 },
    ];

    for (const country of countries) {
      store.dispatch(setRegionCode(country.code));

      const region = store.getState().region;

      expect(region.code).toBe(country.code);
      expect(region.currencyCode).toBe(country.currency);
      expect(region.vatRate).toBe(country.vat);
    }
  });

  it('should reject an invalid country', () => {
    store.dispatch(setRegionCode('UZB'));
    store.dispatch(setRegionCode('INVALID'));

    expect(store.getState().region.code).toBe('UZB');
  });

  it('should add items to cart', () => {
    store.dispatch(clearCart());
    store.dispatch(addToCart('Cherry Cake'));

    expect(store.getState().cart.items).toContain('Cherry Cake');
  });

  it('should clear cart', () => {
    store.dispatch(addToCart('Chocolate Cake'));
    store.dispatch(clearCart());

    expect(store.getState().cart.items).toHaveLength(0);
  });

  it('should show and hide toast', () => {
    store.dispatch(showToast('Test notification'));

    expect(store.getState().ui.toast).toBe('Test notification');

    store.dispatch(hideToast());

    expect(store.getState().ui.toast).toBe('');
  });
});
