const { errorResponse } = require('../utils/apiResponse');

// Manejo centralizado de excepciones
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // JSON mal formado en el cuerpo de la petición
  if (err.type === 'entity.parse.failed') {
    return errorResponse(res, 400, 'El cuerpo de la petición no es un JSON válido');
  }

  // Errores de validación o de restricción única de Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errores = err.errors.map((e) => ({ campo: e.path, mensaje: e.message }));
    return errorResponse(res, 400, 'Error de validación en los datos enviados', errores);
  }

  // Cualquier otro error se considera error interno del servidor
  console.error(err);
  return errorResponse(res, 500, 'Error interno del servidor');
};

module.exports = errorHandler;
