import React from 'react';
import Button from './Button';

export function EmptyState({
  icon = '🍰',
  title = 'Ничего не найдено',
  text = 'По вашему запросу нет данных.',
  actionText,
  onAction
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-7) var(--space-4)',
        gap: 'var(--space-3)'
      }}
    >
      <div style={{ fontSize: '48px', lineHeight: 1 }}>{icon}</div>
      <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', fontSize: 'var(--font-size-sm)' }}>
        {text}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} style={{ marginTop: 'var(--space-2)' }}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  icon = '⚠️',
  title = 'Произошла ошибка',
  text = 'Не удалось загрузить данные. Попробуйте обновить страницу.',
  actionText = 'Повторить попытку',
  onAction
}) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-7) var(--space-4)',
        gap: 'var(--space-3)'
      }}
    >
      <div style={{ fontSize: '48px', lineHeight: 1 }}>{icon}</div>
      <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-error)', fontFamily: 'var(--font-serif)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', fontSize: 'var(--font-size-sm)' }}>
        {text}
      </p>
      {actionText && onAction && (
        <Button variant="secondary" onClick={onAction} style={{ marginTop: 'var(--space-2)' }}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
