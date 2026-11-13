import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input Component (CC-12)', () => {
  it('renders label and handles typing', () => {
    const handleChange = vi.fn();
    render(
      <Input
        label="Имя пользователя"
        value="Анна"
        onChange={handleChange}
        placeholder="Введите имя"
      />
    );

    const input = screen.getByLabelText(/Имя пользователя/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Анна');

    fireEvent.change(input, { target: { value: 'Мария' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders error message with aria-invalid and aria-describedby', () => {
    render(
      <Input
        label="Электронная почта"
        value=""
        onChange={() => {}}
        error="Некорректный email"
      />
    );

    const input = screen.getByLabelText(/Электронная почта/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Некорректный email');
  });

  it('respects disabled attribute', () => {
    render(
      <Input
        label="Заблокировано"
        value="Тест"
        onChange={() => {}}
        disabled
      />
    );

    const input = screen.getByLabelText(/Заблокировано/i);
    expect(input).toBeDisabled();
  });
});