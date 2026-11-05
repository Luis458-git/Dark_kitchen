import React, { useState, useEffect } from 'react';
import Shell from '../components/layout/Shell';
import { marcasService } from '../services/marcasService';
import {
  Store,
  Plus,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Power,
  Layers,
  ChefHat,
  X,
  AlertTriangle,
  Flame
} from 'lucide-react';

const MarcasPage = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal Crear / Editar
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [tipoCocina, setTipoCocina] = useState('');
  const [horarioApertura, setHorarioApertura] = useState('11:00');
  const [horarioCierre, setHorarioCierre] = useState('23:00');
  const [activo, setActivo] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Modal Confirmar Eliminar
  const [eliminarModal, setEliminarModal] = useState(false);
  const [marcaAEliminar, setMarcaAEliminar] = useState(null);

  const cargarMarcas = async () => {
    try {
      setLoading(true);
      const data = await marcasService.getAll();
      setMarcas(data || []);
    } catch (err) {
      setError('Fallo al sincronizar marcas satélite.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMarcas();
  }, []);

  const handleToggleActivo = async (m) => {
    try {
      await marcasService.toggleActivo(m.id, m.activo);
      cargarMarcas();
    } catch (err) {
      setError('Error al cambiar el estado de la marca');
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    setSuccess('');

    const payload = {
      nombre: nombre.trim(),
      tipo_cocina: tipoCocina.trim(),
      horario_apertura: horarioApertura,
      horario_cierre: horarioCierre,
      activo
    };

    try {
      if (editandoId) {
        await marcasService.update(editandoId, payload);
        setSuccess('Marca satélite actualizada correctamente.');
      } else {
        await marcasService.create(payload);
        setSuccess('Nueva marca satélite registrada en el nodo.');
      }
      setModalOpen(false);
      limpiarForm();
      cargarMarcas();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.mensaje || 'Error al guardar marca.';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  const limpiarForm = () => {
    setEditandoId(null);
    setNombre('');
    setTipoCocina('');
    setHorarioApertura('11:00');
    setHorarioCierre('23:00');
    setActivo(true);
  };

  const abrirEditar = (m) => {
    setEditandoId(m.id);
    setNombre(m.nombre);
    setTipoCocina(m.tipo_cocina);
    setHorarioApertura(m.horario_apertura?.slice(0, 5) || '11:00');
    setHorarioCierre(m.horario_cierre?.slice(0, 5) || '23:00');
    setActivo(m.activo);
    setModalOpen(true);
  };

  const confirmarEliminar = async () => {
    if (!marcaAEliminar) return;
    setError('');
    setSuccess('');
    try {
      await marcasService.delete(marcaAEliminar.id);
      setSuccess(`Marca '${marcaAEliminar.nombre}' eliminada.`);
      setEliminarModal(false);
      setMarcaAEliminar(null);
      cargarMarcas();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar la marca virtual';
      setError(msg);
      setEliminarModal(false);
    }
  };

  const activasCount = marcas.filter((m) => m.activo).length;

  return (
    <Shell title="Gestión de Marcas Satélite" subtitle="Ecosistema Virtual & Conceptos">
      {/* Mensajes */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Métricas de Satélites */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div
          style={{ animationDelay: '0ms' }}
          className="p-5 rounded-xl bg-noir-900 border border-noir-700/80 animate-card-enter card-hover-elevation"
        >
          <div className="flex items-center justify-between text-brand-muted text-xs font-mono uppercase">
            <span>Marcas Totales</span>
            <Store className="w-4 h-4 text-gold-400" />
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-brand-primary tabular-nums">
            {String(marcas.length).padStart(2, '0')}
          </div>
          <div className="mt-2 text-[11px] font-mono text-brand-secondary">
            Conceptos en el clúster
          </div>
        </div>

        <div
          style={{ animationDelay: '45ms' }}
          className="p-5 rounded-xl bg-noir-900 border border-noir-700/80 animate-card-enter card-hover-elevation"
        >
          <div className="flex items-center justify-between text-brand-muted text-xs font-mono uppercase">
            <span>Satélites en Servicio</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-emerald-400 tabular-nums">
            {String(activasCount).padStart(2, '0')}
          </div>
          <div className="mt-2 text-[11px] font-mono text-emerald-400/80">
            Recepción de pedidos habilitada
          </div>
        </div>

        <div
          style={{ animationDelay: '90ms' }}
          className="p-5 rounded-xl bg-noir-900 border border-noir-700/80 animate-card-enter card-hover-elevation"
        >
          <div className="flex items-center justify-between text-brand-muted text-xs font-mono uppercase">
            <span>Recetas Maestras</span>
            <ChefHat className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-amber-400 tabular-nums">
            142
          </div>
          <div className="mt-2 text-[11px] font-mono text-brand-secondary">
            Estandarizadas en KDS
          </div>
        </div>
      </div>

      {/* Barra de Acciones */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-brand-primary">Marcas Virtuales Registradas</h3>
          <p className="text-xs font-mono text-brand-secondary mt-0.5">Control de horarios de servicio, especialidad y despacho.</p>
        </div>

        <button
          onClick={() => { limpiarForm(); setModalOpen(true); }}
          className="px-4 py-2 rounded-lg bg-gold-400 hover:bg-gold-300 text-noir-950 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-gold-glow flex items-center space-x-1.5 active:scale-95 duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Marca Satélite</span>
        </button>
      </div>

      {/* Grid de Tarjetas de Marcas */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-brand-muted">
          Cargando marcas satélite desde MySQL...
        </div>
      ) : marcas.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-brand-muted border border-dashed border-noir-700 rounded-xl">
          No hay marcas registradas. Pulsa en "Nueva Marca Satélite" para comenzar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marcas.map((m, idx) => (
            <div
              key={m.id}
              style={{ animationDelay: `${(idx + 3) * 45}ms` }}
              className={`p-6 rounded-xl bg-noir-900 border transition-all duration-300 flex flex-col justify-between animate-card-enter card-hover-elevation ${
                m.activo ? 'border-noir-700 hover:border-gold-400/50' : 'border-rose-500/20 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-noir-800 border border-noir-700 text-gold-400">
                    ID #{m.id}
                  </span>
                  <button
                    onClick={() => handleToggleActivo(m)}
                    className={`px-2 py-0.5 rounded flex items-center space-x-1 transition-all active:scale-95 duration-150 ${
                      m.activo
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{m.activo ? 'En Servicio' : 'En Pausa'}</span>
                  </button>
                </div>

                <h4 className="font-serif text-xl font-bold text-brand-primary mb-1">
                  {m.nombre}
                </h4>
                <p className="text-xs font-mono text-brand-secondary mb-4">
                  Especialidad: <span className="text-brand-primary">{m.tipo_cocina}</span>
                </p>

                <div className="p-3 rounded-lg bg-noir-850 border border-noir-700/60 text-xs font-mono space-y-1.5 text-brand-muted">
                  <div className="flex items-center justify-between">
                    <span>Horario Operativo:</span>
                    <span className="text-brand-secondary tabular-nums">
                      {m.horario_apertura?.slice(0, 5)} - {m.horario_cierre?.slice(0, 5)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SLA Promedio:</span>
                    <span className="text-emerald-400 font-semibold tabular-nums">14.5 min</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-noir-700/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-muted">
                  Sincronizado MySQL
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => abrirEditar(m)}
                    className="p-1.5 rounded bg-noir-800 hover:bg-noir-700 text-brand-secondary hover:text-gold-400 transition-all active:scale-95 duration-150"
                    title="Editar marca"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setMarcaAEliminar(m); setEliminarModal(true); }}
                    className="p-1.5 rounded bg-noir-800 hover:bg-rose-500/10 text-brand-secondary hover:text-rose-400 transition-all active:scale-95 duration-150"
                    title="Eliminar marca"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear / Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-backdrop-enter">
          <div className="w-full max-w-lg bg-noir-900 border border-gold-400/40 rounded-xl p-6 shadow-obsidian animate-modal-enter">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-noir-700">
              <h3 className="font-serif text-lg font-bold text-brand-primary">
                {editandoId ? `Editar Marca (${nombre})` : 'Registrar Marca Satélite'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-brand-muted hover:text-brand-primary active:scale-95 transition-transform duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-brand-secondary uppercase mb-1">Nombre Comercial de la Marca</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Smash Burger Co., Maison Noire"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-secondary uppercase mb-1">Tipo de Cocina / Especialidad</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Hamburguesas Gourmet, Repostería Fina"
                  value={tipoCocina}
                  onChange={(e) => setTipoCocina(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-secondary uppercase mb-1">Horario Apertura</label>
                  <input
                    type="time"
                    required
                    value={horarioApertura}
                    onChange={(e) => setHorarioApertura(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brand-secondary uppercase mb-1">Horario Cierre</label>
                  <input
                    type="time"
                    required
                    value={horarioCierre}
                    onChange={(e) => setHorarioCierre(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-brand-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                    className="rounded bg-noir-950 border-noir-700 text-gold-400 focus:ring-0"
                  />
                  <span>Habilitar para recepción inmediata de comandas</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-noir-700">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded bg-noir-800 text-brand-secondary hover:text-brand-primary active:scale-95 transition-all duration-150"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2 rounded bg-gold-400 hover:bg-gold-300 text-noir-950 font-bold uppercase tracking-wider shadow-gold-glow active:scale-95 transition-all duration-150 disabled:opacity-50"
                >
                  {guardando ? 'Guardando...' : editandoId ? 'Actualizar Satélite' : 'Registrar Marca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar con Alerta 409 */}
      {eliminarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-backdrop-enter">
          <div className="w-full max-w-md bg-noir-900 border border-rose-500/40 rounded-xl p-6 shadow-obsidian text-xs font-mono animate-modal-enter">
            <div className="flex items-center space-x-2 text-rose-400 mb-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif text-lg font-bold">¿Eliminar {marcaAEliminar?.nombre}?</h3>
            </div>
            <p className="text-brand-secondary leading-relaxed mb-6">
              Esta acción verificará la integridad referencial en el backend. Si la marca posee platillos en el menú o comandas asociadas, el servidor responderá con código <strong>409 Conflict</strong> para proteger la base de datos.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEliminarModal(false)}
                className="px-4 py-2 rounded bg-noir-800 text-brand-secondary hover:text-brand-primary active:scale-95 transition-all duration-150"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-white font-bold uppercase tracking-wider active:scale-95 transition-all duration-150"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
};

export default MarcasPage;
