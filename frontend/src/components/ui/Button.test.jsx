import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Нажми меня</Button>);
    expect(screen.getByText('Нажми меня')).toBeInTheDocument();
  });

  it('handles click events when active', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Клик</Button>);
    fireEvent.click(screen.getByText('Клик'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Заблокировано</Button>);
    fireEvent.click(screen.getByText('Заблокировано'));
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders loading spinner and sets aria-busy when loading', () => {
    render(<Button loading>Загрузка</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
  });
});
