const { Router } = require('express');
const {
  listarPlatillos,
  obtenerPlatilloPorId,
  crearPlatillo,
  actualizarPlatillo,
  eliminarPlatillo
} = require('../controllers/platillosController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', listarPlatillos);
router.get('/:id', obtenerPlatilloPorId);
router.post('/', crearPlatillo);
router.put('/:id', actualizarPlatillo);
router.put('/:id/disponible', actualizarPlatillo);
router.patch('/:id/disponible', actualizarPlatillo);
router.delete('/:id', eliminarPlatillo);

module.exports = router;
