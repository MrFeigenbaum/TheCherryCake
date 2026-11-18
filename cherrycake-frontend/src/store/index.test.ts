import { describe, it, expect } from 'vitest';
import {
  store,
  setRegion,
  setLanguage,
  setLanguageFromRegion,
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

  it('should update language and derive from country', () => {
    // Switch to Georgia -> language should default to Georgian ('ka')
    store.dispatch(setLanguageFromRegion('GEO'));
    expect(store.getState().language.current).toBe('ka');

    // User can manually switch to Russian or English
    store.dispatch(setLanguage('ru'));
    expect(store.getState().language.current).toBe('ru');

    store.dispatch(setLanguage('en'));
    expect(store.getState().language.current).toBe('en');
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

