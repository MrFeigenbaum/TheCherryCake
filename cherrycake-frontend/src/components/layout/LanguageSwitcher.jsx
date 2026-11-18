import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../store/languageSlice';
import { LANGUAGES } from '../../i18n/translations';

export function LanguageSwitcher({ className = '' }) {
  const dispatch = useDispatch();
  const currentLang = useSelector((state) => state.language?.current || 'en');
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
    dispatch(setLanguage(code));
    setIsOpen(false);
  };

  const selectedLangObj = LANGUAGES.find((l) => l.code === currentLang) || {
    code: currentLang,
    label: currentLang.toUpperCase(),
    nativeName: currentLang.toUpperCase(),
    flag: '🌐',
  };

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      className={`lang-switcher-wrap ${className}`}
    >
      {/* Hidden native select for accessibility & automation */}
      <select
        id="language-select"
        data-testid="language-select"
        value={currentLang}
        onChange={(e) => handleSelect(e.target.value)}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.code.toUpperCase()} · {l.nativeName} ({l.label})
          </option>
        ))}
      </select>

      {/* Custom Sleek Language Trigger */}
      <button
        type="button"
        data-testid="language-switcher"
        className={`lang-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Select display language"
      >
        <span className="lang-flag-icon">{selectedLangObj.flag}</span>
        <span className="lang-code-text">{selectedLangObj.code.toUpperCase()}</span>
        <span className="lang-select-arrow">&#9662;</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="lang-dropdown-menu" role="listbox">
          <div className="lang-dropdown-header">
            <span>Select Language // Тил // ენა</span>
          </div>
          <div className="lang-dropdown-list">
            {LANGUAGES.map((l) => {
              const isSelected = l.code === currentLang;
              return (
                <div
                  key={l.code}
                  role="option"
                  aria-selected={isSelected}
                  className={`lang-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(l.code)}
                >
                  <span className="lang-option-flag">{l.flag}</span>
                  <span className="lang-option-code">{l.code.toUpperCase()}</span>
                  <span className="lang-option-name">{l.nativeName}</span>
                  <span className="lang-option-label">{l.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
