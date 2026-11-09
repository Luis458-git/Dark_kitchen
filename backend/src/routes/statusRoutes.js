const express = require('express');
const router = express.Router();
const { obtenerCatalogo, probarCodigo } = require('../controllers/statusController');

// Catálogo completo de códigos HTTP soportados
router.get('/catalog', obtenerCatalogo);

// Endpoint dinámico para probar cualquier código de estado (200, 301, 404, 500, etc.)
router.get('/:code', probarCodigo);
router.post('/:code', probarCodigo);
router.put('/:code', probarCodigo);
router.delete('/:code', probarCodigo);

module.exports = router;
