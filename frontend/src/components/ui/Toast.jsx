import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../store/uiSlice';

export function ToastItem({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  const bgMap = {
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    info: 'var(--color-primary)'
  };

  const isAlert = toast.type === 'error';

  return (
    <div
      role={isAlert ? 'alert' : 'status'}
      aria-live={isAlert ? 'assertive' : 'polite'}
      style={{
        backgroundColor: bgMap[toast.type] || bgMap.info,
        color: '#FFFFFF',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        minWidth: '280px',
        maxWidth: '400px',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 500,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={() => dispatch(removeToast(toast.id))}
        aria-label="Закрыть уведомление"
        style={{
          background: 'none',
          border: 'none',
          color: '#FFFFFF',
          fontSize: '18px',
          cursor: 'pointer',
          lineHeight: 1,
          padding: 'var(--space-1)'
        }}
      >
        &times;
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useSelector((state) => state.ui.toasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--space-4)',
        right: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        zIndex: 2000
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export default ToastContainer;
