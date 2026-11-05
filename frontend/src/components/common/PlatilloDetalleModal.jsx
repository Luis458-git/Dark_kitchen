import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { marcasService } from '../../services/marcasService';
import { pedidosService } from '../../services/pedidosService';
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Clock,
  Store,
  Tag,
  CheckCircle2,
  ShieldAlert,
  Lock,
  ArrowRight
} from 'lucide-react';

const PLATAFORMAS = ['Pedido Directo', 'Uber Eats', 'Rappi', 'DiDi Food'];

// Convierte '$18.50' o 18.5 a número
const parsePrecio = (precio) => {
  if (typeof precio === 'number') return precio;
  return parseFloat(String(precio).replace(/[^0-9.]/g, '')) || 0;
};

/**
 * Modal de detalle de platillo con flujo de compra.
 * Al confirmar, registra un Pedido real en POST /api/pedidos.
 *
 * Props:
 *  - item: { nombre, subtitulo, precio, imagen, origen, tag, fermentacion, marca_id? }
 *  - onClose: () => void
 */
const PlatilloDetalleModal = ({ item, onClose }) => {
  const { isAuthenticated, usuario } = useAuth();
  const navigate = useNavigate();

  const [cantidad, setCantidad] = useState(1);
  const [clienteNombre, setClienteNombre] = useState(usuario?.nombre || '');
  const [plataforma, setPlataforma] = useState('Pedido Directo');
  const [notas, setNotas] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [pedidoCreado, setPedidoCreado] = useState(null);

  const precioUnitario = parsePrecio(item?.precio);
  const total = Number((precioUnitario * cantidad).toFixed(2));

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!item) return null;

  // Determina la marca virtual real a la que se asocia el pedido
  const resolverMarcaId = async () => {
    if (item.marca_id) return item.marca_id;
    const marcas = (await marcasService.getAll()) || [];
    if (marcas.length === 0) return null;
    const origen = (item.origen || '').toLowerCase();
    const coincidencia = marcas.find(
      (m) => origen && (m.nombre.toLowerCase().includes(origen) || origen.includes(m.nombre.toLowerCase()))
    );
    const activa = marcas.find((m) => m.activo);
    return (coincidencia || activa || marcas[0]).id;
  };

  const handleComprar = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!clienteNombre.trim()) {
      setError('Indica el nombre del cliente para la comanda.');
      return;
    }

    setEnviando(true);
    try {
      const marcaId = await resolverMarcaId();
      if (!marcaId) {
        setError('No hay marcas virtuales registradas para asociar el pedido.');
        setEnviando(false);
        return;
      }

      const detalle = `${cantidad} x ${item.nombre}`;
      const payload = {
        marca_id: Number(marcaId),
        numero_orden: `WEB-${Date.now().toString().slice(-8)}`,
        plataforma,
        cliente_nombre: clienteNombre.trim(),
        total,
        estado: 'recibido',
        notas_entrega: notas.trim() ? `${detalle} — ${notas.trim()}` : detalle
      };

      const nuevo = await pedidosService.create(payload);
      setPedidoCreado(nuevo || payload);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.mensaje ||
        'No se pudo registrar el pedido.';
      setError(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-noir-900 border border-gold-400/40 rounded-2xl shadow-obsidian grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Columna Imagen */}
        <div className="relative min-h-[260px] md:min-h-full">
          <img src={item.imagen} alt={item.nombre} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/30 to-transparent" />
          {item.tag && (
            <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-noir-950/80 border border-gold-400/40 text-[10px] font-mono text-gold-400 uppercase tracking-wider backdrop-blur-sm">
              {item.tag}
            </span>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-xs font-mono text-gold-400 font-semibold">{item.origen}</span>
            <h3 className="font-serif text-2xl font-bold text-brand-primary leading-tight">{item.nombre}</h3>
          </div>
        </div>

        {/* Columna Información & Compra */}
        <div className="p-6 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">Ficha del Platillo</span>
            <button onClick={onClose} className="text-brand-muted hover:text-brand-primary" aria-label="Cerrar">
              <X className="w-5 h-5" />
            </button>
          </div>

          {pedidoCreado ? (
            /* Confirmación de compra */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-xl font-bold text-brand-primary">Pedido registrado</h4>
              <p className="text-xs text-brand-secondary mt-2 max-w-xs">
                La comanda fue enviada al pase de cocina con estado <strong className="text-gold-400">Recibido</strong>.
              </p>
              <div className="mt-5 w-full p-4 rounded-lg bg-noir-950 border border-noir-700 text-xs font-mono space-y-1.5 text-left">
                <div className="flex justify-between"><span className="text-brand-muted">Orden</span><span className="text-gold-400">{pedidoCreado.numero_orden}</span></div>
                <div className="flex justify-between"><span className="text-brand-muted">Detalle</span><span className="text-brand-primary">{cantidad} x {item.nombre}</span></div>
                <div className="flex justify-between"><span className="text-brand-muted">Canal</span><span className="text-brand-primary">{plataforma}</span></div>
                <div className="flex justify-between"><span className="text-brand-muted">Total</span><span className="text-gold-400 font-bold tabular-nums">${total.toFixed(2)}</span></div>
              </div>
              <div className="mt-6 flex gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg bg-noir-800 hover:bg-noir-700 border border-noir-700 text-xs font-mono text-brand-primary"
                >
                  Seguir explorando
                </button>
                <button
                  onClick={() => navigate('/pedidos')}
                  className="flex-1 py-2.5 rounded-lg bg-gold-400 hover:bg-gold-300 text-noir-950 text-xs font-mono font-bold uppercase tracking-wider shadow-gold-glow"
                >
                  Ver en Despacho
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Descripción */}
              <p className="text-sm text-brand-secondary leading-relaxed font-light">{item.subtitulo}</p>

              {/* Atributos */}
              <div className="grid grid-cols-3 gap-2 mt-5 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-noir-950 border border-noir-800">
                  <Store className="w-3.5 h-3.5 text-gold-400 mb-1" />
                  <span className="text-[10px] text-brand-muted block uppercase">Marca</span>
                  <span className="text-brand-primary truncate block">{item.origen}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-noir-950 border border-noir-800">
                  <Clock className="w-3.5 h-3.5 text-gold-400 mb-1" />
                  <span className="text-[10px] text-brand-muted block uppercase">Pase</span>
                  <span className="text-brand-primary truncate block">{item.fermentacion}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-noir-950 border border-noir-800">
                  <Tag className="w-3.5 h-3.5 text-gold-400 mb-1" />
                  <span className="text-[10px] text-brand-muted block uppercase">Precio</span>
                  <span className="text-gold-400 font-bold tabular-nums block">${precioUnitario.toFixed(2)}</span>
                </div>
              </div>

              {/* Formulario de compra */}
              <form onSubmit={handleComprar} className="mt-5 space-y-3 text-xs font-mono flex-1 flex flex-col">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                {isAuthenticated ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-brand-secondary mb-1">Cliente</label>
                        <input
                          type="text"
                          value={clienteNombre}
                          onChange={(e) => setClienteNombre(e.target.value)}
                          placeholder="Nombre del comensal"
                          className="w-full bg-noir-950 border border-noir-700/80 rounded-lg px-3 py-2 text-brand-primary focus:outline-none focus:border-gold-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-brand-secondary mb-1">Canal</label>
                        <select
                          value={plataforma}
                          onChange={(e) => setPlataforma(e.target.value)}
                          className="w-full bg-noir-950 border border-noir-700/80 rounded-lg px-3 py-2 text-brand-primary focus:outline-none focus:border-gold-400"
                        >
                          {PLATAFORMAS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-brand-secondary mb-1">Notas de entrega (opcional)</label>
                      <input
                        type="text"
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        placeholder="Ej. Sin nueces, tocar timbre 3B"
                        className="w-full bg-noir-950 border border-noir-700/80 rounded-lg px-3 py-2 text-brand-primary focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-3 rounded-lg bg-gold-400/5 border border-gold-400/30 text-gold-300 flex items-start space-x-2">
                    <Lock className="w-4 h-4 shrink-0 text-gold-400" />
                    <span>Inicia sesión como operador para registrar la compra en el sistema de despacho.</span>
                  </div>
                )}

                {/* Cantidad y total */}
                <div className="mt-auto pt-4 border-t border-noir-700/60 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-noir-700 bg-noir-950">
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      className="p-2.5 text-brand-secondary hover:text-gold-400"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-brand-primary font-bold tabular-nums">{cantidad}</span>
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.min(20, c + 1))}
                      className="p-2.5 text-brand-secondary hover:text-gold-400"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-brand-muted uppercase block">Total</span>
                    <span className="text-2xl font-serif font-bold text-gold-400 tabular-nums">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full py-3 rounded-lg bg-gold-400 hover:bg-gold-300 text-noir-950 font-bold uppercase tracking-wider shadow-gold-glow flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isAuthenticated ? <ShoppingBag className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  <span>
                    {enviando ? 'Enviando comanda...' : isAuthenticated ? `Comprar · $${total.toFixed(2)}` : 'Iniciar sesión para comprar'}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatilloDetalleModal;
