import React, { useEffect, useRef } from 'react';

export function Modal({
  open = false,
  onClose,
  title,
  children,
  className = ''
}) {
  const modalRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      previouslyFocusedElementRef.current = document.activeElement;
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else if (previouslyFocusedElementRef.current) {
      previouslyFocusedElementRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-4)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`cc-modal ${className}`}
        style={{
          backgroundColor: 'var(--cherry-card)',
          border: '1px solid var(--cherry-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-5)',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          outline: 'none',
          position: 'relative',
          color: 'var(--color-text)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          {title && (
            <h2 id="modal-title" style={{ fontSize: 'var(--font-size-xl)', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть модальное окно"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              lineHeight: 1,
              color: 'var(--color-text-muted)',
              minHeight: 'var(--touch-target)',
              minWidth: 'var(--touch-target)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;