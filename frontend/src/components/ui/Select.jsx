import React, { useId } from 'react';

export function Select({
  label,
  value,
  onChange,
  options = [],
  error,
  hint,
  required = false,
  disabled = false,
  id: customId,
  name,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const id = customId || generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const ariaDescribedBy = [
    hint ? hintId : null,
    error ? errorId : null
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }} className={className}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: error ? 'var(--color-error)' : 'var(--color-text)'
          }}
        >
          {label} {required && <span aria-hidden="true" style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={ariaDescribedBy}
        style={{
          minHeight: 'var(--touch-target)',
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 'var(--font-size-md)',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          backgroundColor: disabled ? '#F3F4F6' : '#FFFFFF',
          color: disabled ? 'var(--color-text-muted)' : 'var(--color-text)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        {...props}
      >
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {hint && !error && (
        <span id={hintId} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} role="alert" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default Select;
