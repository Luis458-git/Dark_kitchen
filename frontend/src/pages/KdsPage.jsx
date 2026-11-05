import React, { useState, useEffect } from 'react';
import Shell from '../components/layout/Shell';
import { pedidosService } from '../services/pedidosService';
import {
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Package,
  Layers,
  Thermometer,
  Sparkles
} from 'lucide-react';

const KdsPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidosService.getAll();
      setPedidos(data || []);
    } catch (err) {
      setError('Error al sincronizar comandas del KDS.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
    const interval = setInterval(cargarPedidos, 10000); // Polling KDS en vivo cada 10s
    return () => clearInterval(interval);
  }, []);

  const moverEstado = async (id, nuevoEstado) => {
    try {
      await pedidosService.cambiarEstado(id, nuevoEstado);
      cargarPedidos();
    } catch (err) {
      setError('Fallo al actualizar el pase de cocina');
    }
  };

  // Clasificación por columnas
  const colCola = pedidos.filter((p) => p.estado === 'recibido');
  const colCoccion = pedidos.filter((p) => p.estado === 'en_preparacion');
  const colEmpaque = pedidos.filter((p) => p.estado === 'empaque' || (p.estado === 'en_preparacion' && p.id % 2 === 0)); // demo visual balance
  const colListos = pedidos.filter((p) => p.estado === 'listo_para_despacho');

  return (
    <Shell title="Monitor KDS de Cocina" subtitle="Línea de Fuego & Control de Pase">
      {/* Barra Superior de Métricas de Estación y Ocupación */}
      <div className="mb-6 p-4 rounded-xl bg-noir-900 border border-noir-700/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center space-x-6 overflow-x-auto pb-1 lg:pb-0">
          <div className="flex items-center space-x-2">
            <span className="text-brand-muted uppercase text-[11px]">Ocupación Partidas:</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-brand-secondary">Plancha Smash:</span>
            <div className="w-24 h-2 bg-noir-800 rounded-full overflow-hidden border border-noir-700">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <span className="text-rose-400 font-bold">85%</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-brand-secondary">Parrilla Carbón:</span>
            <div className="w-24 h-2 bg-noir-800 rounded-full overflow-hidden border border-noir-700">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <span className="text-amber-400 font-bold">60%</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-brand-secondary">Hornos Convección:</span>
            <div className="w-24 h-2 bg-noir-800 rounded-full overflow-hidden border border-noir-700">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <span className="text-emerald-400 font-bold">45%</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-gold-400 bg-gold-400/10 px-3 py-1.5 rounded border border-gold-400/20">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Sugerencia KDS: Desviar órdenes entrantes a partida Hornos</span>
        </div>
      </div>

      {/* Tablero Kanban KDS de 4 Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {/* Columna 1: Recibido / En Cola */}
        <div className="rounded-xl bg-noir-900 border border-noir-700/80 p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-noir-700 text-xs font-mono">
            <div className="flex items-center space-x-2 text-amber-400">
              <Clock className="w-4 h-4" />
              <span className="font-serif text-sm font-bold tracking-wide">1. Recibido / Cola</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 font-bold">
              {colCola.length}
            </span>
          </div>

          <div className="space-y-3.5">
            {colCola.map((p) => (
              <div key={p.id} className="p-4 rounded-lg bg-noir-850 border border-noir-700/80 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-brand-primary font-bold text-sm">{p.numero_orden}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-noir-800 text-brand-secondary border border-noir-700">
                    {p.plataforma}
                  </span>
                </div>

                <div className="font-serif text-gold-400 text-sm font-semibold">
                  {p.marca?.nombre || 'Marca Satélite'}
                </div>

                <div className="text-brand-secondary text-[11px]">
                  Comensal: <strong className="text-brand-primary">{p.cliente_nombre}</strong>
                </div>

                {p.notas_entrega && (
                  <div className="p-2 rounded bg-noir-900 border border-noir-800 text-[10px] text-amber-300/90 italic">
                    "{p.notas_entrega}"
                  </div>
                )}

                <div className="pt-2 border-t border-noir-700/60 flex items-center justify-between">
                  <span className="text-brand-muted text-[10px]">Espera: 3 min</span>
                  <button
                    onClick={() => moverEstado(p.id, 'en_preparacion')}
                    className="px-3 py-1.5 rounded bg-gold-400 hover:bg-gold-300 text-noir-950 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1 shadow-gold-glow"
                  >
                    <Flame className="w-3 h-3" />
                    <span>A Fuego / Iniciar</span>
                  </button>
                </div>
              </div>
            ))}
            {colCola.length === 0 && (
              <div className="py-8 text-center text-[11px] font-mono text-brand-muted">
                Sin comandas en espera
              </div>
            )}
          </div>
        </div>

        {/* Columna 2: En Cocción Activa */}
        <div className="rounded-xl bg-noir-900 border border-noir-700/80 p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-noir-700 text-xs font-mono">
            <div className="flex items-center space-x-2 text-sky-400">
              <Flame className="w-4 h-4" />
              <span className="font-serif text-sm font-bold tracking-wide">2. Cocción Activa</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-400/10 text-sky-400 font-bold">
              {colCoccion.length}
            </span>
          </div>

          <div className="space-y-3.5">
            {colCoccion.map((p) => (
              <div key={p.id} className="p-4 rounded-lg bg-noir-850 border border-sky-400/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-brand-primary font-bold text-sm">{p.numero_orden}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-300 font-bold">
                    EN FUEGO
                  </span>
                </div>

                <div className="font-serif text-gold-400 text-sm font-semibold">
                  {p.marca?.nombre || 'Marca Satélite'}
                </div>

                <div className="p-2 rounded bg-noir-900 flex items-center justify-between text-xs">
                  <span className="text-brand-muted">Cronómetro SLA:</span>
                  <span className="text-amber-400 font-bold tabular-nums">08:42 min restantes</span>
                </div>

                <div className="pt-2 border-t border-noir-700/60 flex items-center justify-between">
                  <span className="text-brand-muted text-[10px]">${p.total}</span>
                  <button
                    onClick={() => moverEstado(p.id, 'listo_para_despacho')}
                    className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-white font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1"
                  >
                    <span>Pasar a Empaque</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {colCoccion.length === 0 && (
              <div className="py-8 text-center text-[11px] font-mono text-brand-muted">
                Partidas despejadas
              </div>
            )}
          </div>
        </div>

        {/* Columna 3: Empaque & Control Térmico */}
        <div className="rounded-xl bg-noir-900 border border-noir-700/80 p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-noir-700 text-xs font-mono">
            <div className="flex items-center space-x-2 text-gold-400">
              <Package className="w-4 h-4" />
              <span className="font-serif text-sm font-bold tracking-wide">3. Empaque & Control</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-gold-400/10 text-gold-400 font-bold">
              02
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 rounded-lg bg-noir-850 border border-gold-400/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-brand-primary font-bold text-sm">UBER-9821</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-400/20 text-gold-400 font-bold">
                  CONTROL
                </span>
              </div>
              <div className="font-serif text-gold-400 text-sm font-semibold">Maison Noire</div>
              <div className="text-[11px] text-brand-secondary space-y-1">
                <div>✓ Sellos térmicos colocados</div>
                <div>✓ Embalaje hermético validado</div>
              </div>
              <div className="pt-2 border-t border-noir-700/60 flex items-center justify-end">
                <span className="text-xs text-emerald-400 font-semibold">Listo p/ Rack #03</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna 4: Listo Rack Despacho */}
        <div className="rounded-xl bg-noir-900 border border-noir-700/80 p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-noir-700 text-xs font-mono">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-serif text-sm font-bold tracking-wide">4. Rack Despacho</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 font-bold">
              {colListos.length}
            </span>
          </div>

          <div className="space-y-3.5">
            {colListos.map((p, idx) => (
              <div key={p.id} className="p-4 rounded-lg bg-noir-850 border border-emerald-500/40 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-brand-primary font-bold text-sm">{p.numero_orden}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold tracking-wider">
                    RACK #{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="font-serif text-gold-400 text-sm font-semibold">
                  {p.marca?.nombre || 'Marca Satélite'}
                </div>

                <div className="text-brand-secondary text-[11px]">
                  Repartidor: <strong className="text-brand-primary">{p.plataforma}</strong>
                </div>

                <div className="pt-2 border-t border-noir-700/60 flex items-center justify-between">
                  <span className="text-emerald-400 text-[10px]">✓ Temperatura OK</span>
                  <button
                    onClick={() => moverEstado(p.id, 'entregado')}
                    className="px-3 py-1.5 rounded bg-noir-800 hover:bg-noir-700 text-brand-primary font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1 border border-noir-700"
                  >
                    <span>Entregar</span>
                  </button>
                </div>
              </div>
            ))}
            {colListos.length === 0 && (
              <div className="py-8 text-center text-[11px] font-mono text-brand-muted">
                Racks térmicos libres
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default KdsPage;

