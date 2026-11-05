const { Router } = require('express');
const {
  listarMarcas,
  obtenerMarcaPorId,
  crearMarca,
  actualizarMarca,
  eliminarMarca
} = require('../controllers/marcasController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

// Todas las rutas de marcas protegidas con authMiddleware
router.use(authMiddleware);

router.get('/', listarMarcas);
router.get('/:id', obtenerMarcaPorId);
router.post('/', crearMarca);
router.put('/:id', actualizarMarca);
router.delete('/:id', eliminarMarca);

module.exports = router;
