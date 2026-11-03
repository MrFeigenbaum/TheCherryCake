import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const adminTabs = [
  { path: '/admin/catalog', label: 'Каталог' },
  { path: '/admin/prices', label: 'Цены и наличие' },
  { path: '/admin/regions', label: 'Регионы / НДС' },
  { path: '/admin/discounts', label: 'Скидки' },
  { path: '/admin/promo-codes', label: 'Промокоды' },
  { path: '/admin/orders', label: 'Заказы' }
];

export function AdminLayout() {
  return (
    <div className="container" style={{ padding: 'var(--space-6) 0' }}>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: 'var(--font-size-2xl)' }}>
          Панель управления
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Управление каталогом, ценами, регионами и заказами</p>
      </div>

      <nav
        aria-label="Вкладки панели управления"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: 'var(--space-6)',
          overflowX: 'auto'
        }}
      >
        {adminTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            style={({ isActive }) => ({
              padding: 'var(--space-2) var(--space-4)',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            })}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}

export default AdminLayout;
