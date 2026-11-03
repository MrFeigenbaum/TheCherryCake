import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

export function CartBadge({ className = '' }) {
  const items = useSelector((state) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Link
      to="/cart"
      data-testid="cart-badge-link"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: '0 var(--space-3)',
        minHeight: 'var(--touch-target)',
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
        fontSize: 'var(--font-size-sm)',
        textDecoration: 'none'
      }}
      className={className}
      aria-label={`Корзина, товаров: ${totalCount}`}
    >
      <span aria-hidden="true">🛒</span>
      <span>Корзина</span>
      {totalCount > 0 && (
        <Badge variant="secondary" count={totalCount} data-testid="cart-badge-count" />
      )}
    </Link>
  );
}

export default CartBadge;
