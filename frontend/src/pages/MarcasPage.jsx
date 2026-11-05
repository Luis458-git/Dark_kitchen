import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import Navbar from '../components/common/Navbar';
import Alert from '../components/common/Alert';
import ConfirmModal from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const MarcasPage = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [tipoCocina, setTipoCocina] = useState('');
  const [horarioApertura, setHorarioApertura] = useState('11:00');
  const [horarioCierre, setHorarioCierre] = useState('23:00');
  const [activo, setActivo] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [marcaAEliminar, setMarcaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarMarcas = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/marcas');
      setMarcas(res.data.data || []);
    } catch (err) {
      setError('Error al cargar las marcas virtuales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMarcas();
  }, []);

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
    setTipoCocina('');
    setHorarioApertura('11:00');
    setHorarioCierre('23:00');
    setActivo(true);
  };

  const handleEditar = (marca) => {
    setEditandoId(marca.id);
    setNombre(marca.nombre);
    setTipoCocina(marca.tipo_cocina);
    setHorarioApertura(marca.horario_apertura?.slice(0, 5) || '11:00');
    setHorarioCierre(marca.horario_cierre?.slice(0, 5) || '23:00');
    setActivo(marca.activo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setGuardando(true);

    const payload = {
      nombre,
      tipo_cocina: tipoCocina,
      horario_apertura: horarioApertura,
      horario_cierre: horarioCierre,
      activo
    };

    try {
      if (editandoId) {
        await apiClient.put(`/marcas/${editandoId}`, payload);
        setSuccess('Marca virtual actualizada exitosamente');
      } else {
        await apiClient.post('/marcas', payload);
        setSuccess('Marca virtual creada exitosamente');
      }
      limpiarFormulario();
      cargarMarcas();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.mensaje || 'Error al guardar la marca';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  const solicitarEliminar = (marca) => {
    setMarcaAEliminar(marca);
    setModalOpen(true);
  };

  const confirmarEliminar = async () => {
    if (!marcaAEliminar) return;
    setError('');
    setSuccess('');
    setEliminando(true);

    try {
      await apiClient.delete(`/marcas/${marcaAEliminar.id}`);
      setSuccess(`Marca '${marcaAEliminar.nombre}' eliminada correctamente`);
      setModalOpen(false);
      setMarcaAEliminar(null);
      cargarMarcas();
    } catch (err) {
      // Manejar código 409 Conflict por dependencias
      const msg = err.response?.data?.message || 'Error al eliminar la marca virtual';
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

        {/* Formulario Crear / Editar */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {editandoId ? `Editar Marca Virtual (ID: ${editandoId})` : 'Registrar Nueva Marca Virtual'}
            </h2>
            {editandoId && (
              <button className="btn-secondary" onClick={limpiarFormulario}>
                Cancelar Edición
              </button>
            )}
          </div>

          <form onSubmit={handleGuardar}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre de la Marca</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ej. Burger Ghost, Taco Central"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo de Cocina</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ej. Hamburguesas, Mexicana, Sushi"
                  value={tipoCocina}
                  onChange={(e) => setTipoCocina(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Horario Apertura</label>
                <input
                  type="time"
                  className="form-control"
                  value={horarioApertura}
                  onChange={(e) => setHorarioApertura(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Horario Cierre</label>
                <input
                  type="time"
                  className="form-control"
                  value={horarioCierre}
                  onChange={(e) => setHorarioCierre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.2rem' }}>
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                  />
                  <span>Marca Operativa (Activa)</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={guardando}>
              <Plus size={18} />
              <span>{guardando ? 'Guardando...' : editandoId ? 'Actualizar Marca' : 'Crear Marca Virtual'}</span>
            </button>
          </form>
        </div>

        {/* Tabla de Listado */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Marcas Registradas ({marcas.length})</h2>
          </div>

          {loading ? (
            <p>Cargando registros...</p>
          ) : marcas.length === 0 ? (
            <p style={{ color: '#64748b' }}>No hay marcas virtuales registradas aún.</p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Horario</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {marcas.map((m) => (
                    <tr key={m.id}>
                      <td><strong>#{m.id}</strong></td>
                      <td>{m.nombre}</td>
                      <td>{m.tipo_cocina}</td>
                      <td>{m.horario_apertura?.slice(0, 5)} - {m.horario_cierre?.slice(0, 5)}</td>
                      <td>
                        {m.activo ? (
                          <span className="badge badge-success">Activa</span>
                        ) : (
                          <span className="badge badge-danger">Inactiva</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEditar(m)}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => solicitarEliminar(m)}
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
        title="¿Eliminar Marca Virtual?"
        message={`¿Está seguro de que desea eliminar la marca '${marcaAEliminar?.nombre}'? Esta acción no se puede deshacer y fallará si tiene platillos o pedidos asociados.`}
        onConfirm={confirmarEliminar}
        onCancel={() => setModalOpen(false)}
        loading={eliminando}
      />
    </div>
  );
};

export default MarcasPage;
