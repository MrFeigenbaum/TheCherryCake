import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import { loginSuccess } from '../store/authSlice';
import { showToast } from '../store/uiSlice';
import { validateEmail, validateRequired, validatePhone } from '../utils/validators';

export function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const nameErr = validateRequired(formData.fullName, 'Full Name');
    if (nameErr) newErrors.fullName = 'Please enter your full name';

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = 'Please provide a valid email address';

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = 'Please provide a valid phone number';

    const passErr = validateRequired(formData.password, 'Password');
    if (passErr) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      dispatch(loginSuccess(res));
      dispatch(showToast({ type: 'success', message: 'Account created successfully! Welcome to Cherry Cake.' }));
      navigate('/');
    } catch {
      // client error handler handles toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '480px', margin: '0 auto' }}>
      <div
        className="card"
        style={{
          background: 'var(--cherry-card)',
          border: '2px solid var(--cherry-border)',
          borderRadius: '20px',
          padding: '36px 30px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/TransparentSakuraFlower.png"
            alt="Cherry Logo"
            style={{ width: '42px', height: '42px', margin: '0 auto 10px', display: 'block' }}
          />
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--sakura-pink)',
              fontWeight: 700,
              display: 'block',
              marginBottom: '4px'
            }}
          >
            Membership Portal
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem',
              color: 'var(--cheesecake-cream)',
              margin: '0 0 6px'
            }}
          >
            Create Your Account
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: 0 }}>
            Join Cherry Cake for fast ordering, table bookings, and bespoke cake creation.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Amelia Clark"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: errors.fullName ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-main)',
                fontSize: '0.92rem'
              }}
            />
            {errors.fullName && (
              <div style={{ color: 'var(--raspberry-coulis)', fontSize: '0.78rem', marginTop: '4px' }}>
                {errors.fullName}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: errors.email ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-main)',
                fontSize: '0.92rem'
              }}
            />
            {errors.email && (
              <div style={{ color: 'var(--raspberry-coulis)', fontSize: '0.78rem', marginTop: '4px' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+998 90 123 45 67"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: errors.phone ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-main)',
                fontSize: '0.92rem'
              }}
            />
            {errors.phone && (
              <div style={{ color: 'var(--raspberry-coulis)', fontSize: '0.78rem', marginTop: '4px' }}>
                {errors.phone}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: errors.password ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-main)',
                fontSize: '0.92rem'
              }}
            />
            {errors.password && (
              <div style={{ color: 'var(--raspberry-coulis)', fontSize: '0.78rem', marginTop: '4px' }}>
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.98rem',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 18px rgba(230, 57, 96, 0.45)',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '6px'
            }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-dim)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--sakura-pink)', fontWeight: 700, textDecoration: 'underline' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
