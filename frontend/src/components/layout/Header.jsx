import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CountrySwitcher from './CountrySwitcher';
import CartBadge from './CartBadge';

export function Header() {
  const currencyCode = useSelector((state) => state.region.currencyCode);
  const regionCode = useSelector((state) => state.region.code);
  const user = useSelector((state) => state.auth.user);

  const navLinkStyle = ({ isActive }) => ({
    padding: 'var(--space-2) var(--space-3)',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
    borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 'var(--touch-target)'
  });

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '64px',
          flexWrap: 'wrap',
          gap: 'var(--space-3)'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            textDecoration: 'none'
          }}
        >
          <span style={{ fontSize: '24px' }}>🌸</span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-size-xl)',
              fontWeight: 700,
              color: 'var(--color-primary)'
            }}
          >
            Cherry Cake
          </span>
        </Link>

        {/* Navigation links */}
        <nav
          aria-label="Основная навигация"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            flexWrap: 'wrap'
          }}
        >
          <NavLink to="/menu" style={navLinkStyle}>
            Меню
          </NavLink>
          <NavLink to="/booking" style={navLinkStyle}>
            Бронь
          </NavLink>
          <NavLink to="/reports" style={navLinkStyle}>
            Отчёты
          </NavLink>
          <NavLink to="/ui-kit" style={navLinkStyle}>
            UI-кит
          </NavLink>
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin/catalog" style={navLinkStyle}>
              Админка
            </NavLink>
          )}
        </nav>

        {/* Right tools: Country, Currency, Cart, Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <CountrySwitcher />
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 700,
              padding: '4px 8px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius-sm)'
            }}
            title="Активная валюта"
          >
            {regionCode} ({currencyCode})
          </span>
          <CartBadge />
          {user ? (
            <Link
              to="/account"
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                color: 'var(--color-primary)',
                textDecoration: 'none'
              }}
            >
              {user.email}
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                color: 'var(--color-primary)',
                textDecoration: 'none'
              }}
            >
              Вход
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
