import React from 'react';
import { useParams, Link } from 'react-router-dom';

export function OrderSuccess() {
  const { orderNumber } = useParams();

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
      <div
        className="card"
        style={{
          background: 'var(--cherry-card)',
          border: '2px solid var(--cherry-border)',
          borderRadius: '20px',
          padding: '40px 28px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ fontSize: '54px', marginBottom: '14px' }}>🌸</div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--cheesecake-cream)',
            fontSize: '1.9rem',
            marginBottom: '8px'
          }}
        >
          Order Confirmed!
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.5 }}>
          Thank you for choosing Cherry Cake Haute Pâtisserie. Our artisan pastry chefs have received your order and begun baking.
        </p>

        <div
          style={{
            padding: '18px',
            backgroundColor: 'rgba(18, 6, 14, 0.5)',
            borderRadius: '12px',
            border: '2px dashed var(--cherry-border-glow)',
            marginBottom: '24px'
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
            Your Order Reference:
          </span>
          <strong
            data-testid="order-success-number"
            style={{ fontSize: '1.4rem', color: 'var(--sakura-pink)', letterSpacing: '1px' }}
          >
            {orderNumber || 'CC-2026-0001'}
          </strong>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/menu" style={{ textDecoration: 'none' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '12px 24px', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 600, border: '2px solid var(--cherry-border)' }}
            >
              Back to Menu
            </button>
          </Link>
          <Link to="/account" style={{ textDecoration: 'none' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '12px 26px', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 700, border: '2px solid rgba(255, 255, 255, 0.3)' }}
            >
              View Order in Cabinet
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
