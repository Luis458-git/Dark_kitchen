import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AtelierPage from './pages/AtelierPage';
import LoginPage from './pages/LoginPage';
import DespachoPage from './pages/DespachoPage';
import KdsPage from './pages/KdsPage';
import MarcasPage from './pages/MarcasPage';
import PlatillosPage from './pages/PlatillosPage';
import AiAgentsPage from './pages/AiAgentsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing Editorial Front-Facing */}
          <Route path="/" element={<AtelierPage />} />

          {/* Autenticación Luxe Gateway */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />

          {/* Rutas Operativas Protegidas por JWT */}
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <DespachoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kds"
            element={
              <ProtectedRoute>
                <KdsPage />
              </ProtectedRoute>
            }
          />
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
            path="/ai"
            element={
              <ProtectedRoute>
                <AiAgentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-agent"
            element={
              <ProtectedRoute>
                <AiAgentsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirecciones de conveniencia */}
          <Route path="/despacho" element={<Navigate to="/pedidos" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
