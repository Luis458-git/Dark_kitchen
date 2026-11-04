const express = require('express');
const cors = require('cors');
const marcasRoutes = require('./routes/marcasRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { errorResponse } = require('./utils/apiResponse');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/marcas', marcasRoutes);

// Rutas inexistentes
app.use((req, res) => errorResponse(res, 404, `Ruta no encontrada: ${req.originalUrl}`));

// Manejo centralizado de errores
app.use(errorHandler);

module.exports = app;
