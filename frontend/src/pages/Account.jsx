import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', textAlign: 'center' }}>
        <p>Пожалуйста, войдите в систему.</p>
        <Button variant="primary" onClick={() => navigate('/login')} style={{ marginTop: 'var(--space-3)' }}>
          Войти
        </Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: '600px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-5)' }}>
        Личный кабинет
      </h1>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          {user.fullName && (
            <div>
              <strong>Имя:</strong> {user.fullName}
            </div>
          )}
          <div>
            <strong>Роль:</strong> {user.role}
          </div>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          Выйти из аккаунта
        </Button>
      </Card>
    </div>
  );
}

export default Account;
