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
  INITIAL_REGIONS,
} from './index';

describe('Redux Store', () => {
  it('should include all 17 regions in INITIAL_REGIONS', () => {
    expect(INITIAL_REGIONS).toHaveLength(17);
    const codes = INITIAL_REGIONS.map((r) => r.code);
    expect(codes).toContain('TUR');
    expect(codes).toContain('ARM');
    expect(codes).toContain('EST');
    expect(codes).toContain('SWE');
    expect(codes).toContain('ROU');
    expect(codes).toContain('BLR');
    expect(codes).toContain('RUS');
  });

  it('should update selected region and currency metadata for new regions', () => {
    store.dispatch(setRegion('TUR'));
    expect(store.getState().region.selected).toBe('TUR');
    expect(store.getState().region.currencyCode).toBe('TRY');
    expect(store.getState().region.currencySymbol).toBe('₺');
    expect(store.getState().region.vatRate).toBe(0.18);

    store.dispatch(setRegion('ARM'));
    expect(store.getState().region.selected).toBe('ARM');
    expect(store.getState().region.currencyCode).toBe('AMD');
    expect(store.getState().region.currencySymbol).toBe('֏');
    expect(store.getState().region.vatRate).toBe(0.20);

    store.dispatch(setRegion('SWE'));
    expect(store.getState().region.selected).toBe('SWE');
    expect(store.getState().region.currencyCode).toBe('SEK');
    expect(store.getState().region.currencySymbol).toBe('kr');
    expect(store.getState().region.vatRate).toBe(0.25);
  });

  it('should derive default language from newly supported countries', () => {
    store.dispatch(setLanguageFromRegion('ARM'));
    expect(store.getState().language.current).toBe('hy');

    store.dispatch(setLanguageFromRegion('TUR'));
    expect(store.getState().language.current).toBe('tr');

    store.dispatch(setLanguageFromRegion('EST'));
    expect(store.getState().language.current).toBe('et');

    store.dispatch(setLanguageFromRegion('SWE'));
    expect(store.getState().language.current).toBe('sv');

    store.dispatch(setLanguageFromRegion('FIN'));
    expect(store.getState().language.current).toBe('fi');
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

