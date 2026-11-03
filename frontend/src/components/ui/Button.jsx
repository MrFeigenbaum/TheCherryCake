import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
  className = '',
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid transparent',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s ease',
    minHeight: 'var(--touch-target)',
    minWidth: 'var(--touch-target)',
    textDecoration: 'none'
  };

  const sizeStyles = {
    sm: { padding: 'var(--space-1) var(--space-3)', fontSize: 'var(--font-size-sm)' },
    md: { padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--font-size-md)' },
    lg: { padding: 'var(--space-3) var(--space-6)', fontSize: 'var(--font-size-lg)' }
  }[size] || {};

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#FFFFFF',
      borderColor: 'var(--color-primary)'
    },
    secondary: {
      backgroundColor: 'var(--color-accent)',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-border)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text)',
      borderColor: 'var(--color-border)'
    }
  }[variant] || {};

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
      aria-label={ariaLabel}
      aria-busy={loading ? 'true' : undefined}
      className={`cc-btn cc-btn--${variant} ${className}`}
      style={{
        ...baseStyles,
        ...sizeStyles,
        ...variantStyles
      }}
      {...props}
    >
      {loading && (
        <span
          style={{
            display: 'inline-block',
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite'
          }}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </button>
  );
}

export default Button;
