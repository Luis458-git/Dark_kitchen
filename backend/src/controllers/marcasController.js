const { MarcaVirtual } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

// Valida que un valor sea un texto no vacío con longitud máxima
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

// Valida que un valor sea una hora con formato HH:MM o HH:MM:SS
const validarHora = (valor, campo, errores) => {
  if (valor === undefined || valor === null) {
    errores.push({ campo, mensaje: `El campo '${campo}' es obligatorio` });
  } else if (typeof valor !== 'string' || !TIME_REGEX.test(valor.trim())) {
    errores.push({ campo, mensaje: `El campo '${campo}' debe tener formato HH:MM o HH:MM:SS` });
  }
};

// Validación manual del cuerpo de la petición para crear una marca
const validarMarca = (body) => {
  const errores = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    errores.push({ campo: 'body', mensaje: 'El cuerpo de la petición debe ser un objeto JSON' });
    return errores;
  }

  validarTexto(body.nombre, 'nombre', 100, errores);
  validarTexto(body.tipo_cocina, 'tipo_cocina', 50, errores);
  validarHora(body.horario_apertura, 'horario_apertura', errores);
  validarHora(body.horario_cierre, 'horario_cierre', errores);

  if (body.activo !== undefined && typeof body.activo !== 'boolean') {
    errores.push({ campo: 'activo', mensaje: "El campo 'activo' debe ser de tipo booleano (true o false)" });
  }

  return errores;
};

// GET /api/marcas — Lista todas las marcas virtuales
const listarMarcas = async (req, res, next) => {
  try {
    const marcas = await MarcaVirtual.findAll({ order: [['id', 'ASC']] });
    return successResponse(res, 200, 'Marcas obtenidas correctamente', marcas);
  } catch (error) {
    return next(error);
  }
};

// POST /api/marcas — Crea una nueva marca virtual
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
      ...(activo !== undefined && { activo })
    });

    return successResponse(res, 201, 'Marca creada correctamente', nuevaMarca);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listarMarcas,
  crearMarca
};
