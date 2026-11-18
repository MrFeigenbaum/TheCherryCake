import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCartDrawer } from '../../store/uiSlice';

export function CartBadge({ className = '' }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleCartDrawer())}
      className={`cart-trigger-btn ${className}`}
      data-testid="cart-badge-link"
      title="View Confectionery Bag"
      aria-label={`Shopping bag, ${totalCount} items`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      <span className="cart-btn-text">Bag</span>
      <span className="cart-counter-badge" data-testid="cart-badge-count">{totalCount}</span>
    </button>
  );
}

export default CartBadge;
