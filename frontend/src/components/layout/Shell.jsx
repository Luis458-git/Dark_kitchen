import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Flame,
  LayoutGrid,
  ClipboardList,
  Store,
  ChefHat,
  MonitorPlay,
  LogOut,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Cpu
} from 'lucide-react';

const Shell = ({ children, title = "Consola Operativa", subtitle = "Gestor de Cocinas Ocultas & Despacho" }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { to: '/', label: 'DarkKitchen Hub', icon: Sparkles, badge: 'Portal' },
    { to: '/pedidos', label: 'Consola de Despacho', icon: ClipboardList, badge: 'Live' },
    { to: '/kds', label: 'Monitor KDS Cocina', icon: MonitorPlay, badge: 'KDS' },
    { to: '/marcas', label: 'Marcas Satélite', icon: Store },
    { to: '/platillos', label: 'Recetas & Menú', icon: ChefHat },
    { to: '/ai', label: 'Copiloto Multi-Agente', icon: Cpu, badge: 'IA' }
  ];

  return (
    <div className="flex h-screen bg-noir-950 text-brand-primary overflow-hidden">
      {/* Sidebar Persistente Izquierdo Colapsable */}
      <aside
        className={`relative ${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-noir-900 border-r border-noir-700/60 flex flex-col justify-between shrink-0 select-none transition-all duration-300 ease-in-out`}
      >
        {/* Botón Discreto de Colapsar / Expandir Sidebar */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 z-30 w-6 h-6 rounded-full bg-noir-850 border border-noir-700 text-brand-muted hover:text-gold-400 hover:border-gold-400/50 flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90"
          title={isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          aria-label="Colapsar o expandir barra lateral"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-noir-700/60 flex items-center justify-between">
            <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400/20 to-noir-800 border border-gold-400/40 flex items-center justify-center text-gold-400 shadow-gold-glow shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden transition-opacity duration-200">
                  <h1 className="font-serif text-lg font-bold tracking-wide text-brand-primary truncate">DarkKitchen Hub</h1>
                  <p className="text-[10px] tracking-widest uppercase font-mono text-gold-400 truncate">Cocinas Ocultas & Despacho</p>
                </div>
              )}
            </div>
          </div>

          {/* Estado de Telemetría */}
          <div className="mx-3 my-4 p-2.5 rounded-lg bg-noir-800/80 border border-noir-700/50 flex items-center justify-between text-xs font-mono">
            <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-2'}`} title="Nodo Operativo B2B LATAM">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              {!isCollapsed && <span className="text-brand-secondary truncate">Nodo Operativo</span>}
            </div>
            {!isCollapsed && <span className="text-gold-400 text-[11px] font-semibold shrink-0">B2B LATAM</span>}
          </div>

          {/* Navegación Principal */}
          <nav className="px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={isCollapsed ? item.label : undefined}
                  className={`relative flex items-center ${
                    isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group overflow-hidden ${
                    isActive
                      ? 'bg-gold-400/10 text-gold-400 border border-gold-400/30 font-semibold shadow-[inset_0_0_12px_rgba(229,193,88,0.08)]'
                      : 'text-brand-secondary hover:text-brand-primary hover:bg-noir-800/80 border border-transparent'
                  }`}
                >
                  {/* Indicador lateral izquierdo con escala vertical */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r bg-gold-400 transition-transform duration-200 origin-center ${
                      isActive ? 'h-6 scale-y-100' : 'h-6 scale-y-0'
                    }`}
                  />

                  <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'} group-hover:translate-x-1 transition-transform duration-200`}>
                    <Icon className={`w-4 h-4 transition-colors shrink-0 ${isActive ? 'text-gold-400' : 'text-brand-muted group-hover:text-gold-400'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded tracking-wider uppercase font-semibold shrink-0 ${
                      isActive ? 'bg-gold-400/20 text-gold-400' : 'bg-noir-700 text-brand-muted'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar: Operador y Salir */}
        <div className="p-3 border-t border-noir-700/60 bg-noir-900/90">
          <div className={`flex items-center ${isCollapsed ? 'justify-center p-1.5' : 'justify-between p-2'} rounded-lg bg-noir-800/60 border border-noir-700/40 mb-2`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5'} overflow-hidden`}>
              <div
                className="w-8 h-8 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-xs font-serif font-bold text-gold-400 shrink-0"
                title={usuario?.nombre || 'Chef Ejecutivo'}
              >
                {usuario?.nombre?.charAt(0) || 'C'}
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-medium text-brand-primary truncate">{usuario?.nombre || 'Chef Ejecutivo'}</p>
                  <p className="text-[10px] font-mono text-brand-muted truncate">{usuario?.correo || 'operador@darkkitchen.com'}</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={logout}
            title={isCollapsed ? 'Cerrar Sesión Activa' : undefined}
            className={`w-full flex items-center justify-center ${
              isCollapsed ? 'p-2' : 'space-x-2 px-3 py-2'
            } rounded-lg text-xs font-medium text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 active:scale-95`}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Cerrar Sesión Activa</span>}
          </button>
        </div>
      </aside>

      {/* Área de Trabajo Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Barra Superior de Estado */}
        <header className="h-16 bg-noir-900/70 backdrop-blur-md border-b border-noir-700/60 px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif text-lg text-brand-primary tracking-tight font-semibold flex items-center space-x-2">
              <span>{title}</span>
              <span className="text-noir-500 text-xs font-normal">/</span>
              <span className="text-xs font-mono text-gold-400 font-normal tracking-wide">{subtitle}</span>
            </h2>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono">
            {/* Reloj de Precisión */}
            <div className="flex items-center space-x-2 text-brand-secondary bg-noir-850 px-3 py-1.5 rounded border border-noir-700/60">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span className="tabular-nums tracking-widest text-brand-primary">
                {time.toLocaleTimeString()}
              </span>
            </div>

            {/* Gateway Telemetry */}
            <div className="hidden lg:flex items-center space-x-2 text-brand-muted">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>API: <strong className="text-brand-secondary">REST 3000</strong></span>
              <span className="text-noir-600">|</span>
              <span>DB: <strong className="text-brand-secondary">dark_kitchen_db</strong></span>
            </div>
          </div>
        </header>

        {/* Contenido Dinámico con Page Enter Transition */}
        <main className="flex-1 overflow-y-auto p-8 bg-noir-950">
          <div key={location.pathname} className="animate-page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shell;
