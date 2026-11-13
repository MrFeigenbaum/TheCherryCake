import React, { useId } from 'react';

export function Checkbox({
  label,
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
        type="checkbox"
        id={id}
        name={name}
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

export default Checkbox;