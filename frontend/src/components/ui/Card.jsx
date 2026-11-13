import React from 'react';

export function Card({
  children,
  onClick,
  disabled = false,
  className = '',
  style = {},
  ...props
}) {
  const isClickable = Boolean(onClick) && !disabled;

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
      className={`cc-card ${className}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: isClickable ? 'pointer' : 'default',
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;