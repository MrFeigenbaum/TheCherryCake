import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from './Select';

describe('Select Component (CC-12)', () => {
  const options = [
    { value: 'UZ', label: 'Узбекистан' },
    { value: 'KZ', label: 'Казахстан' }
  ];

  it('renders with label and options', () => {
    const handleChange = vi.fn();
    render(
      <Select
        label="Страна"
        value="UZ"
        onChange={handleChange}
        options={options}
      />
    );

    const select = screen.getByLabelText(/Страна/i);
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('UZ');

    fireEvent.change(select, { target: { value: 'KZ' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders error state correctly', () => {
    render(
      <Select
        label="Страна"
        value=""
        onChange={() => {}}
        options={options}
        error="Выберите страну"
      />
    );

    const select = screen.getByLabelText(/Страна/i);
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Выберите страну');
  });
});