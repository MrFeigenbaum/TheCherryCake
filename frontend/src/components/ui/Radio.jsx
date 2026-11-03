import React, { useId } from 'react';

export function Radio({
  label,
  value,
  checked,
  onChange,
  disabled = false,
  id: customId,
  name,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        minHeight: 'var(--touch-target)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
        fontSize: 'var(--font-size-md)'
      }}
      className={className}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: '20px',
          height: '20px',
          accentColor: 'var(--color-primary)',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

export function RadioGroup({ label, children, name, className = '' }) {
  return (
    <fieldset
      role="radiogroup"
      style={{
        border: 'none',
        padding: 0,
        margin: '0 0 var(--space-3) 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)'
      }}
      className={className}
    >
      {label && (
        <legend style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
          {label}
        </legend>
      )}
      {children}
    </fieldset>
  );
}

export default Radio;
