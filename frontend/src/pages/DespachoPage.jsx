import React, { useState, useEffect } from 'react';
import Shell from '../components/layout/Shell';
import { pedidosService } from '../services/pedidosService';
import { marcasService } from '../services/marcasService';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  Bot,
  Sparkles,
  ChevronRight,
  Flame,
  Search,
  Trash2,
  Edit2,
  RefreshCw,
  X
} from 'lucide-react';

const CANALES = ['Todos', 'Uber Eats', 'Rappi', 'DiDi Food', 'Pedido Directo'];
const ESTADOS = [
  { value: 'recibido', label: 'Recibido', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
  { value: 'en_preparacion', label: 'En Preparación', color: 'text-sky-400 bg-sky-400/10 border-sky-400/30' },
  { value: 'listo_para_despacho', label: 'Listo Despacho', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
  { value: 'entregado', label: 'Entregado', color: 'text-noir-500 bg-noir-800 border-noir-700' },
  { value: 'cancelado', label: 'Cancelado', color: 'text-rose-400 bg-rose-400/10 border-rose-400/30' }
];

const DespachoPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canalFiltro, setCanalFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Drawer Copiloto IA
  const [copilotoOpen, setCopilotoOpen] = useState(true);

  // Modal Crear / Editar
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [marcaId, setMarcaId] = useState('');
  const [numeroOrden, setNumeroOrden] = useState('');
  const [plataforma, setPlataforma] = useState('Uber Eats');
  const [clienteNombre, setClienteNombre] = useState('');
  const [total, setTotal] = useState('');
  const [estado, setEstado] = useState('recibido');
  const [notasEntrega, setNotasEntrega] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Modal Confirmar Eliminar
  const [eliminarModal, setEliminarModal] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [dataPedidos, dataMarcas] = await Promise.all([
        pedidosService.getAll(),
        marcasService.getAll()
      ]);
      setPedidos(dataPedidos || []);
      setMarcas(dataMarcas || []);
      if (dataMarcas?.length > 0 && !marcaId) {
        setMarcaId(dataMarcas[0].id);
      }
    } catch (err) {
      setError('Fallo al sincronizar comandas de despacho.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await pedidosService.cambiarEstado(id, nuevoEstado);
      cargarDatos();
    } catch (err) {
      setError('Error al actualizar el estado de la comanda');
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');

    const payload = {
      marca_id: Number(marcaId),
      numero_orden: numeroOrden.trim(),
      plataforma,
      cliente_nombre: clienteNombre.trim(),
      total: parseFloat(total),
      estado,
      notas_entrega: notasEntrega ? notasEntrega.trim() : null
    };

    try {
      if (editandoId) {
        await pedidosService.update(editandoId, payload);
      } else {
        await pedidosService.create(payload);
      }
      setModalOpen(false);
      limpiarForm();
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.mensaje || 'Error al guardar comanda';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  const limpiarForm = () => {
    setEditandoId(null);
    setNumeroOrden('');
    setPlataforma('Uber Eats');
    setClienteNombre('');
    setTotal('');
    setEstado('recibido');
    setNotasEntrega('');
    if (marcas.length > 0) setMarcaId(marcas[0].id);
  };

  const abrirEditar = (p) => {
    setEditandoId(p.id);
    setMarcaId(p.marca_id);
    setNumeroOrden(p.numero_orden);
    setPlataforma(p.plataforma);
    setClienteNombre(p.cliente_nombre);
    setTotal(p.total);
    setEstado(p.estado);
    setNotasEntrega(p.notas_entrega || '');
    setModalOpen(true);
  };

  const confirmarEliminar = async () => {
    if (!pedidoAEliminar) return;
    try {
      await pedidosService.delete(pedidoAEliminar.id);
      setEliminarModal(false);
      setPedidoAEliminar(null);
      cargarDatos();
    } catch (err) {
      setError('Error al eliminar la comanda');
      setEliminarModal(false);
    }
  };

  // KPIs calculados
  const pedidosFiltrados = pedidos.filter((p) => {
    const cumpleCanal = canalFiltro === 'Todos' || p.plataforma?.toLowerCase() === canalFiltro.toLowerCase();
    const cumpleBusqueda =
      p.numero_orden?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.marca?.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleCanal && cumpleBusqueda;
  });

  const activosCount = pedidos.filter((p) => ['recibido', 'en_preparacion'].includes(p.estado)).length;
  const listosCount = pedidos.filter((p) => p.estado === 'listo_para_despacho').length;
  const totalVentas = pedidos.reduce((acc, p) => acc + Number(p.total || 0), 0);
  const ticketPromedio = pedidos.length > 0 ? totalVentas / pedidos.length : 0;

  return (
    <Shell title="Consola de Despacho" subtitle="Control Térmico & Pase de Comandas">
      {/* Alerta de Error */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid de 4 KPIs Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-xl bg-noir-900 border border-noir-700/80">
          <div className="flex items-center justify-between text-brand-muted text-xs font-mono uppercase">
            <span>Comandas Activas</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-brand-primary tabular-nums">
            {String(activosCount).padStart(2, '0')}
          </div>
          <div className="mt-2 text-[11px] font-mono text-amber-400 flex items-center space-x-1">
            <span>En cola y fuego activo</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-noir-900 border border-noir-700/80">
          <div className="flex items-center justify-between text-brand-muted text-xs font-mono uppercase">
            <span>Listos para Despacho</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-emerald-400 tabular-nums">
            {String(listosCount).padStart(2, '0')}
          </div>
          <div className="mt-2 text-[11px] font-mono text-brand-secondary">
            En racks térmicos asignados
          </div>
        </div>

        <div className="p-5 rounded-xl bg-noir-900 border border-noir-700/80">
          <div className="flex items-center justify-between text-brand-muted text-xs font-mono uppercase">
            <span>Ventas del Turno</span>
            <TrendingUp className="w-4 h-4 text-gold-400" />
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-gold-400 tabular-nums">
            ${totalVentas.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] font-mono text-brand-secondary">
            {pedidos.length} órdenes registradas
          </div>
        </div>

        <div className="p-5 rounded-xl bg-noir-900 border border-noir-700/80">
          <div className="flex items-center justify-between text-brand-muted text-xs font-mono uppercase">
            <span>Ticket Promedio</span>
            <span className="text-[10px] font-mono text-gold-400">LATAM</span>
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-brand-primary tabular-nums">
            ${ticketPromedio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] font-mono text-brand-secondary">
            Rendimiento por comanda
          </div>
        </div>
      </div>

      {/* Contenedor Principal: Tabla + Drawer Copiloto */}
      <div className="flex gap-6 items-start">
        {/* Columna Izquierda: Filtros y Tabla Densa */}
        <div className="flex-1 min-w-0">
          {/* Barra de Filtros y Creación */}
          <div className="p-4 rounded-xl bg-noir-900 border border-noir-700/80 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-mono text-brand-muted uppercase flex items-center space-x-1 pl-1 pr-2">
                <Filter className="w-3.5 h-3.5" />
                <span>Canal:</span>
              </span>
              {CANALES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCanalFiltro(c)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-all duration-200 shrink-0 ${
                    canalFiltro === c
                      ? 'bg-gold-400 text-noir-950 font-bold shadow-gold-glow'
                      : 'bg-noir-800 text-brand-secondary hover:text-brand-primary'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar orden, comensal o marca..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="bg-noir-950 border border-noir-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-brand-primary placeholder:text-noir-500 focus:outline-none focus:border-gold-400 w-56"
                />
              </div>

              <button
                onClick={() => { limpiarForm(); setModalOpen(true); }}
                className="px-4 py-2 rounded-lg bg-gold-400 hover:bg-gold-300 text-noir-950 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-gold-glow flex items-center space-x-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Comanda</span>
              </button>
            </div>
          </div>

          {/* Tabla Interactiva Densa */}
          <div className="rounded-xl bg-noir-900 border border-noir-700/80 overflow-hidden shadow-obsidian">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-noir-700/80 bg-noir-850 text-brand-muted uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 font-semibold">Orden</th>
                    <th className="py-3.5 px-4 font-semibold">Marca Satélite</th>
                    <th className="py-3.5 px-4 font-semibold">Plataforma</th>
                    <th className="py-3.5 px-4 font-semibold">Cliente / Receptor</th>
                    <th className="py-3.5 px-4 font-semibold">Monto Total</th>
                    <th className="py-3.5 px-4 font-semibold">Estado Operativo</th>
                    <th className="py-3.5 px-4 font-semibold">Hora</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-noir-800">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-brand-muted font-mono">
                        Sincronizando comanderas con MySQL...
                      </td>
                    </tr>
                  ) : pedidosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-brand-muted font-mono">
                        No hay comandas activas para los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    pedidosFiltrados.map((p) => {
                      const estInfo = ESTADOS.find((e) => e.value === p.estado) || ESTADOS[0];
                      return (
                        <tr key={p.id} className="hover:bg-noir-850/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-brand-primary">
                            {p.numero_orden}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gold-400 font-semibold font-serif text-sm">
                              {p.marca?.nombre || `Marca #${p.marca_id}`}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-noir-800 border border-noir-700 text-[10px] text-brand-secondary">
                              {p.plataforma}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-brand-secondary font-sans font-medium">
                            {p.cliente_nombre}
                            {p.notas_entrega && (
                              <div className="text-[10px] text-brand-muted truncate max-w-xs font-mono">
                                Nota: {p.notas_entrega}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-brand-primary tabular-nums">
                            ${Number(p.total).toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={p.estado}
                              onChange={(e) => handleCambiarEstado(p.id, e.target.value)}
                              className={`text-[11px] font-semibold font-mono rounded px-2.5 py-1 border bg-noir-950 focus:outline-none cursor-pointer ${estInfo.color}`}
                            >
                              {ESTADOS.map((e) => (
                                <option key={e.value} value={e.value} className="bg-noir-900 text-brand-primary">
                                  {e.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4 text-brand-muted tabular-nums">
                            {new Date(p.fecha_pedido || p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => abrirEditar(p)}
                              className="p-1 rounded text-brand-secondary hover:text-gold-400 hover:bg-noir-800 transition-colors"
                              title="Editar comanda"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { setPedidoAEliminar(p); setEliminarModal(true); }}
                              className="p-1 rounded text-brand-secondary hover:text-rose-400 hover:bg-noir-800 transition-colors"
                              title="Eliminar comanda"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Drawer Copiloto IA Cocina */}
        {copilotoOpen && (
          <aside className="w-80 shrink-0 rounded-xl bg-noir-900 border border-gold-400/30 p-5 shadow-obsidian space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-noir-700/80">
              <div className="flex items-center space-x-2 text-gold-400">
                <Bot className="w-4 h-4" />
                <h3 className="font-serif text-sm font-bold tracking-wide">Copiloto IA Cocina</h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gold-400/10 text-gold-400 border border-gold-400/20">
                Heurística
              </span>
            </div>

            {/* Diagnóstico de Cuellos de Botella */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-noir-850 border border-noir-700/70 text-xs">
                <div className="flex items-center space-x-2 text-amber-400 font-mono text-[11px] mb-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Carga Crítica en Parrilla</span>
                </div>
                <p className="text-brand-secondary text-[11px] leading-relaxed">
                  Estación Parrilla al <strong>85%</strong> de capacidad con 6 medallones de autor simultáneos.
                </p>
                <div className="mt-2 text-[10px] font-mono text-gold-400">
                  → Sugerencia: Priorizar pase de Burger Wagyu #104.
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-noir-850 border border-noir-700/70 text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-mono text-[11px] mb-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Pase Térmico Óptimo</span>
                </div>
                <p className="text-brand-secondary text-[11px] leading-relaxed">
                  Tiempo de retención en Rack Despacho: <strong>4.2 min</strong> (SLA máximo: 7 min).
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-noir-850 border border-noir-700/70 text-xs">
                <div className="flex items-center space-x-2 text-gold-400 font-mono text-[11px] mb-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Balanceo de Comandas</span>
                </div>
                <p className="text-brand-secondary text-[11px] leading-relaxed">
                  Canal <strong>Uber Eats</strong> registra +42% de demanda en los últimos 30 min.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-noir-700/60 text-[10px] font-mono text-brand-muted text-center">
              Telemetría recalculada cada 15 segundos.
            </div>
          </aside>
        )}
      </div>

      {/* Modal Crear / Editar Comanda */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-noir-900 border border-gold-400/40 rounded-xl p-6 shadow-obsidian">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-noir-700">
              <h3 className="font-serif text-lg font-bold text-brand-primary">
                {editandoId ? `Editar Comanda (${numeroOrden})` : 'Registrar Nueva Comanda'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-brand-muted hover:text-brand-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-secondary uppercase mb-1">Marca Satélite</label>
                  <select
                    value={marcaId}
                    onChange={(e) => setMarcaId(e.target.value)}
                    required
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  >
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-brand-secondary uppercase mb-1">N° Orden Externa</label>
                  <input
                    type="text"
                    required
                    placeholder="UBER-8921"
                    value={numeroOrden}
                    onChange={(e) => setNumeroOrden(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-secondary uppercase mb-1">Canal / Plataforma</label>
                  <select
                    value={plataforma}
                    onChange={(e) => setPlataforma(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  >
                    {CANALES.filter(c => c !== 'Todos').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-brand-secondary uppercase mb-1">Cliente Receptor</label>
                  <input
                    type="text"
                    required
                    placeholder="Carlos Mendoza"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-secondary uppercase mb-1">Monto Total ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="185.00"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brand-secondary uppercase mb-1">Estado de Pase</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-brand-secondary uppercase mb-1">Instrucciones de Despacho (Opcional)</label>
                <textarea
                  rows="2"
                  placeholder="Empaque térmico triple, entregar en portería..."
                  value={notasEntrega}
                  onChange={(e) => setNotasEntrega(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none font-sans"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-noir-700">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded bg-noir-800 text-brand-secondary hover:text-brand-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2 rounded bg-gold-400 hover:bg-gold-300 text-noir-950 font-bold uppercase tracking-wider shadow-gold-glow"
                >
                  {guardando ? 'Guardando...' : editandoId ? 'Actualizar Comanda' : 'Crear Comanda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {eliminarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-noir-900 border border-rose-500/40 rounded-xl p-6 shadow-obsidian text-xs font-mono">
            <h3 className="font-serif text-lg font-bold text-rose-400 mb-2">
              ¿Eliminar comanda {pedidoAEliminar?.numero_orden}?
            </h3>
            <p className="text-brand-secondary leading-relaxed mb-6">
              Esta acción destruirá el registro de despacho del servidor. ¿Desea continuar?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEliminarModal(false)}
                className="px-4 py-2 rounded bg-noir-800 text-brand-secondary hover:text-brand-primary"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-white font-bold uppercase tracking-wider"
              >
                Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
};

export default DespachoPage;
