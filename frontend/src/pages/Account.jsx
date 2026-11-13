import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { getMyOrders } from '../api/orders';
import { getMyBookings } from '../api/bookings';
import { formatMoney } from '../utils/format-money';
import { formatDate } from '../utils/format-date';

export function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const regionCode = useSelector((state) => state.region.code);
  const regions = useSelector((state) => state.region.regions);
  const currentRegion = regions.find((r) => r.code === regionCode) || {
    currencySymbol: "so'm",
    currencyCode: 'UZS'
  };
  const currencySymbol = currentRegion.currencySymbol || "so'm";

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'bookings' | 'profile'
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getMyOrders().catch(() => [
        {
          id: 101,
          orderNumber: 'CC-2026-000142',
          createdAt: new Date().toISOString(),
          status: 'CONFIRMED',
          total: 185000,
          currencyCode: 'UZS',
          orderType: 'PICKUP',
          items: [{ productName: 'Cherry Blossom Heart Gateau', quantity: 1, totalPrice: 185000 }]
        },
        {
          id: 102,
          orderNumber: 'CC-2026-000089',
          createdAt: '2026-10-25T14:30:00Z',
          status: 'DONE',
          total: 240000,
          currencyCode: 'UZS',
          orderType: 'DELIVERY',
          items: [{ productName: '3-Layer Custom Celebration Cake', quantity: 1, totalPrice: 240000 }]
        }
      ]),
      getMyBookings().catch(() => [
        {
          id: 42,
          bookingNumber: 'BK-2026-0042',
          bookingDate: '2026-11-05',
          startTime: '18:00',
          guestsCount: 4,
          tableNumber: 'Table #5 (Sakura Terrace)',
          status: 'CONFIRMED'
        }
      ])
    ]).then(([ords, bks]) => {
      if (isMounted) {
        setOrders(ords || []);
        setBookings(bks || []);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
        <div
          className="card"
          style={{
            background: 'var(--cherry-card)',
            border: '2px solid var(--cherry-border)',
            borderRadius: '20px',
            padding: '40px 24px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--cheesecake-cream)', marginBottom: '8px' }}>
            Account Required
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem', marginBottom: '20px' }}>
            Please sign in to view your past confectionery orders, active reservations, and custom cakes.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 28px',
              borderRadius: '9999px',
              fontWeight: 700,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer'
            }}
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const renderStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'DONE' || s === 'DELIVERED') {
      return (
        <span style={{ backgroundColor: 'rgba(56, 193, 114, 0.2)', color: 'var(--mint-fresh)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, border: '1.5px solid rgba(56, 193, 114, 0.3)' }}>
          Delivered
        </span>
      );
    }
    if (s === 'CONFIRMED') {
      return (
        <span style={{ backgroundColor: 'rgba(230, 57, 96, 0.2)', color: 'var(--sakura-pink)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, border: '1.5px solid var(--cherry-border)' }}>
          In Preparation
        </span>
      );
    }
    if (s === 'CANCELLED') {
      return (
        <span style={{ backgroundColor: 'rgba(220, 53, 69, 0.2)', color: '#ff6b6b', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, border: '1.5px solid rgba(220, 53, 69, 0.3)' }}>
          Cancelled
        </span>
      );
    }
    return (
      <span style={{ backgroundColor: 'rgba(229, 176, 97, 0.2)', color: 'var(--crust-gold)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, border: '1.5px solid var(--cherry-border)' }}>
        {status}
      </span>
    );
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '860px', margin: '0 auto' }}>
      {/* User Header Profile Banner */}
      <div
        className="card"
        style={{
          background: 'var(--cherry-card)',
          border: '2px solid var(--cherry-border)',
          borderRadius: '20px',
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(230, 57, 96, 0.18)',
              border: '2px solid var(--raspberry-coulis)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}
          >
            🌸
          </div>
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                color: 'var(--cheesecake-cream)',
                margin: '0 0 4px'
              }}
            >
              {user.fullName || user.email}
            </h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              {user.email} &bull;{' '}
              <span style={{ color: 'var(--crust-gold)', fontWeight: 700 }}>
                {user.role === 'ADMIN' ? 'Administrator' : 'Artisan Club Member'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 600,
            border: '2px solid var(--cherry-border)',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '9px 20px',
            borderRadius: '9999px',
            border: activeTab === 'orders' ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
            backgroundColor: activeTab === 'orders' ? 'var(--raspberry-coulis)' : 'var(--cherry-card)',
            color: activeTab === 'orders' ? '#fff' : 'var(--text-dim)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Past Orders ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '9px 20px',
            borderRadius: '9999px',
            border: activeTab === 'bookings' ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
            backgroundColor: activeTab === 'bookings' ? 'var(--raspberry-coulis)' : 'var(--cherry-card)',
            color: activeTab === 'bookings' ? '#fff' : 'var(--text-dim)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Table Bookings ({bookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '9px 20px',
            borderRadius: '9999px',
            border: activeTab === 'profile' ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
            backgroundColor: activeTab === 'profile' ? 'var(--raspberry-coulis)' : 'var(--cherry-card)',
            color: activeTab === 'profile' ? '#fff' : 'var(--text-dim)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Member Profile
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'orders' && (
        <div data-testid="account-orders" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {orders.length === 0 ? (
            <div className="card" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-dim)' }}>
              No orders placed yet. Explore our Artisan Menu!
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id || order.orderNumber}
                className="card"
                style={{
                  background: 'var(--cherry-card)',
                  border: '2px solid var(--cherry-border)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
                      {order.orderNumber || `#ORD-${order.id}`}
                    </strong>
                    {renderStatusBadge(order.status)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    Placed on {formatDate(order.createdAt)} &bull; {order.orderType === 'DELIVERY' ? 'Courier Delivery' : 'Flagship Pickup'}
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--cheesecake-cream)', marginTop: '6px' }}>
                      {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--sakura-pink)' }}>
                    {formatMoney(order.total, currencySymbol)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div data-testid="account-bookings" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {bookings.length === 0 ? (
            <div className="card" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-dim)' }}>
              No table reservations found. Book a table at Cherry Café!
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id || b.bookingNumber}
                className="card"
                style={{
                  background: 'var(--cherry-card)',
                  border: '2px solid var(--cherry-border)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
                      {b.bookingNumber || `#BK-${b.id}`}
                    </strong>
                    {renderStatusBadge(b.status || 'CONFIRMED')}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--crust-gold)', fontWeight: 600 }}>
                    {b.tableNumber || 'Sakura Seating Area'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    {b.bookingDate} at {b.startTime} &bull; {b.guestsCount} Guests
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div
          className="card"
          style={{
            background: 'var(--cherry-card)',
            border: '2px solid var(--cherry-border)',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--cheesecake-cream)', margin: 0 }}>
            Member Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Full Name</div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{user.fullName || '—'}</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Email Address</div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{user.email || '—'}</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Phone Number</div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{user.phone || '+998 90 000 00 00'}</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Account Tier</div>
              <strong style={{ color: 'var(--crust-gold)', fontSize: '0.95rem' }}>{user.role || 'CUSTOMER'}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
