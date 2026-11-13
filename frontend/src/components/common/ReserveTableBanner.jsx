import React from 'react';
import { Link } from 'react-router-dom';

export function ReserveTableBanner() {
  return (
    <div className="reservation-banner" id="reservation-banner">
      <div className="reservation-content">
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--sakura-pink)',
            fontWeight: 700,
            display: 'block',
            marginBottom: '6px'
          }}
        >
          Flagship Experience
        </span>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.8rem',
            color: 'var(--cheesecake-cream)',
            marginBottom: '8px'
          }}
        >
          Reserve a Table at Cherry Café
        </h3>
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.95rem',
            maxWidth: '580px',
            lineHeight: 1.6,
            margin: 0
          }}
        >
          Indulge in freshly baked pastries and signature cakes in an enchanting cherry blossom atmosphere.
          Instant confirmation with automated seating conflict prevention.
        </p>
      </div>

      <Link
        to="/booking"
        className="btn btn-primary"
        id="openBookingModalBtn"
        style={{
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          padding: '14px 28px',
          fontSize: '0.95rem'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>Book a Table</span>
      </Link>
    </div>
  );
}

export default ReserveTableBanner;
