import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setRegionDetails } from '../../store';
import './Layout.css';

interface Region {
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  vatRate: number;
}

const REGIONS: Region[] = [
  { code: 'UZB', name: 'Uzbekistan', currencyCode: 'UZS', currencySymbol: "so'm", vatRate: 0.15 },
  { code: 'KAZ', name: 'Kazakhstan', currencyCode: 'KZT', currencySymbol: '₸', vatRate: 0.20 },
  { code: 'GEO', name: 'Georgia', currencyCode: 'GEL', currencySymbol: '₾', vatRate: 0.12 },
  { code: 'UKR', name: 'Ukraine', currencyCode: 'UAH', currencySymbol: '₴', vatRate: 0.08 },
  { code: 'CHN', name: 'China', currencyCode: 'CNY', currencySymbol: '¥', vatRate: 0.18 },
  { code: 'ARM', name: 'Armenia', currencyCode: 'AMD', currencySymbol: '֏', vatRate: 0.20 },
  { code: 'AZE', name: 'Azerbaijan', currencyCode: 'AZN', currencySymbol: '₼', vatRate: 0.18 },
  { code: 'TUR', name: 'Turkey', currencyCode: 'TRY', currencySymbol: '₺', vatRate: 0.18 },
  { code: 'MDA', name: 'Moldova', currencyCode: 'MDL', currencySymbol: 'L', vatRate: 0.20 },
  { code: 'EST', name: 'Estonia', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.22 },
  { code: 'LVA', name: 'Latvia', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.21 },
  { code: 'LTU', name: 'Lithuania', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.21 },
  { code: 'FIN', name: 'Finland', currencyCode: 'EUR', currencySymbol: '€', vatRate: 0.24 },
  { code: 'SWE', name: 'Sweden', currencyCode: 'SEK', currencySymbol: 'kr', vatRate: 0.25 },
];

const FLAG_MAP: Record<string, string> = {
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
  ru: 'ru', rus: 'rus',
};

export function getFlagSrc(code: string): string {
  const c = (code || '').toLowerCase().trim();
  const file = FLAG_MAP[c] || c;
  return `/assets/flags/${file}.svg`;
}

export function formatVatDisplay(val: number): string {
  if (val === undefined || val === null) return '12% VAT';
  let num = val;
  if (num < 1 && num > 0) num = num * 100;
  return `${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)}% VAT`;
}

export default function CountrySwitcher() {
  const dispatch = useDispatch();
  const currentRegion = useSelector((state: RootState) => state.region.code);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSelect = (r: Region) => {
    dispatch(setRegionDetails(r));
    setIsOpen(false);
  };

  const selectedRegionObj =
    REGIONS.find((r) => r.code === currentRegion) || REGIONS[0];

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
    >
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
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        <span>{selectedRegionObj.code}</span>
        <span className="region-select-arrow">&#9662;</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="region-dropdown-menu" role="listbox">
          {REGIONS.map((r) => {
            const isSelected = r.code === currentRegion;
            return (
              <div
                key={r.code}
                role="option"
                aria-selected={isSelected}
                className={`region-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(r)}
              >
                <img
                  src={getFlagSrc(r.code)}
                  alt={r.code}
                  className="region-flag-img"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
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
