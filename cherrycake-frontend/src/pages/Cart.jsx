import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem, updateQuantity, calculateCart, clearCart, setPromoCode } from '../store/cartSlice';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { formatMoney } from '../utils/format-money';

export function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector((state) => state.cart.totals);
  const promoCode = useSelector((state) => state.cart.promoCode);
  const promoError = useSelector((state) => state.cart.promoError);
  const cartStatus = useSelector((state) => state.cart.status);
  const regionCode = useSelector((state) => state.region.code);
  const currencyCode = useSelector((state) => state.region.currencyCode);

  const [promoInput, setPromoInput] = useState(promoCode || '');

  useEffect(() => {
    if (items.length > 0) {
      dispatch(calculateCart());
    }
  }, [items, regionCode, dispatch]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    dispatch(setPromoCode(promoInput.trim().toUpperCase()));
    dispatch(calculateCart(promoInput.trim().toUpperCase()));
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
        <EmptyState
          icon="🛍️"
          title="Your Bag is Empty"
          text="Discover our artisanal cakes and handcrafted delicacies in the menu."
          actionText="Explore Artisan Menu"
          onAction={() => { window.location.href = '/menu'; }}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '1100px', margin: '0 auto' }}>
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          color: 'var(--cheesecake-cream)',
          fontSize: 'var(--font-size-2xl)',
          marginBottom: 'var(--space-6)'
        }}
      >
        Your Sweet Bag
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Cart items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {items.map((item) => (
            <div
              key={item.productId}
              className="card"
              style={{
                background: 'var(--cherry-card)',
                border: '2px solid var(--cherry-border)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>
                  {item.name}
                </h3>
                {item.customizations?.specs && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                    {item.customizations.specs}
                  </div>
                )}
                <span style={{ fontSize: '0.88rem', color: 'var(--sakura-pink)', fontWeight: 600 }}>
                  {formatMoney(item.unitPrice, currencyCode)} each
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '2px solid var(--cherry-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'var(--input-bg)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                    style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-main)' }}
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <span style={{ padding: '6px 10px', fontWeight: 700, color: 'var(--text-main)' }}>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                    style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-main)' }}
                    aria-label="Increase quantity"
                  >
                    &#43;
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => dispatch(removeItem(item.productId))}
                  style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '2px solid var(--cherry-border)' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(clearCart())}
              style={{ border: '2px solid var(--cherry-border)', padding: '8px 18px', fontSize: '0.85rem' }}
            >
              Empty Bag
            </button>
          </div>
        </div>

        {/* Totals Summary */}
        <div
          className="card"
          style={{
            backgroundColor: 'var(--cherry-card)',
            border: '2px solid var(--cherry-border)',
            borderRadius: '20px',
            padding: '28px'
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontFamily: "'Playfair Display', serif",
              color: 'var(--cheesecake-cream)',
              marginBottom: 'var(--space-4)'
            }}
          >
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Subtotal (Excl. VAT):</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formatMoney(totals.subtotal, totals.currencyCode || currencyCode)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Estimated VAT ({Math.round((totals.vatRate || 0.12) * 100)}%):</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formatMoney(totals.vatAmount, totals.currencyCode || currencyCode)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Subtotal Incl. VAT:</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formatMoney(totals.amountInclVat, totals.currencyCode || currencyCode)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)', fontWeight: 600 }}>
                <span>Discount ({Math.round((totals.discountRate || 0) * 100)}%):</span>
                <span>-{formatMoney(totals.discountAmount, totals.currencyCode || currencyCode)}</span>
              </div>
            )}
            {totals.deliveryFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
                <span>Delivery:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formatMoney(totals.deliveryFee, totals.currencyCode || currencyCode)}</span>
              </div>
            )}
            <hr style={{ border: 'none', borderTop: '2px solid var(--cherry-border)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--cheesecake-cream)' }}>
              <span>Total:</span>
              <span style={{ color: 'var(--sakura-pink)' }}>{formatMoney(totals.total || totals.amountInclVat, totals.currencyCode || currencyCode)}</span>
            </div>
          </div>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <input
                  name="promoCode"
                  data-testid="promo-input"
                  placeholder="Promo Code (WELCOME / CHERRY2026)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '2px solid var(--cherry-border)',
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-secondary"
                data-testid="promo-apply-button"
                disabled={cartStatus === 'loading'}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '2px solid var(--cherry-border)'
                }}
              >
                Apply
              </button>
            </div>
            {promoError && (
              <span
                data-testid="promo-error"
                style={{ color: 'var(--color-error)', fontSize: '0.78rem', marginTop: '6px', display: 'block', fontWeight: 600 }}
              >
                {promoError}
              </span>
            )}
            {totals.discountAmount > 0 && promoCode && !promoError && (
              <span
                style={{ color: 'var(--color-success)', fontSize: '0.78rem', marginTop: '6px', display: 'block', fontWeight: 600 }}
              >
                Promo code &ldquo;{promoCode}&rdquo; applied successfully!
              </span>
            )}
          </form>

          <Link to="/checkout" style={{ textDecoration: 'none' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 18px rgba(230, 57, 96, 0.45)',
                cursor: 'pointer'
              }}
            >
              Proceed to Checkout &rarr;
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
