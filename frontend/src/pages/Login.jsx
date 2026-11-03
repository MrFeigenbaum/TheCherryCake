import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { loginSuccess } from '../store/authSlice';
import { showToast } from '../store/uiSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validateRequired(formData.password, 'Пароль');
    if (passErr) newErrors.password = passErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await login(formData);
      dispatch(loginSuccess(res));
      dispatch(showToast({ type: 'success', message: 'Успешный вход в систему!' }));
      navigate(res.user?.role === 'ADMIN' ? '/admin/catalog' : '/');
    } catch {
      // api/client handles toast automatically
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '440px' }}>
      <Card>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: 'var(--font-size-xl)', textAlign: 'center', marginBottom: 'var(--space-5)' }}>
          Вход в аккаунт
        </h1>
        <form onSubmit={handleSubmit}>
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
          <Input label="Пароль" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} required />
          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: 'var(--space-3)' }}>
            Войти
          </Button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Нет аккаунта?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Зарегистрироваться
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Login;
