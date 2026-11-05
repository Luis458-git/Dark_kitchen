const { Pedido, MarcaVirtual } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const ESTADOS_VALIDOS = ['recibido', 'en_preparacion', 'listo_para_despacho', 'entregado', 'cancelado'];

const validarPedido = (body, esEdicion = false) => {
  const errores = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    errores.push({ campo: 'body', mensaje: 'El cuerpo de la petición debe ser un objeto JSON' });
    return errores;
  }

  if (!esEdicion || body.marca_id !== undefined) {
    if (body.marca_id === undefined || body.marca_id === null || isNaN(Number(body.marca_id))) {
      errores.push({ campo: 'marca_id', mensaje: "El campo 'marca_id' es obligatorio y debe ser numérico" });
    }
  }

  if (!esEdicion || body.numero_orden !== undefined) {
    if (!body.numero_orden || typeof body.numero_orden !== 'string' || body.numero_orden.trim() === '') {
      errores.push({ campo: 'numero_orden', mensaje: "El campo 'numero_orden' es obligatorio" });
    }
  }

  if (!esEdicion || body.plataforma !== undefined) {
    if (!body.plataforma || typeof body.plataforma !== 'string' || body.plataforma.trim() === '') {
      errores.push({ campo: 'plataforma', mensaje: "El campo 'plataforma' es obligatorio (ej. Uber Eats, Rappi, Didi)" });
    }
  }

  if (!esEdicion || body.cliente_nombre !== undefined) {
    if (!body.cliente_nombre || typeof body.cliente_nombre !== 'string' || body.cliente_nombre.trim() === '') {
      errores.push({ campo: 'cliente_nombre', mensaje: "El campo 'cliente_nombre' es obligatorio" });
    }
  }

  if (!esEdicion || body.total !== undefined) {
    const totalNum = Number(body.total);
    if (body.total === undefined || body.total === null || isNaN(totalNum) || totalNum < 0) {
      errores.push({ campo: 'total', mensaje: "El campo 'total' es obligatorio y no puede ser negativo" });
    }
  }

  if (body.estado !== undefined) {
    if (!ESTADOS_VALIDOS.includes(body.estado)) {
      errores.push({
        campo: 'estado',
        mensaje: `Estado no válido. Opciones permitidas: ${ESTADOS_VALIDOS.join(', ')}`
      });
    }
  }

  return errores;
};

// GET /api/pedidos — Listar pedidos con Eager Loading
const listarPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: MarcaVirtual,
          as: 'marca',
          attributes: ['id', 'nombre', 'tipo_cocina']
        }
      ],
      order: [['fecha_pedido', 'DESC']]
    });

    return successResponse(res, 200, 'Pedidos obtenidos correctamente', pedidos);
  } catch (error) {
    return next(error);
  }
};

// GET /api/pedidos/:id — Consultar pedido por ID
const obtenerPedidoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: MarcaVirtual,
          as: 'marca',
          attributes: ['id', 'nombre', 'tipo_cocina']
        }
      ]
    });

    if (!pedido) {
      return errorResponse(res, 404, `No se encontró el pedido con ID ${id}`);
    }

    return successResponse(res, 200, 'Pedido obtenido correctamente', pedido);
  } catch (error) {
    return next(error);
  }
};

// POST /api/pedidos — Crear comanda de despacho
const crearPedido = async (req, res, next) => {
  try {
    const errores = validarPedido(req.body);
    if (errores.length > 0) {
      return errorResponse(res, 400, 'Error de validación en los datos enviados', errores);
    }

    const { marca_id, numero_orden, plataforma, cliente_nombre, total, estado, notas_entrega } = req.body;

    // RF-07: Comprobar existencia de la marca asociada
    const marcaExiste = await MarcaVirtual.findByPk(marca_id);
    if (!marcaExiste) {
      return errorResponse(res, 400, `La marca referenciada con ID ${marca_id} no existe en el sistema`);
    }

    // Comprobar si numero_orden ya existe
    const ordenDuplicada = await Pedido.findOne({ where: { numero_orden: numero_orden.trim() } });
    if (ordenDuplicada) {
      return errorResponse(res, 400, `El número de orden '${numero_orden}' ya está registrado en el sistema`);
    }

    const nuevoPedido = await Pedido.create({
      marca_id,
      numero_orden: numero_orden.trim(),
      plataforma: plataforma.trim(),
      cliente_nombre: cliente_nombre.trim(),
      total: Number(total),
      estado: estado ? estado.trim() : 'recibido',
      notas_entrega: notas_entrega ? notas_entrega.trim() : null
    });

    const pedidoConMarca = await Pedido.findByPk(nuevoPedido.id, {
      include: [{ model: MarcaVirtual, as: 'marca', attributes: ['id', 'nombre'] }]
    });

    return successResponse(res, 201, 'Pedido registrado exitosamente', pedidoConMarca);
  } catch (error) {
    return next(error);
  }
};

// PUT /api/pedidos/:id — Actualizar comanda / estado
const actualizarPedido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      return errorResponse(res, 404, `No se encontró el pedido con ID ${id}`);
    }

    const errores = validarPedido(req.body, true);
    if (errores.length > 0) {
      return errorResponse(res, 400, 'Error de validación en los datos enviados', errores);
    }

    const { marca_id, numero_orden, plataforma, cliente_nombre, total, estado, notas_entrega } = req.body;

    if (marca_id !== undefined) {
      const marcaExiste = await MarcaVirtual.findByPk(marca_id);
      if (!marcaExiste) {
        return errorResponse(res, 400, `La marca referenciada con ID ${marca_id} no existe en el sistema`);
      }
    }

    await pedido.update({
      ...(marca_id !== undefined && { marca_id: Number(marca_id) }),
      ...(numero_orden !== undefined && { numero_orden: numero_orden.trim() }),
      ...(plataforma !== undefined && { plataforma: plataforma.trim() }),
      ...(cliente_nombre !== undefined && { cliente_nombre: cliente_nombre.trim() }),
      ...(total !== undefined && { total: Number(total) }),
      ...(estado !== undefined && { estado: estado.trim() }),
      ...(notas_entrega !== undefined && { notas_entrega: notas_entrega ? notas_entrega.trim() : null })
    });

    const pedidoActualizado = await Pedido.findByPk(pedido.id, {
      include: [{ model: MarcaVirtual, as: 'marca', attributes: ['id', 'nombre'] }]
    });

    return successResponse(res, 200, 'Pedido actualizado correctamente', pedidoActualizado);
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/pedidos/:id — Eliminar pedido
const eliminarPedido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      return errorResponse(res, 404, `No se encontró el pedido con ID ${id}`);
    }

    await pedido.destroy();
    return successResponse(res, 200, 'Pedido eliminado correctamente');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listarPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarPedido,
  eliminarPedido
};

