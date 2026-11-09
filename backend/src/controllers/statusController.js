/**
 * DarkKitchen Hub - Controlador de Códigos de Estado y Diagnóstico HTTP
 * Manejo y simulación de familias 200, 300, 400 y 500 en contexto gastronómico
 */

const CATALOGO_STATUS = [
  // ==========================================
  // FAMILIA 200: ÉXITO (SUCCESSFUL RESPONSES)
  // ==========================================
  {
    codigo: 200,
    familia: '2xx',
    nombre: 'OK',
    categoria: 'Éxito',
    descripcionRfc: 'La solicitud ha tenido éxito.',
    contextoDarkKitchen: 'Catálogo de platillos, recetas maestras o marcas satélite consultado con éxito.',
    tipo: 'success',
    payloadEjemplo: {
      timestamp: new Date().toISOString(),
      modulo: 'CatalogoMaestro',
      totalPlatillos: 24,
      marcasActivas: 5,
      estadoOperativo: 'OPTIMO'
    }
  },
  {
    codigo: 201,
    familia: '2xx',
    nombre: 'Created',
    categoria: 'Éxito',
    descripcionRfc: 'La solicitud ha tenido éxito y ha resultado en la creación de un nuevo recurso.',
    contextoDarkKitchen: 'Nueva receta culinaria o marca satélite registrada en la base de datos de producción.',
    tipo: 'success',
    payloadEjemplo: {
      id: 104,
      nombre: 'Truffle Wagyu Burger Signature',
      sku: 'BUR-WAG-004',
      marcaId: 1,
      precio: 28.50,
      creadoEn: new Date().toISOString()
    }
  },
  {
    codigo: 202,
    familia: '2xx',
    nombre: 'Accepted',
    categoria: 'Éxito',
    descripcionRfc: 'La solicitud ha sido aceptada para procesamiento, pero el procesamiento no ha concluido.',
    contextoDarkKitchen: 'Comanda recibida y encolada en el monitor de cocina (KDS) para cocción asíncrona.',
    tipo: 'success',
    payloadEjemplo: {
      comandaId: 'CMD-8831',
      cola: 'ESTACION_PLANCHA_A',
      tiempoEstimadoMinutos: 14,
      estado: 'ENCOLADO_PENDIENTE_FUEGO'
    }
  },
  {
    codigo: 204,
    familia: '2xx',
    nombre: 'No Content',
    categoria: 'Éxito',
    descripcionRfc: 'La solicitud se ha completado con éxito pero su respuesta no contiene contenido en el cuerpo.',
    contextoDarkKitchen: 'Receta o registro obsoleto eliminado correctamente de la estación.',
    tipo: 'success',
    payloadEjemplo: null
  },

  // ==========================================
  // FAMILIA 300: REDIRECCIÓN (REDIRECTION)
  // ==========================================
  {
    codigo: 301,
    familia: '3xx',
    nombre: 'Moved Permanently',
    categoria: 'Redirección',
    descripcionRfc: 'El recurso solicitado ha sido asignado a un nuevo URI permanente.',
    contextoDarkKitchen: 'Antiguo endpoint de pedidos migrado permanentemente a la nueva Consola de Despacho (/api/pedidos).',
    tipo: 'redirect',
    nuevaUbicacion: '/api/pedidos',
    payloadEjemplo: {
      mensaje: 'Ruta migrada permanentemente al nuevo Hub centralizado',
      redireccionA: '/api/pedidos'
    }
  },
  {
    codigo: 302,
    familia: '3xx',
    nombre: 'Found',
    categoria: 'Redirección',
    descripcionRfc: 'El recurso solicitado reside temporalmente bajo un URI diferente.',
    contextoDarkKitchen: 'Redirección temporal de órdenes hacia estación satélite de respaldo por alta demanda.',
    tipo: 'redirect',
    nuevaUbicacion: '/pedidos?nodo=contingencia',
    payloadEjemplo: {
      mensaje: 'Estación primaria saturada. Redirigiendo a nodo de contingencia',
      redireccionA: '/pedidos?nodo=contingencia'
    }
  },
  {
    codigo: 304,
    familia: '3xx',
    nombre: 'Not Modified',
    categoria: 'Redirección / Caché',
    descripcionRfc: 'Indica al cliente que la respuesta no ha sido modificada, por lo que puede usar la versión en caché.',
    contextoDarkKitchen: 'Las fichas técnicas de los ingredientes no han cambiado desde la última sincronización.',
    tipo: 'redirect',
    payloadEjemplo: null
  },
  {
    codigo: 307,
    familia: '3xx',
    nombre: 'Temporary Redirect',
    categoria: 'Redirección',
    descripcionRfc: 'El recurso reside temporalmente en otra URI conservando el método HTTP original (POST/PUT).',
    contextoDarkKitchen: 'Redirección de la pasarela de cobro hacia el procesador de pagos nocturnos.',
    tipo: 'redirect',
    nuevaUbicacion: '/api/pedidos/pasarela-alterna',
    payloadEjemplo: {
      mensaje: 'Conservando comanda en tránsito hacia pasarela nocturna',
      redireccionA: '/api/pedidos/pasarela-alterna'
    }
  },
  {
    codigo: 308,
    familia: '3xx',
    nombre: 'Permanent Redirect',
    categoria: 'Redirección',
    descripcionRfc: 'El recurso ha sido reasignado de manera fija conservando el método HTTP exacto.',
    contextoDarkKitchen: 'Redirección fija de solicitudes legacy al cluster seguro de DarkKitchen Hub.',
    tipo: 'redirect',
    nuevaUbicacion: '/api/marcas',
    payloadEjemplo: {
      mensaje: 'Ruta migrada definitivamente al nuevo clúster',
      redireccionA: '/api/marcas'
    }
  },

  // ==========================================
  // FAMILIA 400: ERRORES DEL CLIENTE (CLIENT ERRORS)
  // ==========================================
  {
    codigo: 400,
    familia: '4xx',
    nombre: 'Bad Request',
    categoria: 'Error de Cliente',
    descripcionRfc: 'El servidor no puede o no procesará la solicitud debido a un error evidente del cliente.',
    contextoDarkKitchen: 'Parámetros inválidos al crear un platillo (ej. precio negativo, marca inexistente o nombre vacío).',
    tipo: 'client_error',
    payloadEjemplo: {
      campoInvalido: 'precio',
      valorRecibido: -15.00,
      motivo: 'El precio del platillo debe ser un número positivo mayor a 0.'
    }
  },
  {
    codigo: 401,
    familia: '4xx',
    nombre: 'Unauthorized',
    categoria: 'Error de Cliente',
    descripcionRfc: 'La petición carece de credenciales de autenticación válidas para el recurso objetivo.',
    contextoDarkKitchen: 'El token JWT de la sesión del Chef ha caducado o no se adjuntó en la cabecera Authorization.',
    tipo: 'client_error',
    payloadEjemplo: {
      error: 'TOKEN_EXPIRADO',
      motivo: 'Tu sesión operativa ha expirado. Por favor inicia sesión nuevamente en el portal.'
    }
  },
  {
    codigo: 403,
    familia: '4xx',
    nombre: 'Forbidden',
    categoria: 'Error de Cliente',
    descripcionRfc: 'El servidor comprende la petición pero se niega a autorizarla.',
    contextoDarkKitchen: 'Bóveda culinaria restringida. Tu rol no tiene permisos para modificar costos confidenciales de recetas.',
    tipo: 'client_error',
    payloadEjemplo: {
      error: 'ACCESO_RESTRINGIDO',
      rolActual: 'COCINERO_LINEA',
      rolRequerido: 'CHEF_EJECUTIVO_MASTER',
      boveda: 'COSTOS_CONFIDENCIALES'
    }
  },
  {
    codigo: 404,
    familia: '4xx',
    nombre: 'Not Found',
    categoria: 'Error de Cliente',
    descripcionRfc: 'El servidor no ha encontrado nada coincidente con el URI solicitado.',
    contextoDarkKitchen: 'El platillo, comanda de despacho o marca satélite no existe en el sistema o fue archivada.',
    tipo: 'client_error',
    payloadEjemplo: {
      error: 'RECURSO_INEXISTENTE',
      recurso: 'Platillo ID #999',
      mensaje: 'No se encontró ningún platillo con ese identificador en la cocina.'
    }
  },
  {
    codigo: 408,
    familia: '4xx',
    nombre: 'Request Timeout',
    categoria: 'Error de Cliente',
    descripcionRfc: 'El cliente no produjo una solicitud dentro del tiempo en que el servidor estaba dispuesto a esperar.',
    contextoDarkKitchen: 'La terminal POS del cliente tardó demasiado en enviar la confirmación del pedido.',
    tipo: 'client_error',
    payloadEjemplo: {
      error: 'TIEMPO_AGOTADO',
      limiteMs: 15000,
      mensaje: 'La comanda no se completó a tiempo. Intente emitir la orden nuevamente.'
    }
  },
  {
    codigo: 409,
    familia: '4xx',
    nombre: 'Conflict',
    categoria: 'Error de Cliente',
    descripcionRfc: 'La solicitud no pudo completarse debido a un conflicto con el estado actual del recurso.',
    contextoDarkKitchen: 'Conflicto de unicidad: ya existe una marca satélite con ese nombre o el ingrediente tiene comanda activa.',
    tipo: 'client_error',
    payloadEjemplo: {
      error: 'CONFLICTO_DE_REGISTRO',
      campoDuplicado: 'nombre',
      valor: 'Burger Ghost',
      mensaje: 'Ya existe una marca satélite registrada con el nombre Burger Ghost.'
    }
  },
  {
    codigo: 422,
    familia: '4xx',
    nombre: 'Unprocessable Entity',
    categoria: 'Error de Cliente',
    descripcionRfc: 'La solicitud estaba bien formada pero no pudo ser seguida debido a errores semánticos.',
    contextoDarkKitchen: 'La receta contiene gramajes incompatibles o alérgenos conflictivos no permitidos por la normativa sanitaria.',
    tipo: 'client_error',
    payloadEjemplo: {
      error: 'ERROR_SEMANTICO',
      validacion: 'El platillo vegano no puede contener subproductos lácteos en sus ingredientes.'
    }
  },
  {
    codigo: 429,
    familia: '4xx',
    nombre: 'Too Many Requests',
    categoria: 'Error de Cliente',
    descripcionRfc: 'El usuario ha enviado demasiadas solicitudes en un período de tiempo determinado (Rate Limiting).',
    contextoDarkKitchen: 'Demasiadas comandas disparadas por el bot en menos de un segundo. Protección anti-saturación KDS activa.',
    tipo: 'client_error',
    payloadEjemplo: {
      error: 'RATE_LIMIT_EXCEDIDO',
      reintentarEnSegundos: 30,
      mensaje: 'Has superado el límite de 60 peticiones/minuto al hub operativo.'
    }
  },

  // ==========================================
  // FAMILIA 500: ERRORES DEL SERVIDOR (SERVER ERRORS)
  // ==========================================
  {
    codigo: 500,
    familia: '5xx',
    nombre: 'Internal Server Error',
    categoria: 'Error de Servidor',
    descripcionRfc: 'El servidor encontró una condición inesperada que le impidió cumplir con la solicitud.',
    contextoDarkKitchen: 'Fallo crítico no controlado en la estación central o interrupción en el pool de base de datos MySQL.',
    tipo: 'server_error',
    payloadEjemplo: {
      error: 'INCIDENTE_INTERNO_SERVIDOR',
      estacion: 'CORE_GATEWAY_NODE_1',
      codigoIncidente: 'ERR-500-SQL-POOL-HALT',
      mensaje: 'Ocurrió un error inesperado al procesar la comanda en cocina.'
    }
  },
  {
    codigo: 501,
    familia: '5xx',
    nombre: 'Not Implemented',
    categoria: 'Error de Servidor',
    descripcionRfc: 'El servidor no reconoce el método de solicitud o carece de capacidad para cumplirlo.',
    contextoDarkKitchen: 'Método de cocción criogénica molecular solicitado aún no está implementado en este módulo.',
    tipo: 'server_error',
    payloadEjemplo: {
      error: 'METODO_NO_IMPLEMENTADO',
      funcionalidad: 'DESPACHO_DRONE_AUTONOMO',
      versionSoportada: '2.4.0 (Programada para Q3)'
    }
  },
  {
    codigo: 502,
    familia: '5xx',
    nombre: 'Bad Gateway',
    categoria: 'Error de Servidor',
    descripcionRfc: 'El servidor actuando como puerta de enlace recibió una respuesta no válida del servidor ascendente.',
    contextoDarkKitchen: 'Pérdida de enlace con el servidor de la cocina satélite remota (sucursal Norte).',
    tipo: 'server_error',
    payloadEjemplo: {
      error: 'GATEWAY_ERROR',
      nodoRemoto: 'KITCHEN_NODE_NORTE_9',
      estado: 'SIN_RESPUESTA_SOCKET'
    }
  },
  {
    codigo: 503,
    familia: '5xx',
    nombre: 'Service Unavailable',
    categoria: 'Error de Servidor',
    descripcionRfc: 'El servidor no puede manejar la solicitud temporalmente debido a sobrecarga o mantenimiento del servidor.',
    contextoDarkKitchen: 'Hornos de alta precisión y extractores en mantenimiento preventivo nocturno. Reanudación programada.',
    tipo: 'server_error',
    payloadEjemplo: {
      error: 'SERVICIO_EN_MANTENIMIENTO',
      motivo: 'Calibración de hornos convectores y sanitización profunda',
      reaperturaEstimada: '06:00 AM'
    }
  },
  {
    codigo: 504,
    familia: '5xx',
    nombre: 'Gateway Timeout',
    categoria: 'Error de Servidor',
    descripcionRfc: 'El servidor actuando como puerta de enlace no recibió respuesta a tiempo del servidor aguas arriba.',
    contextoDarkKitchen: 'Tiempo de espera agotado al consultar el inventario de ingredientes en la bodega central.',
    tipo: 'server_error',
    payloadEjemplo: {
      error: 'GATEWAY_TIMEOUT',
      servicioDestino: 'MICROSERVICIO_BODEGA_FRESCOS',
      timeoutMs: 10000
    }
  }
];

/**
 * Devuelve el catálogo completo con la metadata de todos los códigos HTTP
 */
const obtenerCatalogo = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Catálogo de códigos de estado HTTP DarkKitchen Hub',
    totalCodigos: CATALOGO_STATUS.length,
    familias: {
      '2xx': CATALOGO_STATUS.filter((c) => c.familia === '2xx').length,
      '3xx': CATALOGO_STATUS.filter((c) => c.familia === '3xx').length,
      '4xx': CATALOGO_STATUS.filter((c) => c.familia === '4xx').length,
      '5xx': CATALOGO_STATUS.filter((c) => c.familia === '5xx').length
    },
    data: CATALOGO_STATUS
  });
};

/**
 * Simula y devuelve la respuesta con el código de estado HTTP exacto solicitado
 */
const probarCodigo = (req, res) => {
  const code = parseInt(req.params.code, 10);

  if (isNaN(code)) {
    return res.status(400).json({
      success: false,
      message: 'El código HTTP proporcionado no es un número entero válido',
      codigoRecibido: req.params.code
    });
  }

  // Buscar en el catálogo
  const statusInfo = CATALOGO_STATUS.find((c) => c.codigo === code);

  // Manejo especial 204 No Content
  if (code === 204) {
    return res.status(204).end();
  }

  // Manejo especial 304 Not Modified
  if (code === 304) {
    return res.status(304).end();
  }

  // Si es redirección y el cliente NO pidió json explicito
  const noRedirect = req.query.no_redirect === 'true' || req.headers['x-simulacion-http'] === 'true';

  if ([301, 302, 307, 308].includes(code) && !noRedirect) {
    const destino = statusInfo?.nuevaUbicacion || '/api/status/catalog';
    res.setHeader('Location', destino);
    return res.status(code).json({
      success: true,
      statusCode: code,
      redirectUrl: destino,
      message: `Redirección HTTP ${code} hacia ${destino}`
    });
  }

  // Construir cuerpo de respuesta estándar
  const responseBody = {
    success: code >= 200 && code < 300,
    statusCode: code,
    statusText: statusInfo ? statusInfo.nombre : 'Custom HTTP Status',
    familia: `${Math.floor(code / 100)}xx`,
    categoria: statusInfo ? statusInfo.categoria : 'Respuesta Personalizada',
    rfcDescripcion: statusInfo ? statusInfo.descripcionRfc : 'Código de estado estándar HTTP',
    contextoGastronomico: statusInfo ? statusInfo.contextoDarkKitchen : 'Operación en la red DarkKitchen Hub',
    servidor: 'DarkKitchen Hub - Atelier Noir Gateway v2.4',
    timestamp: new Date().toISOString(),
    detalles: statusInfo?.payloadEjemplo || { mensaje: `Código ${code} disparado para diagnóstico de red` }
  };

  return res.status(code).json(responseBody);
};

module.exports = {
  CATALOGO_STATUS,
  obtenerCatalogo,
  probarCodigo
};
