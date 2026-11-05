const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const marcasRoutes = require('./routes/marcasRoutes');
const platillosRoutes = require('./routes/platillosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { errorResponse } = require('./utils/apiResponse');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/marcas', marcasRoutes);
app.use('/api/platillos', platillosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/ai', aiRoutes);

// Manejo de rutas inexistentes
app.use((req, res) => errorResponse(res, 404, `Ruta no encontrada: ${req.originalUrl}`));

// Manejo centralizado de errores
app.use(errorHandler);

module.exports = app;
