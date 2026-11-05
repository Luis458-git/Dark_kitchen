const { Platillo, MarcaVirtual } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const validarPlatillo = (body, esEdicion = false) => {
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

  if (!esEdicion || body.nombre !== undefined) {
    if (!body.nombre || typeof body.nombre !== 'string' || body.nombre.trim() === '') {
      errores.push({ campo: 'nombre', mensaje: "El campo 'nombre' es obligatorio" });
    } else if (body.nombre.trim().length > 120) {
      errores.push({ campo: 'nombre', mensaje: "El campo 'nombre' debe tener máximo 120 caracteres" });
    }
  }

  if (!esEdicion || body.precio !== undefined) {
    const precioNum = Number(body.precio);
    if (body.precio === undefined || body.precio === null || isNaN(precioNum) || precioNum <= 0) {
      errores.push({ campo: 'precio', mensaje: "El campo 'precio' es obligatorio y debe ser un número positivo mayor a 0" });
    }
  }

  if (!esEdicion || body.categoria !== undefined) {
    if (!body.categoria || typeof body.categoria !== 'string' || body.categoria.trim() === '') {
      errores.push({ campo: 'categoria', mensaje: "El campo 'categoria' es obligatorio" });
    }
  }

  if (body.tiempo_preparacion_min !== undefined) {
    const tiempo = Number(body.tiempo_preparacion_min);
    if (isNaN(tiempo) || tiempo < 1) {
      errores.push({ campo: 'tiempo_preparacion_min', mensaje: "El tiempo de preparación debe ser de al menos 1 minuto" });
    }
  }

  if (body.disponible !== undefined && typeof body.disponible !== 'boolean') {
    errores.push({ campo: 'disponible', mensaje: "El campo 'disponible' debe ser booleano (true o false)" });
  }

  return errores;
};

// GET /api/platillos — Listar todos con Eager Loading de la Marca
const listarPlatillos = async (req, res, next) => {
  try {
    const platillos = await Platillo.findAll({
      include: [
        {
          model: MarcaVirtual,
          as: 'marca',
          attributes: ['id', 'nombre', 'tipo_cocina']
        }
      ],
      order: [['id', 'ASC']]
    });

    return successResponse(res, 200, 'Platillos obtenidos correctamente', platillos);
  } catch (error) {
    return next(error);
  }
};

// GET /api/platillos/:id — Consultar platillo por ID
const obtenerPlatilloPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const platillo = await Platillo.findByPk(id, {
      include: [
        {
          model: MarcaVirtual,
          as: 'marca',
          attributes: ['id', 'nombre', 'tipo_cocina', 'activo']
        }
      ]
    });

    if (!platillo) {
      return errorResponse(res, 404, `No se encontró el platillo con ID ${id}`);
    }

    return successResponse(res, 200, 'Platillo obtenido correctamente', platillo);
  } catch (error) {
    return next(error);
  }
};

// POST /api/platillos — Crear platillo con validación de clave foránea
const crearPlatillo = async (req, res, next) => {
  try {
    const errores = validarPlatillo(req.body);
    if (errores.length > 0) {
      return errorResponse(res, 400, 'Error de validación en los datos enviados', errores);
    }

    const { marca_id, nombre, descripcion, precio, categoria, tiempo_preparacion_min, disponible } = req.body;

    // RF-07: Validar que la marca padre existe
    const marcaExiste = await MarcaVirtual.findByPk(marca_id);
    if (!marcaExiste) {
      return errorResponse(res, 400, `La marca referenciada con ID ${marca_id} no existe en el sistema`);
    }

    const nuevoPlatillo = await Platillo.create({
      marca_id,
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      precio: Number(precio),
      categoria: categoria.trim(),
      tiempo_preparacion_min: tiempo_preparacion_min !== undefined ? Number(tiempo_preparacion_min) : 15,
      disponible: disponible !== undefined ? disponible : true
    });

    // Cargar la relación para la respuesta
    const platilloConMarca = await Platillo.findByPk(nuevoPlatillo.id, {
      include: [{ model: MarcaVirtual, as: 'marca', attributes: ['id', 'nombre'] }]
    });

    return successResponse(res, 201, 'Platillo creado correctamente', platilloConMarca);
  } catch (error) {
    return next(error);
  }
};

// PUT /api/platillos/:id — Actualizar platillo
const actualizarPlatillo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const platillo = await Platillo.findByPk(id);

    if (!platillo) {
      return errorResponse(res, 404, `No se encontró el platillo con ID ${id}`);
    }

    const errores = validarPlatillo(req.body, true);
    if (errores.length > 0) {
      return errorResponse(res, 400, 'Error de validación en los datos enviados', errores);
    }

    const { marca_id, nombre, descripcion, precio, categoria, tiempo_preparacion_min, disponible } = req.body;

    // Si se modifica la marca, validar que exista
    if (marca_id !== undefined) {
      const marcaExiste = await MarcaVirtual.findByPk(marca_id);
      if (!marcaExiste) {
        return errorResponse(res, 400, `La marca referenciada con ID ${marca_id} no existe en el sistema`);
      }
    }

    await platillo.update({
      ...(marca_id !== undefined && { marca_id: Number(marca_id) }),
      ...(nombre !== undefined && { nombre: nombre.trim() }),
      ...(descripcion !== undefined && { descripcion: descripcion ? descripcion.trim() : null }),
      ...(precio !== undefined && { precio: Number(precio) }),
      ...(categoria !== undefined && { categoria: categoria.trim() }),
      ...(tiempo_preparacion_min !== undefined && { tiempo_preparacion_min: Number(tiempo_preparacion_min) }),
      ...(disponible !== undefined && { disponible })
    });

    const platilloActualizado = await Platillo.findByPk(platillo.id, {
      include: [{ model: MarcaVirtual, as: 'marca', attributes: ['id', 'nombre'] }]
    });

    return successResponse(res, 200, 'Platillo actualizado correctamente', platilloActualizado);
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/platillos/:id — Eliminar platillo
const eliminarPlatillo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const platillo = await Platillo.findByPk(id);

    if (!platillo) {
      return errorResponse(res, 404, `No se encontró el platillo con ID ${id}`);
    }

    await platillo.destroy();
    return successResponse(res, 200, 'Platillo eliminado correctamente');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listarPlatillos,
  obtenerPlatilloPorId,
  crearPlatillo,
  actualizarPlatillo,
  eliminarPlatillo
};

