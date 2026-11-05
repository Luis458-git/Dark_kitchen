import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import Navbar from '../components/common/Navbar';
import Alert from '../components/common/Alert';
import ConfirmModal from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const PlatillosPage = () => {
  const [platillos, setPlatillos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [editandoId, setEditandoId] = useState(null);
  const [marcaId, setMarcaId] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tiempoMin, setTiempoMin] = useState(15);
  const [disponible, setDisponible] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [platilloAEliminar, setPlatilloAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resPlatillos, resMarcas] = await Promise.all([
        apiClient.get('/platillos'),
        apiClient.get('/marcas')
      ]);
      setPlatillos(resPlatillos.data.data || []);
      setMarcas(resMarcas.data.data || []);
      if (resMarcas.data.data?.length > 0 && !marcaId) {
        setMarcaId(resMarcas.data.data[0].id);
      }
    } catch (err) {
      setError('Error al cargar la información de platillos o marcas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria('');
    setTiempoMin(15);
    setDisponible(true);
    if (marcas.length > 0) setMarcaId(marcas[0].id);
  };

  const handleEditar = (p) => {
    setEditandoId(p.id);
    setMarcaId(p.marca_id);
    setNombre(p.nombre);
    setDescripcion(p.descripcion || '');
    setPrecio(p.precio);
    setCategoria(p.categoria);
    setTiempoMin(p.tiempo_preparacion_min);
    setDisponible(p.disponible);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setGuardando(true);

    const payload = {
      marca_id: Number(marcaId),
      nombre,
      descripcion,
      precio: parseFloat(precio),
      categoria,
      tiempo_preparacion_min: parseInt(tiempoMin, 10),
      disponible
    };

    try {
      if (editandoId) {
        await apiClient.put(`/platillos/${editandoId}`, payload);
        setSuccess('Platillo actualizado exitosamente');
      } else {
        await apiClient.post('/platillos', payload);
        setSuccess('Platillo creado exitosamente');
      }
      limpiarFormulario();
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.mensaje || 'Error al guardar el platillo';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  const solicitarEliminar = (p) => {
    setPlatilloAEliminar(p);
    setModalOpen(true);
  };

  const confirmarEliminar = async () => {
    if (!platilloAEliminar) return;
    setError('');
    setSuccess('');
    setEliminando(true);

    try {
      await apiClient.delete(`/platillos/${platilloAEliminar.id}`);
      setSuccess(`Platillo '${platilloAEliminar.nombre}' eliminado correctamente`);
      setModalOpen(false);
      setPlatilloAEliminar(null);
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar el platillo';
      setError(msg);
      setModalOpen(false);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Alert type="danger" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        {/* Formulario */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {editandoId ? `Editar Platillo (ID: ${editandoId})` : 'Registrar Nuevo Platillo en Menú'}
            </h2>
            {editandoId && (
              <button className="btn-secondary" onClick={limpiarFormulario}>
                Cancelar Edición
              </button>
            )}
          </div>

          {marcas.length === 0 ? (
            <p style={{ color: '#ea580c' }}>
              ⚠️ Debe registrar al menos una Marca Virtual antes de poder crear platillos.
            </p>
          ) : (
            <form onSubmit={handleGuardar}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Marca Virtual Asignada (Clave Foránea)</label>
                  <select
                    className="form-control"
                    value={marcaId}
                    onChange={(e) => setMarcaId(e.target.value)}
                    required
                  >
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} ({m.tipo_cocina})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Nombre del Platillo</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ej. Hamburguesa Doble Queso"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoría</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ej. Entradas, Fuertes, Bebidas"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Precio Unitario ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="form-control"
                    placeholder="0.00"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tiempo Preparación (minutos)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={tiempoMin}
                    onChange={(e) => setTiempoMin(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.2rem' }}>
                    <input
                      type="checkbox"
                      checked={disponible}
                      onChange={(e) => setDisponible(e.target.checked)}
                    />
                    <span>Disponible en Cocina</span>
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Descripción de Ingredientes (opcional)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Detalle de preparación, ingredientes principales..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={guardando}>
                <Plus size={18} />
                <span>{guardando ? 'Guardando...' : editandoId ? 'Actualizar Platillo' : 'Crear Platillo'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Tabla */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Catálogo de Platillos ({platillos.length})</h2>
          </div>

          {loading ? (
            <p>Cargando registros...</p>
          ) : platillos.length === 0 ? (
            <p style={{ color: '#64748b' }}>No hay platillos registrados aún.</p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Platillo</th>
                    <th>Marca Asociada</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Prep.</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {platillos.map((p) => (
                    <tr key={p.id}>
                      <td><strong>#{p.id}</strong></td>
                      <td>
                        <strong>{p.nombre}</strong>
                        {p.descripcion && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.descripcion}</div>}
                      </td>
                      <td>
                        <span className="badge badge-info">{p.marca?.nombre || `ID: ${p.marca_id}`}</span>
                      </td>
                      <td>{p.categoria}</td>
                      <td><strong>${Number(p.precio).toFixed(2)}</strong></td>
                      <td>{p.tiempo_preparacion_min} min</td>
                      <td>
                        {p.disponible ? (
                          <span className="badge badge-success">Disponible</span>
                        ) : (
                          <span className="badge badge-danger">Agotado</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEditar(p)}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => solicitarEliminar(p)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={modalOpen}
        title="¿Eliminar Platillo?"
        message={`¿Está seguro de que desea eliminar el platillo '${platilloAEliminar?.nombre}' del menú?`}
        onConfirm={confirmarEliminar}
        onCancel={() => setModalOpen(false)}
        loading={eliminando}
      />
    </div>
  );
};

export default PlatillosPage;
