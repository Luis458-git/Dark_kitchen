import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Clock, RefreshCw, Home, Activity, CheckCircle2 } from 'lucide-react';

const MaintenancePage = () => {
  const [checking, setChecking] = useState(false);
  const [online, setOnline] = useState(false);
  const [countdown, setCountdown] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 180));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/status/200');
      if (res.ok) {
        setOnline(true);
      }
    } catch {
      setOnline(false);
    } finally {
      setTimeout(() => setChecking(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-noir-950 text-brand-primary flex flex-col justify-between relative overflow-hidden select-none">
      {/* Resplandor dorado ámbar suave */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/10 via-gold-400/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-noir-800/80 bg-noir-950/70 backdrop-blur-md">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-all duration-200">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-base font-bold tracking-wide text-brand-primary group-hover:text-gold-400 transition-colors">
              DarkKitchen Hub
            </span>
            <span className="block text-[9px] font-mono uppercase tracking-widest text-amber-400">
              Mantenimiento Preventivo
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-300">
            HTTP 503 • Service Unavailable
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
        {/* Código 503 */}
        <div className="relative inline-block mb-4">
          <div className="text-[120px] sm:text-[160px] font-serif font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700/40 select-none drop-shadow-[0_10px_30px_rgba(245,158,11,0.15)]">
            503
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full border border-amber-500/30 bg-noir-900/60 backdrop-blur-sm flex items-center justify-center text-amber-400 shadow-inner">
              <Wrench className="w-10 h-10 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <div className="space-y-3 mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-primary tracking-tight">
            Cocina en Calibración & Sanitización
          </h1>
          <p className="text-sm text-brand-secondary max-w-md mx-auto leading-relaxed">
            Las estaciones de cocción, hornos convectores y extractores están en ciclo de mantenimiento programado para garantizar la máxima excelencia operativa.
          </p>
        </div>

        {/* Contador y Estado */}
        <div className="mb-8 p-4 rounded-xl bg-noir-900/80 border border-noir-800 text-left max-w-md mx-auto space-y-3 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-brand-muted flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span>Reanudación de servicio estimada:</span>
            </span>
            <span className="text-gold-400 font-bold tabular-nums text-sm">
              {formatCountdown(countdown)}
            </span>
          </div>

          <div className="w-full bg-noir-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-gold-400 to-amber-500 h-full transition-all duration-1000"
              style={{ width: `${((180 - countdown) / 180) * 100}%` }}
            />
          </div>

          {online ? (
            <div className="flex items-center space-x-2 text-emerald-400 pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Nodo listo para reconexión. Puede ingresar nuevamente.</span>
            </div>
          ) : (
            <div className="text-[11px] text-brand-muted pt-1 flex justify-between items-center">
              <span>Protocolo: Mantenimiento Nocturno N-8</span>
              <span className="text-amber-400">En Curso</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={checkStatus}
            disabled={checking}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold text-noir-950 bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-gold-400 shadow-gold-glow transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Comprobando...' : 'Comprobar Disponibilidad'}</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-brand-primary bg-noir-850 hover:bg-noir-800 border border-noir-700 hover:border-gold-400/40 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <Home className="w-4 h-4 text-gold-400" />
            <span>Portal Atelier</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 border-t border-noir-800/80 bg-noir-950/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-brand-muted">
        <span>DarkKitchen Hub Infrastructure SLA • RFC 7231 §6.6.4</span>
        <span className="mt-1 sm:mt-0">Monitoreo Automatizado de Clúster de Cocinas</span>
      </footer>
    </div>
  );
};

export default MaintenancePage;
