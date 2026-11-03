import React from 'react';

export function Loader({ size = 'md', fullscreen = false, label = 'Загрузка...' }) {
  const sizeMap = {
    sm: '24px',
    md: '40px',
    lg: '64px'
  };

  const spinner = (
    <div
      style={{
        width: sizeMap[size] || sizeMap.md,
        height: sizeMap[size] || sizeMap.md,
        border: '3px solid var(--color-border)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}
      aria-hidden="true"
    />
  );

  if (fullscreen) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={label}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-3)',
          zIndex: 1500
        }}
      >
        {spinner}
        <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--color-primary)' }}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-2)' }}
    >
      {spinner}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default Loader;
