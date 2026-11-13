import React from 'react';

export function Badge({ children, variant = 'primary', count, className = '' }) {
  const bgMap = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-accent)',
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    warning: 'var(--color-warning)'
  };

  const colorMap = {
    secondary: 'var(--color-primary)'
  };

  return (
    <span
      className={`cc-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: count !== undefined ? '2px 8px' : '4px 10px',
        borderRadius: '12px',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 700,
        backgroundColor: bgMap[variant] || bgMap.primary,
        color: colorMap[variant] || '#FFFFFF',
        lineHeight: 1.2
      }}
    >
      {count !== undefined ? count : children}
    </span>
  );
}

export default Badge;