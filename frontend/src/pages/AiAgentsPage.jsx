import React, { useState, useEffect } from 'react';
import Shell from '../components/layout/Shell';
import { aiService } from '../services/aiService';
import {
  Cpu,
  UserCheck,
  ChefHat,
  Layers,
  Sparkles,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Store,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  ShieldCheck,
  Flame,
  Search,
  ExternalLink,
  Percent
} from 'lucide-react';

const AiAgentsPage = () => {
  const [data, setData] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [ejecutando, setEjecutando] = useState(false);
  const [error, setError] = useState('');
  const [pipelineStep, setPipelineStep] = useState(4); // 1: Orq, 2: Analista, 3: Recom, 4: Cross

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar lista de comensales y ejecutar orquestación inicial
      const [resClientes, resAI] = await Promise.all([
        aiService.getClientes().catch(() => []),
        aiService.ejecutarMultiAgente('')
      ]);

      setClientes(resClientes || []);
      setData(resAI);
      if (resAI?.agente_analista?.cliente) {
        setClienteSeleccionado(resAI.agente_analista.cliente);
      }
    } catch (err) {
      console.error('Error al inicializar multi-agente:', err);
      setError('Fallo al sincronizar con el motor multi-agente en el backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const handleEjecutarOrquestacion = async (nombreCliente) => {
    try {
      setEjecutando(true);
      setError('');
      setPipelineStep(1);

      // Simular progresión sutil de la tubería multi-agente
      setTimeout(() => setPipelineStep(2), 200);
      setTimeout(() => setPipelineStep(3), 450);

      const target = nombreCliente !== undefined ? nombreCliente : clienteSeleccionado;
      const res = await aiService.ejecutarMultiAgente(target);

      setTimeout(() => {
        setData(res);
        setPipelineStep(4);
        setEjecutando(false);
      }, 650);
    } catch (err) {
      console.error('Error al ejecutar multi-agente:', err);
      setError('No se pudo completar la orquestación multi-agente.');
      setEjecutando(false);
    }
  };

  const orquestador = data?.orquestador;
  const analista = data?.agente_analista;
  const recomendador = data?.agente_recomendador || [];
  const crossSelling = data?.agente_cross_selling;

  return (
    <Shell
      title="Copiloto Multi-Agente de IA"
      subtitle="Orquestación Autónoma de Análisis, Menú & Cross-Selling"
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Superior & Selector de Comensal */}
        <div className="p-6 rounded-2xl bg-noir-900 border border-gold-400/40 shadow-obsidian relative overflow-hidden">
          {/* Luces y texturas ambientales en penumbra */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-400 text-xs font-mono mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold tracking-wider uppercase">Motor Multi-Agente B2B Activo</span>
              </div>
              <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-primary tracking-wide">
                Orquestador Central de Inteligencia Culinaria
              </h1>
              <p className="text-brand-secondary text-sm mt-1 max-w-2xl font-light">
                Coordina en tiempo real tres agentes especializados sobre la base de datos de comandas, menú y marcas satélite sin interrupción de servicio.
              </p>
            </div>

            {/* Panel de Control y Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                <select
                  value={clienteSeleccionado}
                  onChange={(e) => {
                    setClienteSeleccionado(e.target.value);
                    handleEjecutarOrquestacion(e.target.value);
                  }}
                  className="w-full bg-noir-950 border border-noir-700/80 rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-brand-primary focus:outline-none focus:border-gold-400 transition-colors"
                >
                  <option value="">-- Autoseleccionar Cliente VIP --</option>
                  {clientes.map((c) => (
                    <option key={c.cliente_nombre} value={c.cliente_nombre}>
                      {c.cliente_nombre} ({c.total_pedidos} pedidos · ${c.ticket_promedio})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleEjecutarOrquestacion(clienteSeleccionado)}
                disabled={ejecutando}
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-gold-400 hover:bg-gold-300 text-noir-950 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-gold-glow disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${ejecutando ? 'animate-spin' : ''}`} />
                <span>{ejecutando ? 'Orquestando...' : 'Re-ejecutar Agentes'}</span>
              </button>
            </div>
          </div>

          {/* Barra de Progreso de la Tubería */}
          <div className="relative z-10 mt-6 pt-5 border-t border-noir-800/80">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className={`p-3 rounded-lg border transition-all ${
                pipelineStep >= 1 ? 'bg-gold-400/10 border-gold-400/40 text-gold-400' : 'bg-noir-950 border-noir-800 text-brand-muted'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-semibold">Paso 01</span>
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="font-bold text-[11px]">Orquestador Central</div>
                <div className="text-[10px] text-brand-secondary opacity-80">Lectura MySQL en Vivo</div>
              </div>

              <div className={`p-3 rounded-lg border transition-all ${
                pipelineStep >= 2 ? 'bg-gold-400/10 border-gold-400/40 text-gold-400' : 'bg-noir-950 border-noir-800 text-brand-muted'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-semibold">Paso 02</span>
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="font-bold text-[11px]">Agente Analista</div>
                <div className="text-[10px] text-brand-secondary opacity-80">Profiling & Telemetría</div>
              </div>

              <div className={`p-3 rounded-lg border transition-all ${
                pipelineStep >= 3 ? 'bg-gold-400/10 border-gold-400/40 text-gold-400' : 'bg-noir-950 border-noir-800 text-brand-muted'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-semibold">Paso 03</span>
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="font-bold text-[11px]">Agente Recomendador</div>
                <div className="text-[10px] text-brand-secondary opacity-80">Filtro Stock 86 & Menú</div>
              </div>

              <div className={`p-3 rounded-lg border transition-all ${
                pipelineStep >= 4 ? 'bg-gold-400/10 border-gold-400/40 text-gold-400' : 'bg-noir-950 border-noir-800 text-brand-muted'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-semibold">Paso 04</span>
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="font-bold text-[11px]">Agente Cross-Selling</div>
                <div className="text-[10px] text-brand-secondary opacity-80">Combo Multi-Satélite</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center space-x-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Métricas Globales del Orquestador */}
        {orquestador && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-noir-900 border border-noir-700/60 shadow-obsidian">
              <span className="text-[10px] font-mono uppercase text-brand-muted block">Marcas Activas</span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-2xl font-serif font-bold text-brand-primary tabular-nums">
                  {orquestador.marcas_activas}
                </span>
                <span className="text-xs font-mono text-brand-muted">/ {orquestador.marcas_totales} totales</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-noir-900 border border-noir-700/60 shadow-obsidian">
              <span className="text-[10px] font-mono uppercase text-emerald-400/90 block">Platillos Disponibles</span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-2xl font-serif font-bold text-emerald-400 tabular-nums">
                  {orquestador.platillos_disponibles}
                </span>
                <span className="text-xs font-mono text-brand-muted">en carta activa</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-noir-900 border border-noir-700/60 shadow-obsidian">
              <span className="text-[10px] font-mono uppercase text-amber-400/90 block">Stock 86 (Descartados)</span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-2xl font-serif font-bold text-amber-400 tabular-nums">
                  {orquestador.platillos_agotados_86}
                </span>
                <span className="text-xs font-mono text-brand-muted">pausados</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-noir-900 border border-noir-700/60 shadow-obsidian">
              <span className="text-[10px] font-mono uppercase text-brand-muted block">Comandas en Sistema</span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-2xl font-serif font-bold text-gold-400 tabular-nums">
                  {orquestador.pedidos_totales_sistema}
                </span>
                <span className="text-xs font-mono text-brand-muted">procesadas</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-noir-900 border border-noir-700/60 shadow-obsidian col-span-2 md:col-span-1">
              <span className="text-[10px] font-mono uppercase text-brand-muted block">Sujeto de Análisis</span>
              <div className="mt-1 truncate">
                <span className="text-sm font-serif font-bold text-brand-primary truncate block" title={orquestador.cliente_solicitado}>
                  {orquestador.cliente_solicitado}
                </span>
                <span className="text-[10px] font-mono text-gold-400">Objetivo en Foco</span>
              </div>
            </div>
          </div>
        )}

        {/* Cuadrícula de los 3 Sub-Agentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ======================================================== */}
          {/* SUB-AGENTE 1: ANALISTA DE CONSUMO                        */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-noir-900 border border-gold-400/30 p-6 shadow-obsidian space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-noir-700/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 shadow-gold-glow">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold block">Sub-Agente 01</span>
                  <h3 className="font-serif text-lg font-bold text-brand-primary">Analista de Consumo</h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase font-semibold">
                Profiling Activo
              </span>
            </div>

            {analista ? (
              <div className="space-y-5">
                {/* Comensal & Métricas de Gasto */}
                <div className="p-4 rounded-xl bg-noir-950 border border-noir-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-brand-muted uppercase">Comensal Auditado</span>
                    <span className="text-xs font-mono font-bold text-gold-400">{analista.cliente}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-noir-800/80 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-brand-muted block uppercase">Ticket Promedio</span>
                      <span className="text-lg font-serif font-bold text-gold-400 tabular-nums">
                        ${analista.ticket_promedio.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted block uppercase">Comandas Totales</span>
                      <span className="text-lg font-serif font-bold text-brand-primary tabular-nums">
                        {analista.total_pedidos}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Marca Favorita & Canal */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-noir-950 border border-noir-800">
                    <span className="text-[10px] text-brand-muted uppercase block mb-1">Marca Favorita</span>
                    <span className="font-bold text-brand-primary block truncate">
                      {analista.marca_favorita?.nombre || 'Maison Noire'}
                    </span>
                    <span className="text-[10px] text-gold-400 block truncate">
                      {analista.marca_favorita?.tipo_cocina || 'Cocina de Autor'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-noir-950 border border-noir-800">
                    <span className="text-[10px] text-brand-muted uppercase block mb-1">Canal Preferido</span>
                    <span className="font-bold text-brand-primary block truncate">
                      {analista.plataforma_preferida}
                    </span>
                    <span className="text-[10px] text-emerald-400 block">
                      Mayor Recurrencia
                    </span>
                  </div>
                </div>

                {/* Perfil Editorial del Consumidor */}
                <div className="p-4 rounded-xl bg-noir-950 border border-noir-800/80">
                  <span className="text-[10px] font-mono uppercase text-gold-400 block mb-1.5 font-semibold">
                    Perfil del Consumidor (Heurística)
                  </span>
                  <p className="text-xs text-brand-secondary leading-relaxed font-light">
                    "{analista.perfil_consumidor}"
                  </p>
                </div>

                {/* Etiquetas de Comportamiento */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-muted block mb-2">
                    Etiquetas de Segmentación
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analista.etiquetas_comportamiento?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-gold-400/10 border border-gold-400/30 text-gold-300 font-mono text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-mono text-brand-muted">
                Esperando datos del orquestador...
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* SUB-AGENTE 2: RECOMENDADOR DE MENÚ                       */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-noir-900 border border-gold-400/30 p-6 shadow-obsidian space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-noir-700/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-gold-glow">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block">Sub-Agente 02</span>
                  <h3 className="font-serif text-lg font-bold text-brand-primary">Recomendador de Menú</h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-gold-400/10 border border-gold-400/30 text-gold-400 font-mono text-[10px] uppercase font-semibold">
                2 Opciones Afinadas
              </span>
            </div>

            {recomendador.length > 0 ? (
              <div className="space-y-4">
                {recomendador.map((platillo, idx) => (
                  <div
                    key={platillo.id || idx}
                    className="p-4 rounded-xl bg-noir-950 border border-noir-800 hover:border-gold-400/40 transition-colors space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-noir-900 border border-noir-700 text-gold-400 font-semibold">
                            {platillo.marca_nombre}
                          </span>
                          <span className="text-[10px] font-mono text-brand-muted">
                            {platillo.categoria}
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-brand-primary group-hover:text-gold-400 transition-colors">
                          {platillo.nombre}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-lg font-serif font-bold text-gold-400 tabular-nums">
                          ${platillo.precio.toFixed(2)}
                        </span>
                        <span className="block text-[10px] font-mono text-brand-muted">
                          {platillo.tiempo_preparacion_min} min prep
                        </span>
                      </div>
                    </div>

                    {/* Justificación de la IA */}
                    <div className="p-3 rounded-lg bg-noir-900/80 border border-noir-700/60 text-xs">
                      <div className="flex items-center space-x-1.5 text-gold-400 font-mono text-[10px] uppercase font-semibold mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Justificación Algorítmica</span>
                      </div>
                      <p className="text-brand-secondary text-xs leading-relaxed font-light">
                        {platillo.justificacion_ia}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Filtrado estricto contra Stock 86 ejecutado con éxito.</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-mono text-brand-muted">
                No se encontraron platillos disponibles para recomendar.
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* SUB-AGENTE 3: CROSS-SELLING MULTI-MARCA                  */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-noir-900 border border-gold-400/30 p-6 shadow-obsidian space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-noir-700/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-gold-glow">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold block">Sub-Agente 03</span>
                  <h3 className="font-serif text-lg font-bold text-brand-primary">Cross-Selling Multi-Satélite</h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-semibold">
                Sinergia B2B
              </span>
            </div>

            {crossSelling ? (
              <div className="space-y-5">
                {/* Diagrama de Cruce entre Marcas */}
                <div className="p-4 rounded-xl bg-noir-950 border border-noir-800 text-xs font-mono">
                  <span className="text-[10px] text-brand-muted uppercase block mb-2">Conexión de Satélites</span>
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-noir-900 border border-noir-700 text-center flex-1">
                      <span className="text-[10px] text-brand-muted block uppercase">Marca Principal</span>
                      <span className="font-bold text-brand-primary text-xs truncate block">
                        {crossSelling.marca_principal}
                      </span>
                    </div>

                    <div className="px-3 text-gold-400 font-bold">
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </div>

                    <div className="p-2.5 rounded-lg bg-gold-400/10 border border-gold-400/30 text-center flex-1">
                      <span className="text-[10px] text-gold-400 block uppercase">Marca Hermana</span>
                      <span className="font-bold text-gold-300 text-xs truncate block">
                        {crossSelling.marca_hermana}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tarjeta del Complemento Sugerido con Descuento */}
                <div className="p-4 rounded-xl bg-noir-950 border border-gold-400/40 relative overflow-hidden">
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
                    10% OFF Aplicado
                  </div>

                  <span className="text-[10px] font-mono uppercase text-brand-muted block">Complemento Sugerido</span>
                  <h4 className="font-serif text-base font-bold text-brand-primary mt-1">
                    {crossSelling.platillo_sugerido?.nombre}
                  </h4>
                  <span className="text-xs font-mono text-gold-400/90 block mt-0.5">
                    Categoría: {crossSelling.platillo_sugerido?.categoria}
                  </span>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-noir-800 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-brand-muted block uppercase">Precio Base</span>
                      <span className="line-through text-brand-muted tabular-nums">
                        ${crossSelling.platillo_sugerido?.precio_original?.toFixed(2)}
                      </span>
                      <span className="block text-emerald-400 font-bold tabular-nums">
                        ${crossSelling.platillo_sugerido?.precio_con_descuento_10?.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-brand-muted block uppercase">Ahorro Comensal</span>
                      <span className="text-sm font-bold text-emerald-400 tabular-nums">
                        -${crossSelling.ahorro?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Combo Sugerido Consolidado */}
                  <div className="mt-4 p-3 rounded-lg bg-gold-400/10 border border-gold-400/30 flex items-center justify-between font-mono">
                    <div>
                      <span className="text-[10px] text-gold-400 uppercase block font-semibold">Ticket Combo Sugerido</span>
                      <span className="text-xs text-brand-secondary">Con incentivo multi-marca</span>
                    </div>
                    <span className="text-xl font-serif font-bold text-gold-400 tabular-nums">
                      ${crossSelling.precio_combo_sugerido?.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Estrategia de Negocio B2B */}
                <div className="p-4 rounded-xl bg-noir-950 border border-noir-800">
                  <div className="flex items-center space-x-1.5 text-gold-400 font-mono text-[10px] uppercase font-semibold mb-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Estrategia de Negocio B2B</span>
                  </div>
                  <p className="text-xs text-brand-secondary leading-relaxed font-light">
                    {crossSelling.estrategia_negocio}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-mono text-brand-muted">
                Esperando generación de propuesta cross-selling...
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default AiAgentsPage;
