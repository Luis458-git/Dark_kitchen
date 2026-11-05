import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, LogIn } from 'lucide-react';
import Alert from '../components/common/Alert';

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(correo, password);
      navigate('/marcas');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al iniciar sesión. Compruebe sus credenciales.';
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
          <h2 className="auth-title">DarkKitchen Hub</h2>
          <p className="auth-subtitle">Ingrese sus credenciales de acceso</p>
        </div>

        <Alert type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@darkkitchen.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            disabled={loading}
          >
            <LogIn size={18} />
            <span>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
          ¿No tienes una cuenta?{' '}
          <Link to="/register" style={{ color: '#ea580c', fontWeight: '600' }}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
