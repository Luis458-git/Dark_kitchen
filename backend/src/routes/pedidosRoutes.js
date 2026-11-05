const { Router } = require('express');
const {
  listarPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarPedido,
  eliminarPedido
} = require('../controllers/pedidosController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', listarPedidos);
router.get('/:id', obtenerPedidoPorId);
router.post('/', crearPedido);
router.put('/:id', actualizarPedido);
router.delete('/:id', eliminarPedido);

module.exports = router;

