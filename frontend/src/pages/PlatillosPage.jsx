import React, { useState, useEffect } from 'react';
import Shell from '../components/layout/Shell';
import { platillosService } from '../services/platillosService';
import { marcasService } from '../services/marcasService';
import {
  ChefHat,
  Plus,
  Clock,
  Edit2,
  Trash2,
  Power,
  Search,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

const PlatillosPage = () => {
  const [platillos, setPlatillos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [marcaId, setMarcaId] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tiempoMin, setTiempoMin] = useState(15);
  const [disponible, setDisponible] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Eliminar Modal
  const [eliminarModal, setEliminarModal] = useState(false);
  const [platilloAEliminar, setPlatilloAEliminar] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [dataPlatillos, dataMarcas] = await Promise.all([
        platillosService.getAll(),
        marcasService.getAll()
      ]);
      setPlatillos(dataPlatillos || []);
      setMarcas(dataMarcas || []);
      if (dataMarcas?.length > 0 && !marcaId) {
        setMarcaId(dataMarcas[0].id);
      }
    } catch (err) {
      setError('Fallo al sincronizar recetas del catálogo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleToggleDisponible = async (p) => {
    try {
      await platillosService.toggleDisponible(p.id, p.disponible);
      cargarDatos();
    } catch (err) {
      setError('Error al cambiar disponibilidad del platillo (86)');
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    setSuccess('');

    const payload = {
      marca_id: Number(marcaId),
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      precio: parseFloat(precio),
      categoria: categoria.trim(),
      tiempo_preparacion_min: parseInt(tiempoMin, 10),
      disponible
    };

    try {
      if (editandoId) {
        await platillosService.update(editandoId, payload);
        setSuccess('Receta actualizada exitosamente.');
      } else {
        await platillosService.create(payload);
        setSuccess('Nueva receta estandarizada en el menú.');
      }
      setModalOpen(false);
      limpiarForm();
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.mensaje || 'Error al guardar platillo.';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  const limpiarForm = () => {
    setEditandoId(null);
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria('');
    setTiempoMin(15);
    setDisponible(true);
    if (marcas.length > 0) setMarcaId(marcas[0].id);
  };

  const abrirEditar = (p) => {
    setEditandoId(p.id);
    setMarcaId(p.marca_id);
    setNombre(p.nombre);
    setDescripcion(p.descripcion || '');
    setPrecio(p.precio);
    setCategoria(p.categoria);
    setTiempoMin(p.tiempo_preparacion_min);
    setDisponible(p.disponible);
    setModalOpen(true);
  };

  const confirmarEliminar = async () => {
    if (!platilloAEliminar) return;
    setError('');
    setSuccess('');
    try {
      await platillosService.delete(platilloAEliminar.id);
      setSuccess(`Platillo '${platilloAEliminar.nombre}' eliminado del catálogo.`);
      setEliminarModal(false);
      setPlatilloAEliminar(null);
      cargarDatos();
    } catch (err) {
      setError('Error al eliminar platillo');
      setEliminarModal(false);
    }
  };

  const platillosFiltrados = platillos.filter((p) =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.marca?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Shell title="Catálogo Maestro de Recetas" subtitle="Fichas Técnicas & Menús Satélite">
      {/* Alertas */}
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

      {/* Barra de Acciones y Búsqueda */}
      <div className="p-4 rounded-xl bg-noir-900 border border-noir-700/80 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por receta, marca o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-noir-950 border border-noir-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-brand-primary placeholder:text-noir-500 focus:outline-none focus:border-gold-400 font-mono"
          />
        </div>

        <button
          onClick={() => { limpiarForm(); setModalOpen(true); }}
          className="px-4 py-2 rounded-lg bg-gold-400 hover:bg-gold-300 text-noir-950 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-gold-glow flex items-center space-x-1.5 shrink-0 active:scale-95 duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Ficha de Receta</span>
        </button>
      </div>

      {/* Tabla Densa de Platillos */}
      <div className="rounded-xl bg-noir-900 border border-noir-700/80 overflow-hidden shadow-obsidian">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-noir-700/80 bg-noir-850 text-brand-muted uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">ID</th>
                <th className="py-3.5 px-4 font-semibold">Receta / Creación</th>
                <th className="py-3.5 px-4 font-semibold">Marca Asignada</th>
                <th className="py-3.5 px-4 font-semibold">Categoría</th>
                <th className="py-3.5 px-4 font-semibold">Precio Venta</th>
                <th className="py-3.5 px-4 font-semibold">Tiempo Pase</th>
                <th className="py-3.5 px-4 font-semibold">Disponibilidad (86)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noir-800">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-brand-muted font-mono">
                    Cargando fichas técnicas desde MySQL...
                  </td>
                </tr>
              ) : platillosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-brand-muted font-mono">
                    No se encontraron recetas con el filtro actual.
                  </td>
                </tr>
              ) : (
                platillosFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-noir-850/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-brand-primary">
                      #{p.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-brand-primary text-sm">
                        {p.nombre}
                      </div>
                      {p.descripcion && (
                        <div className="text-[11px] text-brand-muted font-sans line-clamp-1 max-w-sm mt-0.5">
                          {p.descripcion}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gold-400 font-serif font-semibold text-xs">
                        {p.marca?.nombre || `Marca #${p.marca_id}`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-brand-secondary">
                      <span className="px-2 py-0.5 rounded bg-noir-800 border border-noir-700 text-[10px]">
                        {p.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-serif font-bold text-brand-primary tabular-nums text-sm">
                      ${Number(p.precio).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-brand-secondary tabular-nums">
                      {p.tiempo_preparacion_min} min
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleDisponible(p)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center space-x-1 transition-colors ${
                          p.disponible
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{p.disponible ? 'Disponible' : '86 (Agotado)'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => abrirEditar(p)}
                        className="p-1 rounded text-brand-secondary hover:text-gold-400 hover:bg-noir-800 transition-colors"
                        title="Editar receta"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setPlatilloAEliminar(p); setEliminarModal(true); }}
                        className="p-1 rounded text-brand-secondary hover:text-rose-400 hover:bg-noir-800 transition-colors"
                        title="Eliminar receta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Receta */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-backdrop-enter">
          <div className="w-full max-w-lg bg-noir-900 border border-gold-400/40 rounded-xl p-6 shadow-obsidian animate-modal-enter">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-noir-700">
              <h3 className="font-serif text-lg font-bold text-brand-primary">
                {editandoId ? `Editar Receta (${nombre})` : 'Estandarizar Nueva Receta'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-brand-muted hover:text-brand-primary active:scale-95 transition-transform duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-secondary uppercase mb-1">Marca Asignada (FK)</label>
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
                  <label className="block text-brand-secondary uppercase mb-1">Nombre de la Receta</label>
                  <input
                    type="text"
                    required
                    placeholder="Tartelette Noire 70%"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-secondary uppercase mb-1">Categoría</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Patisserie, Smash, Entradas"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brand-secondary uppercase mb-1">Precio Unitario ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="18.50"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-secondary uppercase mb-1">Tiempo de Pase (Minutos)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={tiempoMin}
                  onChange={(e) => setTiempoMin(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-secondary uppercase mb-1">Descripción / Ficha de Ingredientes</label>
                <textarea
                  rows="2"
                  placeholder="Detalle de cacao, fermentación, temperaturas de cocción..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-brand-primary focus:border-gold-400 outline-none font-sans"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-brand-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disponible}
                    onChange={(e) => setDisponible(e.target.checked)}
                    className="rounded bg-noir-950 border-noir-700 text-gold-400 focus:ring-0"
                  />
                  <span>Disponible para pase inmediato</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-noir-700">
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
                  {guardando ? 'Guardando...' : editandoId ? 'Actualizar Receta' : 'Estandarizar Receta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {eliminarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-backdrop-enter">
          <div className="w-full max-w-md bg-noir-900 border border-rose-500/40 rounded-xl p-6 shadow-obsidian text-xs font-mono animate-modal-enter">
            <h3 className="font-serif text-lg font-bold text-rose-400 mb-2">
              ¿Eliminar {platilloAEliminar?.nombre}?
            </h3>
            <p className="text-brand-secondary leading-relaxed mb-6">
              Esta acción retirará permanentemente el platillo de la base de datos de MySQL.
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

export default PlatillosPage;
