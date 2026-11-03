import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import store from './store';
import App from './App';

describe('App & Router Integration (CC-11)', () => {
  it('renders application with navigation and header', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Header and footer brand
    const brandElements = screen.getAllByText('Cherry Cake');
    expect(brandElements.length).toBeGreaterThanOrEqual(1);

    // Country switcher
    expect(screen.getByTestId('country-switcher')).toBeInTheDocument();

    // Nav links
    expect(screen.getByText('Меню')).toBeInTheDocument();
    expect(screen.getByText('Бронь')).toBeInTheDocument();
    expect(screen.getByText('UI-кит')).toBeInTheDocument();
  });
});
