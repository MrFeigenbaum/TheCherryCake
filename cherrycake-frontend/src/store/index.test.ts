import { describe, it, expect } from 'vitest';
import {
  store,
  setRegion,
  addToCart,
  clearCart,
  showToast,
  hideToast,
  toggleTheme,
  setTheme,
} from './index';

describe('Redux Store', () => {
  it('should update selected region', () => {
    store.dispatch(setRegion('KAZ'));
    expect(store.getState().region.selected).toBe('KAZ');
    expect(store.getState().region.currencyCode).toBe('KZT');
    expect(store.getState().region.vatRate).toBe(0.20);
  });

  it("should add items to cart", () => {
    store.dispatch(clearCart());
    store.dispatch(addToCart("Cherry Cake"));
    expect(store.getState().cart.items).toContain("Cherry Cake");
  });

  it("should clear cart", () => {
    store.dispatch(clearCart());
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it("should show and hide toast", () => {
    store.dispatch(showToast("Test notification"));
    expect(store.getState().ui.toast).toBe("Test notification");

    store.dispatch(hideToast());
    expect(store.getState().ui.toast).toBe("");
  });

  it('should toggle and set theme', () => {
    store.dispatch(setTheme('light'));
    expect(store.getState().ui.theme).toBe('light');

    store.dispatch(toggleTheme());
    expect(store.getState().ui.theme).toBe('dark');

    store.dispatch(toggleTheme());
    expect(store.getState().ui.theme).toBe('light');
  });
});

