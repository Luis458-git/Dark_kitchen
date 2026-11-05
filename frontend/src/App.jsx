import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarcasPage from './pages/MarcasPage';
import PlatillosPage from './pages/PlatillosPage';
import DespachoPage from './pages/DespachoPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas Protegidas bajo JWT */}
          <Route
            path="/marcas"
            element={
              <ProtectedRoute>
                <MarcasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/platillos"
            element={
              <ProtectedRoute>
                <PlatillosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <DespachoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/despacho"
            element={
              <ProtectedRoute>
                <DespachoPage />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/marcas" replace />} />
          <Route path="*" element={<Navigate to="/marcas" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
