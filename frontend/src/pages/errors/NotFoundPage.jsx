import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, ArrowLeft, Home, Compass, Activity, Search } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-noir-950 text-brand-primary flex flex-col justify-between relative overflow-hidden select-none">
      {/* Luces y ambientación dorada sutil de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-gold-400/10 via-gold-400/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Barra superior con identidad Atelier Noir */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-noir-800/80 bg-noir-950/70 backdrop-blur-md">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 shadow-gold-glow group-hover:scale-105 group-hover:border-gold-400 transition-all duration-200">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-base font-bold tracking-wide text-brand-primary group-hover:text-gold-400 transition-colors">
              DarkKitchen Hub
            </span>
            <span className="block text-[9px] font-mono uppercase tracking-widest text-gold-400">
              Atelier Noir Diagnostics
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-300">
            HTTP 404 • Resource Not Found
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
        {/* Código de Estado Imponente */}
        <div className="relative inline-block mb-4">
          <div className="text-[120px] sm:text-[160px] font-serif font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gold-300 via-gold-400 to-amber-600/40 select-none drop-shadow-[0_10px_30px_rgba(229,193,88,0.15)]">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full border border-gold-400/20 bg-noir-900/40 backdrop-blur-sm flex items-center justify-center text-gold-400/80 shadow-inner">
              <Search className="w-10 h-10 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Título y Descripción Gastronómica */}
        <div className="space-y-3 mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-primary tracking-tight">
            Platillo o Estación No Encontrada
          </h1>
          <p className="text-sm text-brand-secondary max-w-md mx-auto leading-relaxed">
            La ruta culinaria, receta secreta o mesa de despacho solicitada no existe en este nodo o ha sido retirada del menú de producción.
          </p>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-brand-primary bg-noir-850 hover:bg-noir-800 border border-noir-700 hover:border-gold-400/40 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-gold-400" />
            <span>Volver a Estación Previa</span>
          </button>

          <Link
            to="/pedidos"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold text-noir-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-gold-glow transition-all duration-200 active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Consola de Despacho</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-brand-secondary hover:text-gold-400 bg-transparent hover:bg-noir-900 border border-transparent hover:border-noir-700 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span>Portal Atelier</span>
          </Link>
        </div>

        {/* Sugerencias de Navegación Rápida */}
        <div className="mt-12 pt-8 border-t border-noir-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <Link
            to="/marcas"
            className="p-3 rounded-lg bg-noir-900/60 border border-noir-800 hover:border-gold-400/30 transition-all group"
          >
            <span className="text-[10px] font-mono uppercase text-gold-400 block mb-1">Satélites</span>
            <span className="text-xs font-medium text-brand-primary group-hover:text-gold-300 block truncate">Marcas Satélite &rarr;</span>
          </Link>
          <Link
            to="/platillos"
            className="p-3 rounded-lg bg-noir-900/60 border border-noir-800 hover:border-gold-400/30 transition-all group"
          >
            <span className="text-[10px] font-mono uppercase text-gold-400 block mb-1">Recetario</span>
            <span className="text-xs font-medium text-brand-primary group-hover:text-gold-300 block truncate">Recetas & Menú &rarr;</span>
          </Link>
          <Link
            to="/kds"
            className="p-3 rounded-lg bg-noir-900/60 border border-noir-800 hover:border-gold-400/30 transition-all group"
          >
            <span className="text-[10px] font-mono uppercase text-gold-400 block mb-1">Cocina</span>
            <span className="text-xs font-medium text-brand-primary group-hover:text-gold-300 block truncate">Monitor KDS &rarr;</span>
          </Link>
          <Link
            to="/status"
            className="p-3 rounded-lg bg-noir-900/60 border border-noir-800 hover:border-gold-400/30 transition-all group"
          >
            <span className="text-[10px] font-mono uppercase text-gold-400 block mb-1">Diagnóstico</span>
            <span className="text-xs font-medium text-brand-primary group-hover:text-gold-300 block truncate">Códigos 200-500 &rarr;</span>
          </Link>
        </div>
      </main>

      {/* Pie de página discreto */}
      <footer className="relative z-10 px-8 py-4 border-t border-noir-800/80 bg-noir-950/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-brand-muted">
        <span>DarkKitchen Hub Protocol • Error Code RFC 7231</span>
        <span className="mt-1 sm:mt-0">Nodo Operativo Seguro • Atelier Noir</span>
      </footer>
    </div>
  );
};

export default NotFoundPage;
