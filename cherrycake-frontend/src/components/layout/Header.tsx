import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { toggleTheme } from '../../store';
import CountrySwitcher from './CountrySwitcher';
import CartBadge from './CartBadge';
import './Layout.css';

export default function Header() {
  const theme = useSelector((state: RootState) => state.ui.theme);
  const dispatch = useDispatch();

  return (
    <header className="cc-header">
      <div className="cc-header-inner">
        <Link to="/" className="cc-layout-brand">
          <img
            src="/TransparentSakuraFlower.png"
            alt="Cherry Cake Blossom"
            className="cc-brand-logo-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="cc-brand-title-wrap">
            <span className="cc-brand-title">Cherry Cake</span>
            <span className="cc-brand-subtitle">Bakery &amp; Café</span>
          </div>
        </Link>

        <nav className="cc-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => (isActive ? 'active' : '')}>
            Menu
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
            Reports
          </NavLink>
          <NavLink to="/ui-kit" className={({ isActive }) => (isActive ? 'active' : '')}>
            UI Kit
          </NavLink>
        </nav>

        <div className="cc-header-actions">
          <button
            type="button"
            className="cc-theme-toggle-btn"
            onClick={() => dispatch(toggleTheme())}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>Dark</span>
              </>
            )}
          </button>

          <CountrySwitcher />
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
