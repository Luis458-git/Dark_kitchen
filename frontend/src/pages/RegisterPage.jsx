import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, UserPlus } from 'lucide-react';
import Alert from '../components/common/Alert';

const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(nombre, correo, password);
      // Auto-login tras registro exitoso
      await login(correo, password);
      navigate('/marcas');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.mensaje || 'Error al registrar usuario';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: '#fff7ed', borderRadius: '50%', color: '#ea580c', marginBottom: '0.5rem' }}>
            <UtensilsCrossed size={32} />
          </div>
          <h2 className="auth-title">Crear Cuenta</h2>
          <p className="auth-subtitle">DarkKitchen Hub — Acceso Operativo</p>
        </div>

        <Alert type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Nombre Completo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Chef Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="juan@darkkitchen.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Contraseña (mínimo 8 caracteres)</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creando cuenta...' : 'Registrar e Iniciar'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={{ color: '#ea580c', fontWeight: '600' }}>
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
