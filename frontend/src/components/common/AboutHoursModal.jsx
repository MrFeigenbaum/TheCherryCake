import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeAboutModal, openCustomCake } from '../../store/uiSlice';

export function AboutHoursModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui?.isAboutModalOpen);

  if (!isOpen) return null;

  const handleBooking = () => {
    dispatch(closeAboutModal());
    navigate('/booking');
  };

  const handleCustomCake = () => {
    dispatch(closeAboutModal());
    dispatch(openCustomCake());
  };

  const handleBrowseMenu = () => {
    dispatch(closeAboutModal());
    navigate('/menu');
  };

  return (
    <div
      className="cc-modal open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aboutModalTitle"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 3500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dispatch(closeAboutModal());
      }}
    >
      <div
        className="modal-dialog"
        style={{
          backgroundColor: 'var(--cherry-panel)',
          border: '2px solid var(--cherry-border)',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          padding: '32px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.75)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header with Close Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(230, 57, 96, 0.4), rgba(45, 14, 36, 0.8))',
                border: '2px solid var(--cherry-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(230, 57, 96, 0.35)',
                flexShrink: 0
              }}
            >
              <img
                src="/TransparentSakuraFlower.png"
                alt="Cherry Cake"
                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
              />
            </div>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--sakura-pink)',
                  fontWeight: 700,
                  display: 'block'
                }}
              >
                Haute Pâtisserie &amp; Specialty Café
              </span>
              <h2
                id="aboutModalTitle"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  color: 'var(--cheesecake-cream)',
                  margin: 0
                }}
              >
                About &amp; Hospitality Hours
              </h2>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-round-btn"
            onClick={() => dispatch(closeAboutModal())}
            aria-label="Close About modal"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid var(--cherry-border)',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              fontSize: '1.3rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            &times;
          </button>
        </div>

        {/* Story Section */}
        <div
          style={{
            background: 'rgba(45, 14, 36, 0.55)',
            border: '2px solid var(--cherry-border)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px'
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.15rem',
              color: 'var(--sakura-pink)',
              marginBottom: '8px'
            }}
          >
            Our Heritage &amp; Craftsmanship
          </h3>
          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              margin: 0
            }}
          >
            Founded with a passion for exquisite confectionery, <strong>Cherry Cake</strong> unites
            classical French viennoiserie with delicate Japanese cherry blossom botanicals.
            Every gateau, macaron, and celebration tier is handcrafted daily by our master pâtissiers
            using single-origin Normandy butter, organic vanilla beans, and premier Belgian chocolate.
          </p>
        </div>

        {/* Hours Grid */}
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--crust-gold)',
              marginBottom: '12px'
            }}
          >
            Operating Schedules
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px'
            }}
          >
            {/* Dining Room */}
            <div
              style={{
                background: 'var(--cherry-card)',
                border: '2px solid var(--cherry-border)',
                borderRadius: '14px',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>☕</div>
              <strong style={{ display: 'block', color: 'var(--cheesecake-cream)', fontSize: '0.95rem' }}>
                Café &amp; Dining
              </strong>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '4px' }}>
                <div>Mon – Fri: <strong>08:00 – 22:00</strong></div>
                <div>Sat – Sun: <strong>09:00 – 23:00</strong></div>
              </div>
            </div>

            {/* Hub Pickup */}
            <div
              style={{
                background: 'var(--cherry-card)',
                border: '2px solid var(--cherry-border)',
                borderRadius: '14px',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🛍️</div>
              <strong style={{ display: 'block', color: 'var(--cheesecake-cream)', fontSize: '0.95rem' }}>
                Boutique Pickup Hub
              </strong>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '4px' }}>
                <div>Daily: <strong>08:30 – 21:30</strong></div>
                <div style={{ fontSize: '0.78rem', color: 'var(--mint-fresh)', marginTop: '2px' }}>
                  Ready within 15 mins
                </div>
              </div>
            </div>

            {/* Courier Delivery */}
            <div
              style={{
                background: 'var(--cherry-card)',
                border: '2px solid var(--cherry-border)',
                borderRadius: '14px',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🛵</div>
              <strong style={{ display: 'block', color: 'var(--cheesecake-cream)', fontSize: '0.95rem' }}>
                Courier Delivery
              </strong>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '4px' }}>
                <div>Daily: <strong>10:00 – 20:30</strong></div>
                <div style={{ fontSize: '0.78rem', color: 'var(--sakura-pink)', marginTop: '2px' }}>
                  Temperature-controlled van
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact Info */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '2px solid var(--cherry-border)',
            borderRadius: '14px',
            padding: '14px 18px',
            marginBottom: '24px',
            fontSize: '0.88rem'
          }}
        >
          <div>
            <span style={{ color: 'var(--text-dim)' }}>Flagship Location:</span>{' '}
            <strong style={{ color: '#FFFFFF' }}>14 Sakura Boulevard, Central District</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>Concierge:</span>{' '}
            <strong style={{ color: 'var(--crust-gold)' }}>+998 (71) 200-26-26</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBrowseMenu}
            style={{ border: '2px solid var(--cherry-border)', borderRadius: '9999px', padding: '10px 20px' }}
          >
            Explore Menu
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCustomCake}
            style={{ border: '2px solid var(--crust-gold)', color: 'var(--crust-gold)', borderRadius: '9999px', padding: '10px 20px' }}
          >
            🎂 Custom Cake Studio
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleBooking}
            style={{ borderRadius: '9999px', padding: '10px 24px', fontWeight: 700 }}
          >
            Reserve a Table
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutHoursModal;

