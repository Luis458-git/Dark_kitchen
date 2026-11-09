import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, RotateCw, Home, Terminal, ChevronDown, ChevronUp, Activity, HelpCircle } from 'lucide-react';

const ServerErrorPage = ({ error, resetErrorBoundary }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-noir-950 text-brand-primary flex flex-col justify-between relative overflow-hidden select-none">
      {/* Resplandor rojo fuego carmesí */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-rose-600/15 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-noir-800/80 bg-noir-950/70 backdrop-blur-md">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-all duration-200">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-base font-bold tracking-wide text-brand-primary group-hover:text-gold-400 transition-colors">
              DarkKitchen Hub
            </span>
            <span className="block text-[9px] font-mono uppercase tracking-widest text-rose-400">
              Incidente de Servidor
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider bg-rose-500/10 border border-rose-500/30 text-rose-300">
            HTTP 500 • Internal Server Error
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
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 text-center my-auto">
        {/* Código 500 */}
        <div className="relative inline-block mb-4">
          <div className="text-[120px] sm:text-[160px] font-serif font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-rose-200 via-rose-500 to-amber-700/40 select-none drop-shadow-[0_10px_30px_rgba(244,63,94,0.2)]">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full border border-rose-500/30 bg-noir-900/60 backdrop-blur-sm flex items-center justify-center text-rose-400 shadow-inner">
              <AlertOctagon className="w-10 h-10 stroke-[1.5] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <div className="space-y-3 mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-primary tracking-tight">
            Interrupción Crítica en Estación de Cocina
          </h1>
          <p className="text-sm text-brand-secondary max-w-md mx-auto leading-relaxed">
            El clúster central encontró una anomalía imprevista durante la preparación del servicio. Los sensores de telemetría han notificado al soporte técnico.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            onClick={handleReload}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold text-noir-950 bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-gold-400 shadow-gold-glow transition-all duration-200 active:scale-95"
          >
            <RotateCw className="w-4 h-4" />
            <span>Reintentar Operación</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-brand-primary bg-noir-850 hover:bg-noir-800 border border-noir-700 hover:border-gold-400/40 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <Home className="w-4 h-4 text-gold-400" />
            <span>Ir al Portal</span>
          </Link>

          <Link
            to="/status"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-brand-secondary hover:text-gold-400 bg-transparent hover:bg-noir-900 border border-transparent hover:border-noir-700 transition-all duration-200"
          >
            <Activity className="w-4 h-4" />
            <span>Ver Telemetría</span>
          </Link>
        </div>

        {/* Detalle Técnico Opcional */}
        {(error || showDetails) && (
          <div className="mt-6 text-left max-w-lg mx-auto">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-noir-900 border border-noir-800 text-xs font-mono text-brand-secondary hover:text-gold-400 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-gold-400" />
                <span>Registro Técnico del Incidente (Stack Trace)</span>
              </span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDetails && (
              <div className="mt-2 p-3 rounded-lg bg-noir-900/90 border border-noir-800 font-mono text-[11px] text-rose-300/90 overflow-x-auto max-h-48 scrollbar-thin">
                <p className="font-semibold text-rose-400 mb-1">
                  {error?.name || 'ServerError'}: {error?.message || 'Excepción no controlada durante el renderizado'}
                </p>
                {error?.stack && (
                  <pre className="text-[10px] text-brand-muted whitespace-pre-wrap leading-tight">
                    {error.stack}
                  </pre>
                )}
                {!error?.stack && (
                  <p className="text-[10px] text-brand-muted">
                    Incidente capturado en gateway HTTP DarkKitchen Hub. Consulte el log central en Node.js.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 border-t border-noir-800/80 bg-noir-950/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-brand-muted">
        <span>DarkKitchen Hub Resilience Engine • RFC 7231 §6.6.1</span>
        <span className="mt-1 sm:mt-0">Node.js Express + MySQL Pool Recovery</span>
      </footer>
    </div>
  );
};

export default ServerErrorPage;
