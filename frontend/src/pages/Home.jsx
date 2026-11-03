import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export function Home() {
  return (
    <div className="container" style={{ padding: 'var(--space-7) var(--space-4)', textAlign: 'center' }}>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--font-size-2xl)',
          color: 'var(--color-primary)',
          marginBottom: 'var(--space-3)'
        }}
      >
        Добро пожаловать в Cherry Cake
      </h1>
      <p
        style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-muted)',
          maxWidth: '600px',
          margin: '0 auto var(--space-6)'
        }}
      >
        Ремесленная кондитерская с изысканными десертами, бронированием столиков и доставкой по всей стране.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
        <Link to="/menu">
          <Button variant="primary" size="lg">
            Перейти в меню
          </Button>
        </Link>
        <Link to="/ui-kit">
          <Button variant="secondary" size="lg">
            Витрина UI-кита
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
