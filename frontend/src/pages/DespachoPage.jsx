import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import Navbar from '../components/common/Navbar';
import Alert from '../components/common/Alert';
import ConfirmModal from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const ESTADOS = [
  { value: 'recibido', label: 'Recibido', badge: 'badge-warning' },
  { value: 'en_preparacion', label: 'En Preparación', badge: 'badge-info' },
  { value: 'listo_para_despacho', label: 'Listo para Despacho', badge: 'badge-success' },
  { value: 'entregado', label: 'Entregado al Repartidor', badge: 'badge-success' },
  { value: 'cancelado', label: 'Cancelado', badge: 'badge-danger' }
];

const PLATAFORMAS = ['Uber Eats', 'Rappi', 'Didi Food', 'PedidosYa', 'Venta Telefónica Directa'];

const DespachoPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [editandoId, setEditandoId] = useState(null);
  const [marcaId, setMarcaId] = useState('');
  const [numeroOrden, setNumeroOrden] = useState('');
  const [plataforma, setPlataforma] = useState(PLATAFORMAS[0]);
  const [clienteNombre, setClienteNombre] = useState('');
  const [total, setTotal] = useState('');
  const [estado, setEstado] = useState('recibido');
  const [notasEntrega, setNotasEntrega] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resPedidos, resMarcas] = await Promise.all([
        apiClient.get('/pedidos'),
        apiClient.get('/marcas')
      ]);
      setPedidos(resPedidos.data.data || []);
      setMarcas(resMarcas.data.data || []);
      if (resMarcas.data.data?.length > 0 && !marcaId) {
        setMarcaId(resMarcas.data.data[0].id);
      }
    } catch (err) {
      setError('Error al cargar la información de pedidos o marcas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNumeroOrden('');
    setPlataforma(PLATAFORMAS[0]);
    setClienteNombre('');
    setTotal('');
    setEstado('recibido');
    setNotasEntrega('');
    if (marcas.length > 0) setMarcaId(marcas[0].id);
  };

  const handleEditar = (p) => {
    setEditandoId(p.id);
    setMarcaId(p.marca_id);
    setNumeroOrden(p.numero_orden);
    setPlataforma(p.plataforma);
    setClienteNombre(p.cliente_nombre);
    setTotal(p.total);
    setEstado(p.estado);
    setNotasEntrega(p.notas_entrega || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setGuardando(true);

    const payload = {
      marca_id: Number(marcaId),
      numero_orden: numeroOrden,
      plataforma,
      cliente_nombre: clienteNombre,
      total: parseFloat(total),
      estado,
      notas_entrega: notasEntrega
    };

    try {
      if (editandoId) {
        await apiClient.put(`/pedidos/${editandoId}`, payload);
        setSuccess('Comanda / Pedido actualizado exitosamente');
      } else {
        await apiClient.post('/pedidos', payload);
        setSuccess('Comanda / Pedido registrado exitosamente');
      }
      limpiarFormulario();
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.mensaje || 'Error al guardar el pedido';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  const solicitarEliminar = (p) => {
    setPedidoAEliminar(p);
    setModalOpen(true);
  };

  const confirmarEliminar = async () => {
    if (!pedidoAEliminar) return;
    setError('');
    setSuccess('');
    setEliminando(true);

    try {
      await apiClient.delete(`/pedidos/${pedidoAEliminar.id}`);
      setSuccess(`Comanda '${pedidoAEliminar.numero_orden}' eliminada correctamente`);
      setModalOpen(false);
      setPedidoAEliminar(null);
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar el pedido';
      setError(msg);
      setModalOpen(false);
    } finally {
      setEliminando(false);
    }
  };

  const obtenerBadgeEstado = (val) => {
    const est = ESTADOS.find((e) => e.value === val);
    return est ? est.badge : 'badge-info';
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
              {editandoId ? `Editar Comanda (ID: ${editandoId})` : 'Registrar Nueva Comanda de Despacho'}
            </h2>
            {editandoId && (
              <button className="btn-secondary" onClick={limpiarFormulario}>
                Cancelar Edición
              </button>
            )}
          </div>

          {marcas.length === 0 ? (
            <p style={{ color: '#ea580c' }}>
              ⚠️ Debe registrar al menos una Marca Virtual antes de poder registrar pedidos.
            </p>
          ) : (
            <form onSubmit={handleGuardar}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Marca Virtual Asignada</label>
                  <select
                    className="form-control"
                    value={marcaId}
                    onChange={(e) => setMarcaId(e.target.value)}
                    required
                  >
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>N° Orden Externa</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ej. UBER-8921, RAPPI-104"
                    value={numeroOrden}
                    onChange={(e) => setNumeroOrden(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Canal / Plataforma</label>
                  <select
                    className="form-control"
                    value={plataforma}
                    onChange={(e) => setPlataforma(e.target.value)}
                    required
                  >
                    {PLATAFORMAS.map((plat) => (
                      <option key={plat} value={plat}>
                        {plat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Nombre del Cliente</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ej. Laura Sánchez"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total del Pedido ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    placeholder="0.00"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Estado Operativo</label>
                  <select
                    className="form-control"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  >
                    {ESTADOS.map((est) => (
                      <option key={est.value} value={est.value}>
                        {est.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Notas de Entrega o Instrucciones al Repartidor (opcional)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Detalle de dirección, timbre, observaciones..."
                  value={notasEntrega}
                  onChange={(e) => setNotasEntrega(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={guardando}>
                <Plus size={18} />
                <span>{guardando ? 'Guardando...' : editandoId ? 'Actualizar Comanda' : 'Crear Comanda'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Tabla */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Comandas en Curso y Despachos ({pedidos.length})</h2>
          </div>

          {loading ? (
            <p>Cargando registros...</p>
          ) : pedidos.length === 0 ? (
            <p style={{ color: '#64748b' }}>No hay pedidos registrados aún.</p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>N° Orden</th>
                    <th>Marca</th>
                    <th>Canal</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((ped) => (
                    <tr key={ped.id}>
                      <td><strong>{ped.numero_orden}</strong></td>
                      <td>
                        <span className="badge badge-info">{ped.marca?.nombre || `ID: ${ped.marca_id}`}</span>
                      </td>
                      <td>{ped.plataforma}</td>
                      <td>{ped.cliente_nombre}</td>
                      <td><strong>${Number(ped.total).toFixed(2)}</strong></td>
                      <td>
                        <span className={`badge ${obtenerBadgeEstado(ped.estado)}`}>
                          {ped.estado}
                        </span>
                      </td>
                      <td>{new Date(ped.fecha_pedido || ped.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEditar(ped)}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => solicitarEliminar(ped)}
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
        title="¿Eliminar Comanda?"
        message={`¿Está seguro de que desea eliminar la comanda '${pedidoAEliminar?.numero_orden}'?`}
        onConfirm={confirmarEliminar}
        onCancel={() => setModalOpen(false)}
        loading={eliminando}
      />
    </div>
  );
};

export default DespachoPage;
