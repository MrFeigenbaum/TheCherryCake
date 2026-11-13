import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, openCustomCake, openAboutModal } from '../../store/uiSlice';
import CountrySwitcher from './CountrySwitcher';
import CartBadge from './CartBadge';

export function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const currentTheme = useSelector((state) => state.ui?.theme || 'dark');

  return (
    <header className="site-header">
      <nav className="cc-navbar">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">
            <img
              src="/TransparentSakuraFlower.png?v=3"
              alt="Cherry Logo"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/TransparentSakuraFlower.png";
              }}
              style={{ width: '24px', height: '24px', flexShrink: 0, objectFit: 'contain' }}
            />
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-title">Cherry Cake</span>
            <span className="navbar-subtitle">Bakery &amp; Cafe</span>
          </div>
        </Link>

        {/* Navigation Links (matching 8080 portal) */}
        <div className="navbar-links">
          <NavLink to="/menu" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span>Artisan Menu</span>
            <span className="sr-only">Меню</span>
          </NavLink>
          <NavLink to="/booking" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span>Table Reservation</span>
            <span className="sr-only">Бронь</span>
          </NavLink>
          <button
            type="button"
            className="nav-link"
            onClick={() => dispatch(openAboutModal())}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            About &amp; Hours
          </button>
          {user ? (
            <NavLink to="/account" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Sign In / Account
            </NavLink>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Sign In / Account
            </NavLink>
          )}
          <button
            type="button"
            className="nav-link"
            onClick={() => dispatch(openCustomCake())}
            style={{
              color: 'var(--crust-gold)',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            <svg
              className="inline-svg-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}
            >
              <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
              <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
              <path d="M2 21h20" />
              <path d="M7 8v2" />
              <path d="M12 8v2" />
              <path d="M17 8v2" />
              <path d="M7 4h.01" />
              <path d="M12 4h.01" />
              <path d="M17 4h.01" />
            </svg>
            Custom Cake
          </button>
          <NavLink to="/reports" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span>Reports &amp; Analytics</span>
            <span className="sr-only">Отчёты</span>
          </NavLink>
          <NavLink to="/account" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            My Cabinet
          </NavLink>
          <a
            href="/swagger.html"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            API Reference
          </a>
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin/catalog" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Admin Portal
            </NavLink>
          )}
        </div>

        {/* Right actions: Theme, Region, Cart */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={() => dispatch(toggleTheme())}
            title={currentTheme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
            aria-label="Toggle theme"
          >
            <span id="themeToggleIcon">
              {currentTheme === 'dark' ? (
                <svg className="inline-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              ) : (
                <svg className="inline-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </span>
            <span id="themeToggleLabel">{currentTheme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Region Switcher */}
          <CountrySwitcher />

          {/* Cart */}
          <CartBadge />
        </div>
      </nav>
    </header>
  );
}

export default Header;
