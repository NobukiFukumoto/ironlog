import React from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel, confirmText, cancelText, isDanger }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-content">
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button className="btn-secondary" onClick={onCancel}>{cancelText}</button>
          <button className={isDanger ? "btn-danger" : "btn-primary"} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
