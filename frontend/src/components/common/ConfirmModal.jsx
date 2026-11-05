import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Eliminar', loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#dc2626' }}>
          <AlertTriangle size={24} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>{title || '¿Confirmar eliminación?'}</h3>
        </div>
        <p style={{ color: '#475569', lineHeight: '1.5' }}>{message}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button
            className="btn-primary"
            style={{ backgroundColor: '#dc2626' }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
