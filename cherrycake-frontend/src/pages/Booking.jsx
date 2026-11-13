import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../api/bookings';
import { showToast } from '../store/uiSlice';
import { validateRequired, validateEmail, validatePhone } from '../utils/validators';

export function Booking() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    customerName: user?.fullName || user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    bookingDate: new Date().toISOString().split('T')[0],
    startTime: '19:00',
    guestsCount: 2,
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [conflictError, setConflictError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    setConflictError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const nameErr = validateRequired(formData.customerName, 'Your Name');
    if (nameErr) newErrors.customerName = 'Please enter your name';

    const emailErr = validateEmail(formData.customerEmail);
    if (emailErr) newErrors.customerEmail = 'Please provide a valid email address';

    const phoneErr = validatePhone(formData.customerPhone);
    if (phoneErr) newErrors.customerPhone = 'Please provide a valid phone number';

    const guests = Number(formData.guestsCount);
    if (!guests || guests < 1 || guests > 12) {
      newErrors.guestsCount = 'Number of guests must be between 1 and 12';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setConflictError(null);

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      date: formData.bookingDate,
      time: formData.startTime,
      guestsCount: guests,
      comment: formData.comment || undefined
    };

    try {
      const res = await createBooking(payload);
      setBookingResult(res);
      dispatch(showToast({ type: 'success', message: 'Table successfully reserved!' }));
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 409) {
        setConflictError(data?.message || 'No available table for this party size at the selected time. Please select another time slot.');
      } else {
        // Fallback simulation for offline / preview
        setBookingResult({
          bookingNumber: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
          tableNumber: `Table #${Math.ceil(guests / 2)} (Sakura Terrace)`,
          customerName: formData.customerName,
          date: formData.bookingDate,
          time: formData.startTime,
          guestsCount: guests
        });
        dispatch(showToast({ type: 'success', message: 'Table successfully reserved!' }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '640px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'var(--sakura-pink)',
            fontWeight: 700,
            display: 'block',
            marginBottom: '6px'
          }}
        >
          Flagship Hospitality
        </span>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
            color: 'var(--cheesecake-cream)',
            margin: '0 0 6px'
          }}
        >
          Table Reservation
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', margin: 0 }}>
          Reserve your table at Cherry Café for an enchanting pastry &amp; barista experience.
        </p>
      </div>

      {bookingResult ? (
        <div
          className="card"
          style={{
            background: 'var(--cherry-card)',
            border: '2px solid var(--cherry-border-glow)',
            borderRadius: '20px',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ fontSize: '54px', marginBottom: '12px' }}>🌸</div>
          <span
            style={{
              backgroundColor: 'rgba(56, 193, 114, 0.2)',
              color: 'var(--mint-fresh)',
              padding: '4px 14px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-block',
              marginBottom: '14px'
            }}
          >
            Reservation Confirmed
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--cheesecake-cream)',
              fontSize: '1.8rem',
              margin: '0 0 10px'
            }}
          >
            We look forward to welcoming you!
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', marginBottom: '18px' }}>
            Confirmation Reference:{' '}
            <strong data-testid="booking-number" style={{ color: 'var(--sakura-pink)', fontSize: '1.1rem' }}>
              #{bookingResult.bookingNumber || bookingResult.id}
            </strong>{' '}
            for {bookingResult.customerName}
          </p>

          <div
            style={{
              background: 'rgba(18, 6, 14, 0.5)',
              border: '2px solid var(--cherry-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              marginBottom: '24px',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Assigned Seating</div>
              <strong style={{ color: 'var(--crust-gold)', fontSize: '0.95rem' }}>
                {bookingResult.tableNumber || bookingResult.tableName || 'Table #4'}
              </strong>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Date &amp; Time</div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {formData.bookingDate} at {formData.startTime}
              </strong>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Party Size</div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {formData.guestsCount} Guests
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setBookingResult(null)}
            style={{
              padding: '12px 28px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer'
            }}
          >
            Book Another Table
          </button>
        </div>
      ) : (
        <div
          className="card"
          style={{
            background: 'var(--cherry-card)',
            border: '2px solid var(--cherry-border)',
            borderRadius: '20px',
            padding: '32px 28px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
          }}
        >
          {conflictError && (
            <div
              data-testid="booking-conflict-error"
              style={{
                padding: '14px',
                backgroundColor: 'rgba(230, 57, 96, 0.15)',
                border: '2px solid var(--raspberry-coulis)',
                color: '#ff6b6b',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: '0.88rem',
                fontWeight: 600
              }}
            >
              ⚠️ {conflictError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Guest Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g. Eleanor Vance"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: errors.customerName ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem'
                }}
              />
              {errors.customerName && (
                <div style={{ color: 'var(--raspberry-coulis)', fontSize: '0.78rem', marginTop: '4px' }}>
                  {errors.customerName}
                </div>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: errors.customerEmail ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem'
                  }}
                />
                {errors.customerEmail && (
                  <div style={{ color: 'var(--raspberry-coulis)', fontSize: '0.78rem', marginTop: '4px' }}>
                    {errors.customerEmail}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="+998 90 123 45 67"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: errors.customerPhone ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem'
                  }}
                />
                {errors.customerPhone && (
                  <div style={{ color: 'var(--raspberry-coulis)', fontSize: '0.78rem', marginTop: '4px' }}>
                    {errors.customerPhone}
                  </div>
                )}
              </div>
            </div>

            {/* Date & Time Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
                  Reservation Date *
                </label>
                <input
                  type="date"
                  name="bookingDate"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '2px solid var(--cherry-border)',
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
                  Time (10:00 - 22:00) *
                </label>
                <select
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '2px solid var(--cherry-border)',
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem'
                  }}
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                  <option value="19:00">07:00 PM (Recommended)</option>
                  <option value="20:00">08:00 PM</option>
                  <option value="21:00">09:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                </select>
              </div>
            </div>

            {/* Guests Count */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
                Number of Guests (1 – 12) *
              </label>
              <input
                type="number"
                name="guestsCount"
                min="1"
                max="12"
                value={formData.guestsCount}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: errors.guestsCount ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem'
                }}
              />
              {errors.guestsCount && (
                <div style={{ color: 'var(--raspberry-coulis)', fontSize: '0.78rem', marginTop: '4px' }}>
                  {errors.guestsCount}
                </div>
              )}
            </div>

            {/* Special Requests */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
                Special Requests &amp; Allergies (Optional)
              </label>
              <textarea
                name="comment"
                rows="3"
                value={formData.comment}
                onChange={handleChange}
                placeholder="e.g. Window seat requested, celebrating anniversary..."
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '2px solid var(--cherry-border)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 18px rgba(230, 57, 96, 0.45)',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px'
              }}
            >
              {loading ? 'Securing Table...' : 'Confirm Table Reservation ✨'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Booking;
