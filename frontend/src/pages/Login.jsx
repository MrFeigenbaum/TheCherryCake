import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { loginSuccess } from '../store/authSlice';
import { showToast } from '../store/uiSlice';
import { validateEmail, validateRequired } from '../utils/validators';

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleQuickFill = (email, password) => {
    setFormData({ email, password });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = 'Please provide a valid email address';

    const passErr = validateRequired(formData.password, 'Password');
    if (passErr) newErrors.password = 'Please enter your password';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await login(formData);
      dispatch(loginSuccess(res));
      dispatch(showToast({ type: 'success', message: 'Welcome back! Successfully signed in.' }));
      navigate(res.user?.role === 'ADMIN' ? '/admin/catalog' : '/');
    } catch {
      // client error handler handles toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '460px', margin: '0 auto' }}>
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
            Client Authentication
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem',
              color: 'var(--cheesecake-cream)',
              margin: '0 0 6px'
            }}
          >
            Sign In / Account
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: 0 }}>
            Access order tracking, table bookings, and bespoke cake orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cheesecake-cream)', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. customer@cherrycake.com"
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
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
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
            {loading ? 'Authenticating...' : 'Sign In to Account'}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--cherry-border)' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', textAlign: 'center', marginBottom: '10px', fontWeight: 700 }}>
            Quick Demo Credentials
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('customer@cherrycake.com', 'cherry123')}
              style={{
                background: 'rgba(255, 183, 197, 0.08)',
                border: '1.5px dashed var(--cherry-border)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <span>Customer: <strong>customer@cherrycake.com</strong></span>
              <span style={{ color: 'var(--sakura-pink)' }}>Fill &rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@cherrycake.com', 'cherryAdmin2026')}
              style={{
                background: 'rgba(255, 183, 197, 0.08)',
                border: '1.5px dashed var(--cherry-border)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <span>Admin: <strong>admin@cherrycake.com</strong></span>
              <span style={{ color: 'var(--crust-gold)' }}>Fill &rarr;</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-dim)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--sakura-pink)', fontWeight: 700, textDecoration: 'underline' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
