import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import AtelierPage from './pages/AtelierPage';
import LoginPage from './pages/LoginPage';
import DespachoPage from './pages/DespachoPage';
import KdsPage from './pages/KdsPage';
import MarcasPage from './pages/MarcasPage';
import PlatillosPage from './pages/PlatillosPage';
import AiAgentsPage from './pages/AiAgentsPage';
import StatusCodesPage from './pages/StatusCodesPage';

// Páginas de Error Visual Atelier Noir
import NotFoundPage from './pages/errors/NotFoundPage';
import ForbiddenPage from './pages/errors/ForbiddenPage';
import ServerErrorPage from './pages/errors/ServerErrorPage';
import MaintenancePage from './pages/errors/MaintenancePage';

function App() {
  return (
    <ErrorBoundary>
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
            <Route
              path="/status"
              element={
                <ProtectedRoute>
                  <StatusCodesPage />
                </ProtectedRoute>
              }
            />

            {/* Páginas de Error & Diagnóstico HTTP Dedicadas */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="/503" element={<MaintenancePage />} />

            {/* Redirecciones de conveniencia y Wildcard 404 */}
            <Route path="/despacho" element={<Navigate to="/pedidos" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
