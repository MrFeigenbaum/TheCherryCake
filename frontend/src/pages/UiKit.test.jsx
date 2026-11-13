import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import store from '../store';
import UiKit from './UiKit';

describe('UI-Kit Showcase Page Walkthrough (CC-17b Audit)', () => {
  it('renders all component sections and headings', () => {
    render(
      <Provider store={store}>
        <UiKit />
      </Provider>
    );

    expect(screen.getByText(/Витрина UI-кита/i)).toBeInTheDocument();
    expect(screen.getByText(/1. Кнопки/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Поля ввода/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Выпадающие списки/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Чекбоксы и радиокнопки/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Карточки/i)).toBeInTheDocument();
    expect(screen.getByText(/6. Модальное окно/i)).toBeInTheDocument();
    expect(screen.getByText(/7. Таблица, лоадер/i)).toBeInTheDocument();
  });

  it('verifies Button states: default, disabled, loading', () => {
    render(
      <Provider store={store}>
        <UiKit />
      </Provider>
    );

    const primaryBtn = screen.getByRole('button', { name: /Primary Default/i });
    expect(primaryBtn).toBeEnabled();

    const disabledBtn = screen.getByRole('button', { name: /Primary Disabled/i });
    expect(disabledBtn).toBeDisabled();
  });

  it('verifies Input states: error text and disabled', () => {
    render(
      <Provider store={store}>
        <UiKit />
      </Provider>
    );

    expect(screen.getByText(/Это поле обязательно для заполнения/i)).toBeInTheDocument();
    const disabledInput = screen.getByLabelText(/Заблокированное поле/i);
    expect(disabledInput).toBeDisabled();
  });

  it('verifies Modal opening and Escape closing', async () => {
    render(
      <Provider store={store}>
        <UiKit />
      </Provider>
    );

    const openBtn = screen.getByRole('button', { name: /Открыть Modal/i });
    fireEvent.click(openBtn);

    const modalDialog = screen.getByRole('dialog');
    expect(modalDialog).toBeInTheDocument();
    expect(modalDialog).toHaveAttribute('aria-modal', 'true');

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('verifies Toast trigger', async () => {
    render(
      <Provider store={store}>
        <UiKit />
      </Provider>
    );

    const toastBtn = screen.getByRole('button', { name: /Тост: Успех/i });
    fireEvent.click(toastBtn);

    // uiSlice adds toast
    const toasts = store.getState().ui.toasts;
    expect(toasts.some((t) => t.message === 'Успешное действие!')).toBe(true);
  });
});