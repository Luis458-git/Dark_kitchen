const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas del motor de IA requieren token JWT de operador
router.use(authMiddleware);

// POST /api/ai/multi-agent
router.post('/multi-agent', aiController.ejecutarMultiAgente);

// GET /api/ai/clientes (selector de comensales frecuentes para el frontend)
router.get('/clientes', aiController.obtenerClientes);

module.exports = router;

