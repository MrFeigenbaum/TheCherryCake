import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRegion } from '../../store/regionSlice';
import { calculateCart } from '../../store/cartSlice';

const FLAG_MAP = {
  uz: 'uzb', uzb: 'uzb',
  kz: 'kaz', kaz: 'kaz',
  ge: 'geo', geo: 'geo',
  ua: 'ukr', ukr: 'ukr',
  cn: 'chn', chn: 'chn',
  se: 'swe', swe: 'swe',
  fi: 'fin', fin: 'fin',
  lt: 'ltu', ltu: 'ltu',
  lv: 'lva', lva: 'lva',
  ee: 'est', est: 'est',
  by: 'blr', blr: 'blr',
  md: 'mda', mda: 'mda',
  ro: 'rou', rou: 'rou',
  tr: 'tur', tur: 'tur',
  az: 'aze', aze: 'aze',
  am: 'arm', arm: 'arm',
  ru: 'ru', rus: 'rus'
};

export function getFlagSrc(code) {
  const c = (code || '').toLowerCase().trim();
  const file = FLAG_MAP[c] || c;
  return `/assets/flags/${file}.svg`;
}

export function formatVatDisplay(val) {
  if (val === undefined || val === null) return '12% VAT';
  let num = parseFloat(val);
  if (num < 1 && num > 0) num = num * 100;
  return `${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)}% VAT`;
}

export function CountrySwitcher({ className = '' }) {
  const dispatch = useDispatch();
  const currentRegion = useSelector((state) => state.region.code);
  const regions = useSelector((state) => state.region.regions);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSelect = (code) => {
    dispatch(setRegion(code));
    dispatch(calculateCart());
    setIsOpen(false);
  };

  const selectedRegionObj = regions.find((r) => r.code === currentRegion) || {
    code: currentRegion,
    name: 'Uzbekistan'
  };

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      className={className}
    >
      {/* Hidden native select for accessibility & form automation */}
      <select
        id="country-select"
        value={currentRegion}
        onChange={(e) => handleSelect(e.target.value)}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        {regions.map((r) => (
          <option key={r.code} value={r.code}>
            {r.code} · {r.name}
          </option>
        ))}
      </select>

      {/* Custom Sleek Region Trigger */}
      <button
        type="button"
        data-testid="country-switcher"
        className={`region-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Select operating country and currency"
      >
        <img
          src={getFlagSrc(selectedRegionObj.code)}
          alt={selectedRegionObj.code}
          className="region-flag-img"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span>{selectedRegionObj.code}</span>
        <span className="region-select-arrow">&#9662;</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="region-dropdown-menu" role="listbox">
          {regions.map((r) => {
            const isSelected = r.code === currentRegion;
            return (
              <div
                key={r.code}
                role="option"
                aria-selected={isSelected}
                className={`region-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(r.code)}
              >
                <img
                  src={getFlagSrc(r.code)}
                  alt={r.code}
                  className="region-flag-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="region-option-code">{r.code}</span>
                <span className="region-option-name">{r.name}</span>
                <span className="region-option-meta">{formatVatDisplay(r.vatRate)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CountrySwitcher;
