import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Shell from '../components/layout/Shell';
import { statusService } from '../services/statusService';
import {
  Activity,
  CheckCircle2,
  CornerUpRight,
  AlertTriangle,
  AlertOctagon,
  Search,
  Play,
  ExternalLink,
  Terminal,
  Clock,
  Sparkles,
  Zap,
  RotateCcw,
  ShieldAlert,
  Flame,
  Bomb
} from 'lucide-react';

const StatusCodesPage = () => {
  const [catalogo, setCatalogo] = useState([]);
  const [filtroFamilia, setFiltroFamilia] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [probandoCodigo, setProbandoCodigo] = useState(null);
  const [ultimoResultado, setUltimoResultado] = useState(null);
  const [simularCrash, setSimularCrash] = useState(false);

  // Cargar catálogo desde la API
  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const respuesta = await statusService.obtenerCatalogo();
        setCatalogo(respuesta.data || []);
      } catch (err) {
        console.error('Error cargando catálogo de estados:', err);
      } finally {
        setLoading(false);
      }
    };
    cargarCatalogo();
  }, []);

  // Si el usuario activa la simulación de crash para probar el ErrorBoundary
  if (simularCrash) {
    throw new Error('Fallo simulado por el operador para probar el ErrorBoundary de DarkKitchen Hub (500)');
  }

  // Disparar prueba de código HTTP
  const ejecutarPrueba = async (codigo) => {
    setProbandoCodigo(codigo);
    const resultado = await statusService.probarCodigo(codigo);
    setUltimoResultado(resultado);
    setProbandoCodigo(null);
  };

  // Filtrado
  const codigosFiltrados = catalogo.filter((item) => {
    const cumpleFamilia = filtroFamilia === 'todas' || item.familia === filtroFamilia;
    const termino = busqueda.toLowerCase().trim();
    const cumpleBusqueda =
      !termino ||
      item.codigo.toString().includes(termino) ||
      item.nombre.toLowerCase().includes(termino) ||
      item.contextoDarkKitchen.toLowerCase().includes(termino) ||
      item.categoria.toLowerCase().includes(termino);

    return cumpleFamilia && cumpleBusqueda;
  });

  // Metadatos de color y estilo por familia
  const getFamiliaConfig = (familia) => {
    switch (familia) {
      case '2xx':
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          badgeBg: 'bg-emerald-500/20 text-emerald-300',
          hoverBorder: 'hover:border-emerald-500/50',
          icon: CheckCircle2,
          label: '2xx Éxito'
        };
      case '3xx':
        return {
          color: 'text-sky-400',
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/30',
          badgeBg: 'bg-sky-500/20 text-sky-300',
          hoverBorder: 'hover:border-sky-500/50',
          icon: CornerUpRight,
          label: '3xx Redirección'
        };
      case '4xx':
        return {
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          badgeBg: 'bg-amber-500/20 text-amber-300',
          hoverBorder: 'hover:border-amber-500/50',
          icon: AlertTriangle,
          label: '4xx Error Cliente'
        };
      case '5xx':
        return {
          color: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          badgeBg: 'bg-rose-500/20 text-rose-300',
          hoverBorder: 'hover:border-rose-500/50',
          icon: AlertOctagon,
          label: '5xx Error Servidor'
        };
      default:
        return {
          color: 'text-gold-400',
          bg: 'bg-gold-400/10',
          border: 'border-gold-400/30',
          badgeBg: 'bg-gold-400/20 text-gold-300',
          hoverBorder: 'hover:border-gold-400/50',
          icon: Activity,
          label: 'HTTP'
        };
    }
  };

  // Mapeo a rutas visuales completas si existe pantalla dedicada
  const getRutaVisual = (codigo) => {
    switch (codigo) {
      case 403:
        return '/403';
      case 404:
        return '/404';
      case 500:
        return '/500';
      case 503:
        return '/503';
      default:
        return null;
    }
  };

  return (
    <Shell
      title="Telemetría & Diagnóstico HTTP"
      subtitle="Matriz de Respuestas 200 • 300 • 400 • 500"
    >
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Banner Superior de Diagnóstico */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-noir-900 via-noir-850 to-noir-900 border border-noir-700/60 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-gold-400/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs font-mono uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Protocolo Atelier Noir REST Gateway</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-primary tracking-tight">
                Consola de Códigos de Estado & Resiliencia
              </h2>
              <p className="text-xs text-brand-secondary max-w-2xl mt-1 leading-relaxed">
                Supervisa el comportamiento del sistema ante peticiones exitosas (2xx), migraciones de ruta (3xx), errores de cliente o autenticación (4xx) y fallos críticos de servidor (5xx) simulados en tiempo real.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setSimularCrash(true)}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all duration-200 active:scale-95"
                title="Dispara un render crash para verificar el ErrorBoundary en vivo"
              >
                <Bomb className="w-3.5 h-3.5 text-rose-400" />
                <span>Simular Crash React (500)</span>
              </button>
            </div>
          </div>

          {/* Métricas / KPIs de Familias */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-noir-700/60">
            <div className="p-3 rounded-xl bg-noir-950/60 border border-noir-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-0.5">
                Familia 2xx • Éxito
              </span>
              <span className="text-xl font-serif font-bold text-brand-primary">4 Códigos</span>
              <span className="block text-[10px] font-mono text-brand-muted mt-0.5">200, 201, 202, 204</span>
            </div>

            <div className="p-3 rounded-xl bg-noir-950/60 border border-noir-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 block mb-0.5">
                Familia 3xx • Redirección
              </span>
              <span className="text-xl font-serif font-bold text-brand-primary">5 Códigos</span>
              <span className="block text-[10px] font-mono text-brand-muted mt-0.5">301, 302, 304, 307, 308</span>
            </div>

            <div className="p-3 rounded-xl bg-noir-950/60 border border-noir-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-0.5">
                Familia 4xx • Cliente
              </span>
              <span className="text-xl font-serif font-bold text-brand-primary">7 Códigos</span>
              <span className="block text-[10px] font-mono text-brand-muted mt-0.5">400, 401, 403, 404, 409...</span>
            </div>

            <div className="p-3 rounded-xl bg-noir-950/60 border border-noir-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block mb-0.5">
                Familia 5xx • Servidor
              </span>
              <span className="text-xl font-serif font-bold text-brand-primary">5 Códigos</span>
              <span className="block text-[10px] font-mono text-brand-muted mt-0.5">500, 501, 502, 503, 504</span>
            </div>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs por Familia */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-noir-900 border border-noir-700/60">
            {[
              { id: 'todas', label: 'Todas las Familias', count: catalogo.length },
              { id: '2xx', label: '2xx Éxito', count: catalogo.filter((c) => c.familia === '2xx').length },
              { id: '3xx', label: '3xx Redirección', count: catalogo.filter((c) => c.familia === '3xx').length },
              { id: '4xx', label: '4xx Cliente', count: catalogo.filter((c) => c.familia === '4xx').length },
              { id: '5xx', label: '5xx Servidor', count: catalogo.filter((c) => c.familia === '5xx').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFiltroFamilia(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                  filtroFamilia === tab.id
                    ? 'bg-gold-400 text-noir-950 font-bold shadow-gold-glow'
                    : 'text-brand-secondary hover:text-brand-primary hover:bg-noir-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1.5 text-[10px] opacity-80">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Buscador Rápido */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar código, nombre o caso..."
              className="w-full bg-noir-900 border border-noir-700/60 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-brand-primary placeholder:text-brand-muted focus:outline-none focus:border-gold-400/50 transition-colors"
            />
          </div>
        </div>

        {/* Panel de Último Resultado de Inspección en Vivo (si se ejecutó una prueba) */}
        {ultimoResultado && (
          <div className="p-4 rounded-xl bg-noir-900 border border-gold-400/40 shadow-xl space-y-3 animate-page-enter">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-semibold">
                  Inspector de Telemetría HTTP en Vivo
                </span>
                <span className="text-[11px] font-mono text-brand-muted">
                  [{ultimoResultado.timestamp}]
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-brand-muted">
                  Latencia: <strong className="text-gold-400">{ultimoResultado.latenciaMs} ms</strong>
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    ultimoResultado.esExito
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : ultimoResultado.esRedireccion
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : ultimoResultado.esErrorCliente
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  HTTP {ultimoResultado.status} {ultimoResultado.statusText}
                </span>
              </div>
            </div>

            {/* Cabeceras y JSON Payload */}
            <div className="p-3 rounded-lg bg-noir-950 border border-noir-800 font-mono text-xs overflow-x-auto max-h-56 scrollbar-thin">
              <pre className="text-emerald-400 text-[11px]">
                {JSON.stringify(ultimoResultado.data || { info: 'Sin cuerpo de respuesta (204/304)' }, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Grid de Códigos de Estado */}
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-brand-muted">
            <RotateCcw className="w-6 h-6 mx-auto mb-2 text-gold-400 animate-spin" />
            <span>Sincronizando matriz de telemetría HTTP...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {codigosFiltrados.map((item, index) => {
              const cfg = getFamiliaConfig(item.familia);
              const Icon = cfg.icon;
              const rutaVisual = getRutaVisual(item.codigo);
              const isProbando = probandoCodigo === item.codigo;

              return (
                <div
                  key={item.codigo}
                  style={{ animationDelay: `${index * 35}ms` }}
                  className={`p-5 rounded-2xl bg-noir-900/90 border border-noir-700/60 ${cfg.hoverBorder} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.6)] flex flex-col justify-between group`}
                >
                  <div>
                    {/* Header de Tarjeta */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-9 h-9 rounded-lg ${cfg.bg} ${cfg.border} border flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-serif text-lg font-bold text-brand-primary">
                              {item.codigo}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${cfg.badgeBg}`}>
                              {item.nombre}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono uppercase text-brand-muted tracking-wider block">
                            {item.categoria}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contexto Dark Kitchen */}
                    <div className="space-y-2 mb-4">
                      <div className="p-2.5 rounded-lg bg-noir-950/70 border border-noir-800/80">
                        <span className="text-[9px] font-mono uppercase text-gold-400 block mb-0.5 font-semibold">
                          Contexto Gastronómico
                        </span>
                        <p className="text-xs text-brand-primary leading-snug">
                          {item.contextoDarkKitchen}
                        </p>
                      </div>

                      {/* Explicación RFC estándar */}
                      <p className="text-[11px] text-brand-secondary leading-relaxed px-1">
                        <strong className="text-brand-muted font-normal">RFC:</strong> {item.descripcionRfc}
                      </p>
                    </div>
                  </div>

                  {/* Acciones de Tarjeta */}
                  <div className="pt-3 border-t border-noir-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => ejecutarPrueba(item.codigo)}
                      disabled={isProbando}
                      className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider text-brand-primary bg-noir-850 hover:bg-noir-800 border border-noir-700 hover:border-gold-400/40 transition-all duration-200 active:scale-95 disabled:opacity-50"
                    >
                      <Play className={`w-3 h-3 text-gold-400 ${isProbando ? 'animate-spin' : ''}`} />
                      <span>{isProbando ? 'Probando...' : 'Probar HTTP'}</span>
                    </button>

                    {rutaVisual && (
                      <Link
                        to={rutaVisual}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-noir-950 hover:bg-gold-400 border border-gold-400/30 transition-all duration-200 active:scale-95 shrink-0"
                        title={`Abrir pantalla visual completa para HTTP ${item.codigo}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Ver Pantalla</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Shell>
  );
};

export default StatusCodesPage;
