import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import { loginSuccess } from '../store/authSlice';
import { showToast } from '../store/uiSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
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

    const nameErr = validateRequired(formData.fullName, 'Имя');
    if (nameErr) newErrors.fullName = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const passErr = validateRequired(formData.password, 'Пароль');
    if (passErr) newErrors.password = passErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      dispatch(loginSuccess(res));
      dispatch(showToast({ type: 'success', message: 'Регистрация прошла успешно!' }));
      navigate('/');
    } catch {
      // api/client handles toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '440px' }}>
      <Card>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: 'var(--font-size-xl)', textAlign: 'center', marginBottom: 'var(--space-5)' }}>
          Регистрация
        </h1>
        <form onSubmit={handleSubmit}>
          <Input label="Полное имя" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} required />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
          <Input label="Телефон" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} required />
          <Input label="Пароль" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} required />
          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: 'var(--space-3)' }}>
            Создать аккаунт
          </Button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Уже есть аккаунт?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Войти
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Register;
