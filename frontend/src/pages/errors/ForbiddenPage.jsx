import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound, Lock, Home, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen bg-noir-950 text-brand-primary flex flex-col justify-between relative overflow-hidden select-none">
      {/* Resplandor carmesí y oro profundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-rose-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-noir-800/80 bg-noir-950/70 backdrop-blur-md">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-all duration-200">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-base font-bold tracking-wide text-brand-primary group-hover:text-gold-400 transition-colors">
              DarkKitchen Hub
            </span>
            <span className="block text-[9px] font-mono uppercase tracking-widest text-rose-400">
              Control de Acceso B2B
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider bg-rose-500/10 border border-rose-500/30 text-rose-300">
            HTTP 403 • Forbidden
          </span>
          <Link
            to="/status"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-brand-secondary hover:text-gold-400 bg-noir-850 hover:bg-noir-800 border border-noir-700 transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-gold-400" />
            <span>Consola HTTP</span>
          </Link>
        </div>
      </header>

      {/* Contenido Central */}
      <main className="relative z-10 max-w-xl mx-auto px-6 py-12 text-center my-auto">
        {/* Código 403 */}
        <div className="relative inline-block mb-4">
          <div className="text-[120px] sm:text-[160px] font-serif font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-rose-300 via-amber-400 to-rose-700/40 select-none drop-shadow-[0_10px_30px_rgba(244,63,94,0.15)]">
            403
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full border border-rose-500/30 bg-noir-900/60 backdrop-blur-sm flex items-center justify-center text-rose-400 shadow-inner">
              <ShieldAlert className="w-10 h-10 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <div className="space-y-3 mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-primary tracking-tight">
            Acceso a Bóveda Culinaria Denegado
          </h1>
          <p className="text-sm text-brand-secondary max-w-md mx-auto leading-relaxed">
            Tu perfil operativo ({usuario?.rol || 'Operador Estándar'}) no posee los privilegios de nivel Chef Ejecutivo Maestro para acceder a esta consola confidencial.
          </p>
        </div>

        {/* Bloque Informativo de Sesión */}
        <div className="mb-8 p-4 rounded-xl bg-noir-900/80 border border-noir-800 text-left max-w-md mx-auto space-y-2 text-xs font-mono">
          <div className="flex justify-between text-brand-muted">
            <span>Usuario autenticado:</span>
            <span className="text-brand-primary font-semibold">{usuario?.nombre || 'Chef Anónimo'}</span>
          </div>
          <div className="flex justify-between text-brand-muted">
            <span>Credencial activa:</span>
            <span className="text-gold-400">{usuario?.correo || 'Sin sesión activa'}</span>
          </div>
          <div className="flex justify-between text-brand-muted">
            <span>Bóveda solicitada:</span>
            <span className="text-rose-400">Nivel Restringido (Root Kitchen)</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-brand-primary bg-noir-850 hover:bg-noir-800 border border-noir-700 hover:border-gold-400/40 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-gold-400" />
            <span>Volver Atrás</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold text-noir-950 bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-gold-400 shadow-gold-glow transition-all duration-200 active:scale-95"
          >
            <KeyRound className="w-4 h-4" />
            <span>Cambiar de Cuenta</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-brand-secondary hover:text-gold-400 bg-transparent hover:bg-noir-900 border border-transparent hover:border-noir-700 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span>Portal Atelier</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 border-t border-noir-800/80 bg-noir-950/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-brand-muted">
        <span>DarkKitchen Hub Access Control • RFC 7231 §6.5.3</span>
        <span className="mt-1 sm:mt-0">Autenticación por Tokens Criptográficos JWT</span>
      </footer>
    </div>
  );
};

export default ForbiddenPage;
