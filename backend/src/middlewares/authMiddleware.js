const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'No autorizado',
      message: 'Token de autenticación no proporcionado'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dark_kitchen_jwt_secret_key_2026_secreta_y_segura');
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'No autorizado',
      message: error.name === 'TokenExpiredError' ? 'El token ha expirado' : 'Token inválido o malformado'
    });
  }
};

module.exports = authMiddleware;

