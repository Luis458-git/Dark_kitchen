const { MarcaVirtual, Platillo, Pedido } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

const validarTexto = (valor, campo, max, errores) => {
  if (valor === undefined || valor === null) {
    errores.push({ campo, mensaje: `El campo '${campo}' es obligatorio` });
  } else if (typeof valor !== 'string') {
    errores.push({ campo, mensaje: `El campo '${campo}' debe ser de tipo texto` });
  } else if (valor.trim() === '') {
    errores.push({ campo, mensaje: `El campo '${campo}' no puede estar vacío` });
  } else if (valor.trim().length > max) {
    errores.push({ campo, mensaje: `El campo '${campo}' debe tener máximo ${max} caracteres` });
  }
};

const validarHora = (valor, campo, errores) => {
  if (valor === undefined || valor === null) {
    errores.push({ campo, mensaje: `El campo '${campo}' es obligatorio` });
  } else if (typeof valor !== 'string' || !TIME_REGEX.test(valor.trim())) {
    errores.push({ campo, mensaje: `El campo '${campo}' debe tener formato HH:MM o HH:MM:SS` });
  }
};

const validarMarca = (body, esEdicion = false) => {
  const errores = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    errores.push({ campo: 'body', mensaje: 'El cuerpo de la petición debe ser un objeto JSON' });
    return errores;
  }

  if (!esEdicion || body.nombre !== undefined) {
    validarTexto(body.nombre, 'nombre', 100, errores);
  }
  if (!esEdicion || body.tipo_cocina !== undefined) {
    validarTexto(body.tipo_cocina, 'tipo_cocina', 50, errores);
  }
  if (!esEdicion || body.horario_apertura !== undefined) {
    validarHora(body.horario_apertura, 'horario_apertura', errores);
  }
  if (!esEdicion || body.horario_cierre !== undefined) {
    validarHora(body.horario_cierre, 'horario_cierre', errores);
  }
  if (body.activo !== undefined && typeof body.activo !== 'boolean') {
    errores.push({ campo: 'activo', mensaje: "El campo 'activo' debe ser de tipo booleano (true o false)" });
  }

  return errores;
};

// GET /api/marcas — Listar todas las marcas
const listarMarcas = async (req, res, next) => {
  try {
    const marcas = await MarcaVirtual.findAll({ order: [['id', 'ASC']] });
    return successResponse(res, 200, 'Marcas obtenidas correctamente', marcas);
  } catch (error) {
    return next(error);
  }
};

// GET /api/marcas/:id — Consultar marca por ID
const obtenerMarcaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const marca = await MarcaVirtual.findByPk(id, {
      include: [
        { model: Platillo, as: 'platillos', attributes: ['id', 'nombre', 'precio', 'disponible'] },
        { model: Pedido, as: 'pedidos', attributes: ['id', 'numero_orden', 'total', 'estado'] }
      ]
    });

    if (!marca) {
      return errorResponse(res, 404, `No se encontró la marca con ID ${id}`);
    }

    return successResponse(res, 200, 'Marca obtenida correctamente', marca);
  } catch (error) {
    return next(error);
  }
};

// POST /api/marcas — Crear marca
const crearMarca = async (req, res, next) => {
  try {
    const errores = validarMarca(req.body);
    if (errores.length > 0) {
      return errorResponse(res, 400, 'Error de validación en los datos enviados', errores);
    }

    const { nombre, tipo_cocina, horario_apertura, horario_cierre, activo } = req.body;

    const nuevaMarca = await MarcaVirtual.create({
      nombre: nombre.trim(),
      tipo_cocina: tipo_cocina.trim(),
      horario_apertura: horario_apertura.trim(),
      horario_cierre: horario_cierre.trim(),
      activo: activo !== undefined ? activo : true
    });

    return successResponse(res, 201, 'Marca creada correctamente', nuevaMarca);
  } catch (error) {
    return next(error);
  }
};

// PUT /api/marcas/:id — Actualizar marca
const actualizarMarca = async (req, res, next) => {
  try {
    const { id } = req.params;
    const marca = await MarcaVirtual.findByPk(id);

    if (!marca) {
      return errorResponse(res, 404, `No se encontró la marca con ID ${id}`);
    }

    const errores = validarMarca(req.body, true);
    if (errores.length > 0) {
      return errorResponse(res, 400, 'Error de validación en los datos enviados', errores);
    }

    const { nombre, tipo_cocina, horario_apertura, horario_cierre, activo } = req.body;

    await marca.update({
      ...(nombre !== undefined && { nombre: nombre.trim() }),
      ...(tipo_cocina !== undefined && { tipo_cocina: tipo_cocina.trim() }),
      ...(horario_apertura !== undefined && { horario_apertura: horario_apertura.trim() }),
      ...(horario_cierre !== undefined && { horario_cierre: horario_cierre.trim() }),
      ...(activo !== undefined && { activo })
    });

    return successResponse(res, 200, 'Marca actualizada correctamente', marca);
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/marcas/:id — Eliminar marca con control de integridad (409 Conflict)
const eliminarMarca = async (req, res, next) => {
  try {
    const { id } = req.params;
    const marca = await MarcaVirtual.findByPk(id);

    if (!marca) {
      return errorResponse(res, 404, `No se encontró la marca con ID ${id}`);
    }

    // Comprobar dependencias relacionales
    const platillosCount = await Platillo.count({ where: { marca_id: id } });
    const pedidosCount = await Pedido.count({ where: { marca_id: id } });

    if (platillosCount > 0 || pedidosCount > 0) {
      return errorResponse(
        res,
        409,
        `Conflicto de integridad referencial: No se puede eliminar la marca '${marca.nombre}' porque posee ${platillosCount} platillo(s) y ${pedidosCount} pedido(s) asociados.`
      );
    }

    await marca.destroy();
    return successResponse(res, 200, 'Marca eliminada correctamente');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listarMarcas,
  obtenerMarcaPorId,
  crearMarca,
  actualizarMarca,
  eliminarMarca
};
