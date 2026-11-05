import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          setUsuario(res.data.data);
          localStorage.setItem('usuario', JSON.stringify(res.data.data));
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          setUsuario(null);
          setToken(null);
        }
      }
      setCargando(false);
    };

    verificarSesion();
  }, []);

  const login = async (correo, password) => {
    const res = await apiClient.post('/auth/login', { correo, password });
    const { token: nuevoToken, usuario: nuevoUsuario } = res.data;
    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
    setToken(nuevoToken);
    setUsuario(nuevoUsuario);
    return nuevoUsuario;
  };

  const register = async (nombre, correo, password) => {
    const res = await apiClient.post('/auth/register', { nombre, correo, password });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated: !!token,
        cargando,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
