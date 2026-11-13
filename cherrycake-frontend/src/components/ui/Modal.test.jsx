import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from './Modal';

describe('Modal Component (CC-12)', () => {
  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Тест">
        Контент
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders with title and content when open, has role="dialog" and aria-modal="true"', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Модальное окно">
        <div>Содержимое модалки</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Модальное окно')).toBeInTheDocument();
    expect(screen.getByText('Содержимое модалки')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Заголовок">
        Контент
      </Modal>
    );

    const closeBtn = screen.getByLabelText(/Закрыть модальное окно/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key press', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Заголовок">
        Контент
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});