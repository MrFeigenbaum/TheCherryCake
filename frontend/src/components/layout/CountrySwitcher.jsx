import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRegion } from '../../store/regionSlice';
import { calculateCart } from '../../store/cartSlice';

const COUNTRIES = [
  { code: 'UZ', label: '🇺🇿 UZ · UZS', currency: 'UZS' },
  { code: 'KZ', label: '🇰🇿 KZ · KZT', currency: 'KZT' },
  { code: 'RU', label: '🇷🇺 RU · RUB', currency: 'RUB' },
  { code: 'GE', label: '🇬🇪 GE · GEL', currency: 'GEL' },
  { code: 'UA', label: '🇺🇦 UA · UAH', currency: 'UAH' },
  { code: 'CN', label: '🇨🇳 CN · CNY', currency: 'CNY' }
];

export function CountrySwitcher({ className = '' }) {
  const dispatch = useDispatch();
  const currentRegion = useSelector((state) => state.region.code);

  const handleChange = (e) => {
    const newCode = e.target.value;
    dispatch(setRegion(newCode));
    dispatch(calculateCart());
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }} className={className}>
      <label htmlFor="country-select" className="sr-only">
        Страна
      </label>
      <select
        id="country-select"
        value={currentRegion}
        onChange={handleChange}
        data-testid="country-switcher"
        style={{
          minHeight: 'var(--touch-target)',
          padding: '0 var(--space-3)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
          fontWeight: 600,
          fontSize: 'var(--font-size-sm)',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CountrySwitcher;
