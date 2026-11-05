const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register — Registro de usuario
const register = async (req, res, next) => {
  try {
    const { nombre, correo, password } = req.body;
    const errores = [];

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      errores.push({ campo: 'nombre', mensaje: 'El nombre es obligatorio' });
    }

    if (!correo || typeof correo !== 'string' || !EMAIL_REGEX.test(correo.trim())) {
      errores.push({ campo: 'correo', mensaje: 'Debe proporcionar un correo electrónico válido' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      errores.push({ campo: 'password', mensaje: 'La contraseña debe tener al menos 8 caracteres' });
    }

    if (errores.length > 0) {
      return errorResponse(res, 400, 'Error de validación en los datos enviados', errores);
    }

    // Comprobar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ where: { correo: correo.trim().toLowerCase() } });
    if (usuarioExistente) {
      return errorResponse(res, 400, 'El correo electrónico ya se encuentra registrado');
    }

    // Cifrar la contraseña con bcrypt (costo 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      password: passwordHash
    });

    const datosRespuesta = {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      createdAt: nuevoUsuario.createdAt
    };

    return successResponse(res, 201, 'Usuario registrado exitosamente', datosRespuesta);
  } catch (error) {
    return next(error);
  }
};

// POST /api/auth/login — Inicio de sesión
const login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return errorResponse(res, 400, 'Debe proporcionar correo y contraseña');
    }

    const usuario = await Usuario.findOne({ where: { correo: correo.trim().toLowerCase() } });
    if (!usuario) {
      return errorResponse(res, 401, 'Credenciales inválidas (correo o contraseña incorrectos)');
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return errorResponse(res, 401, 'Credenciales inválidas (correo o contraseña incorrectos)');
    }

    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'dark_kitchen_jwt_secret_key_2026_secreta_y_segura',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      usuario: payload
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/auth/me — Perfil del usuario autenticado
const getMe = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id', 'nombre', 'correo', 'createdAt', 'updatedAt']
    });

    if (!usuario) {
      return errorResponse(res, 404, 'Usuario no encontrado');
    }

    return successResponse(res, 200, 'Perfil obtenido correctamente', usuario);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
