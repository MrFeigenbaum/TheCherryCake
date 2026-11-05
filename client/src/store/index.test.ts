import { describe, it, expect } from 'vitest';
import {
  store,
  setRegion,
  setRegionDetails,
  addToCart,
  clearCart,
  setCartTotals,
  showToast,
  hideToast,
  setGlobalLoading,
} from './index';

describe('Redux Store', () => {
  it('should update global loading state', () => {
    store.dispatch(setGlobalLoading(true));
    expect(store.getState().ui.globalLoading).toBe(true);

    store.dispatch(setGlobalLoading(false));
    expect(store.getState().ui.globalLoading).toBe(false);
  });

  it('should update cart totals', () => {
    store.dispatch(
      setCartTotals({
        subtotal: 100000,
        vatAmount: 12000,
        amountInclVat: 112000,
        discountAmount: 0,
        deliveryFee: 10000,
        total: 122000,
        currencyCode: 'UZS',
      }),
    );

    const totals = store.getState().cart.totals;

    expect(totals.subtotal).toBe(100000);
    expect(totals.vatAmount).toBe(12000);
    expect(totals.total).toBe(122000);
    expect(totals.currencyCode).toBe('UZS');
  });

  it('should update selected region', () => {
    store.dispatch(setRegion('Samarkand'));
    expect(store.getState().region.selected).toBe('Samarkand');
  });

  it('should update region details', () => {
    store.dispatch(
      setRegionDetails({
        code: 'UZ',
        currencyCode: 'UZS',
        currencySymbol: "so'm",
        vatRate: 0.12,
      }),
    );

    const region = store.getState().region;

    expect(region.code).toBe('UZ');
    expect(region.currencyCode).toBe('UZS');
    expect(region.currencySymbol).toBe("so'm");
    expect(region.vatRate).toBe(0.12);
  });

  it('should add items to cart', () => {
    store.dispatch(clearCart());
    store.dispatch(addToCart('Cherry Cake'));
    expect(store.getState().cart.items).toContain('Cherry Cake');
  });

  it('should clear cart', () => {
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
