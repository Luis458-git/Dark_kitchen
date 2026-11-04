const { Router } = require('express');
const { listarMarcas, crearMarca } = require('../controllers/marcasController');

const router = Router();

// GET  /api/marcas  -> Listar todas las marcas virtuales
router.get('/', listarMarcas);

// POST /api/marcas  -> Crear una nueva marca virtual
router.post('/', crearMarca);

module.exports = router;
