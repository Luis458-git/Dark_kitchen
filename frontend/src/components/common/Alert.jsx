import React from 'react';

const Alert = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'inherit' }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
