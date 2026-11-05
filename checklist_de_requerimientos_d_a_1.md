# Control de Requerimientos y Entregables — Mini Proyecto 1 (Día 1)

**Proyecto:** DarkKitchen Hub (Gestor de Cocinas Ocultas y Despacho Multiplataforma)  
**Stack Base:** Node.js, Express, Sequelize ORM, MySQL (mysql2), React  
**Restricción transversal:** Sin autenticación (cero login, registro, tokens o roles)

---

## 1. Matriz de Requerimientos y Entregables

| Control | Criterio / Área | Requisito Específico del Documento | Evidencia / Detalle Técnico | Ponderación | Estado |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **[X]** | **Enfoque Empresarial** | Elegir tema y justificar utilidad para una necesidad real de negocio | Justificación operativa de cocinas ocultas y despacho multiplataforma (`README.md`) | **15%** | **Completado** |
| **[X]** | **Restricción de Acceso** | Prohibido implementar autenticación, usuarios, tokens o roles | El sistema opera directamente sobre entidades de negocio sin control de sesión | — | **Completado** |
| **[X]** | **Entidades Mínimas** | Mínimo 3 entidades empresariales identificadas y coherentes | 8 candidatas analizadas y 3 principales definidas: `marcas_virtuales`, `platillos`, `pedidos` | **35%** | **Completado** |
| **[X]** | **Atributos y Tipos** | Atributos y tipos de datos definidos por entidad | Diccionario de datos formal con tipos (`INT`, `VARCHAR`, `DECIMAL`, `TIME`, etc.) y restricciones | *(incluido en 35%)* | **Completado** |
| **[X]** | **Relaciones ER** | Al menos una relación formal con integridad referencial | Relaciones 1:N con llaves foráneas (`PK` y `FK`) documentadas | *(incluido en 35%)* | **Completado** |
| **[X]** | **Diagrama ER Visual** | Diagrama Entidad-Relación visual con atributos y relaciones | Diagrama Mermaid renderizado con atributos y cardinalidad en `README.md` | *(incluido en 35%)* | **Completado** |
| **[X]** | **Persistencia** | Base de datos relacional operativa conectada al servidor | MySQL configurado y conectado a la base `dark_kitchen_db` | — | **Completado** |
| **[X]** | **Repositorio** | Repositorio Git inicializado con separación de carpetas | Repositorio con control de versiones y `.gitignore` (`Luis458-git/Dark_kitchen`) | **20%** | **Completado** |
| **[X]** | **Estructura Backend** | Organización en `models/`, `controllers/`, `routes/`, `app.js` | Backend modular con Sequelize CLI integrado en `src/` | *(incluido en 20%)* | **Completado** |
| **[X]** | **Estructura Frontend** | Carpetas base `src/components/`, `pages/`, `services/` | Directorio `frontend/` estructurado y listo para el Día 2 | *(incluido en 20%)* | **Completado** |
| **[X]** | **Servidor Node.js** | Servidor Express levantado y escuchando peticiones | `server.js` activo en puerto 3000 con sincronización automática `alter: true` | **30%** | **Completado** |
| **[X]** | **Validaciones Backend** | Campos obligatorios y verificación de tipos de datos | Validación de atributos en middleware/controlador antes de guardar (400 Bad Request) | *(incluido en 30%)* | **Completado** |
| **[X]** | **Endpoint Crear (POST)** | `POST /api/marcas` respondiendo `201 Created` en formato JSON | Registro insertado correctamente y confirmado en base de datos | *(incluido en 30%)* | **Completado** |
| **[X]** | **Endpoint Listar (GET)** | `GET /api/marcas` respondiendo `200 OK` en formato JSON | Listado de marcas retornado en arreglo JSON ordenado por ID | *(incluido en 30%)* | **Completado** |
| **[X]** | **Pruebas de API** | Pruebas ejecutadas en Postman, Thunder Client o similar | Respuestas HTTP validadas en vivo con códigos 200, 201 y 400 | *(incluido en 30%)* | **Completado** |
| **[X]** | **Documentación Consolidada** | Documento con justificación, diccionario, diagrama y evidencias | `README.md` y `requerimientos.md` actualizados con todos los entregables | — | **Completado** |

---

## 2. Resumen de Ponderación Evaluativa (Día 1)

```
[======================================== 100% COMPLETADO ========================================]
```

* **Modelado de Datos (35%):** ✅ **35% / 35%** (8 entidades analizadas, 3 principales modeladas, diccionario de datos y diagrama ER Mermaid).
* **Inicio del CRUD (30%):** ✅ **30% / 30%** (Servidor activo, MySQL sincronizado, POST 201 y GET 200 probados en Postman).
* **Estructura del Proyecto (20%):** ✅ **20% / 20%** (Separación modular backend/frontend, Sequelize CLI y repositorio Git).
* **Enfoque Empresarial (15%):** ✅ **15% / 15%** (Caso de negocio Dark Kitchens justificado y documentado).

---

## 3. Registro Detallado de Trabajos Realizados

A continuación se registra de manera cronológica cada uno de los trabajos ejecutados en el proyecto:

| # | Fecha | Componente / Archivo | Trabajo Realizado | Resultado / Impacto |
| :-: | :---: | :--- | :--- | :--- |
| **01** | 04/11 | `requerimientos.md` | Análisis inicial de requerimientos funcionales (RF-01 a RF-09), no funcionales (RNF-01 a RNF-08) y restricciones de acceso. | Alcance acotado: prohibido login/tokens, enfoque 100% CRUD empresarial. |
| **02** | 04/11 | `.gitignore` | Creación del archivo de exclusiones en la raíz del repositorio. | Protege `node_modules/`, variables privadas `.env`, builds y logs. |
| **03** | 04/11 | `backend/`, `frontend/` | Creación del árbol completo de carpetas para arquitectura desacoplada según especificación. | Estructura modular base lista para alojar código fuente. |
| **04** | 04/11 | `backend/package.json` | Instalación de dependencias de producción (`express`, `sequelize`, `mysql2`, `dotenv`, `cors`) y desarrollo (`sequelize-cli`, `nodemon`). | Entorno de ejecución y ORM listos con scripts `npm start` y `npm run dev`. |
| **05** | 04/11 | `backend/.sequelizerc` | Configuración de rutas para Sequelize CLI apuntando a `src/config`, `src/models`, `src/migrations` y `src/seeders`. | Integración limpia de Sequelize dentro de la convención `src/`. |
| **06** | 04/11 | `backend/.env` / `.env.example` | Creación de plantilla `.env.example` y archivo local `.env` con variables `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`. | Configuración desacoplada y segura de credenciales de MySQL. |
| **07** | 04/11 | `backend/src/config/database.js` | Configuración del dialecto MySQL en Sequelize leyendo variables dinámicamente con `dotenv`. | Permite conexión transparente a la base de datos sin credenciales hardcodeadas. |
| **08** | 04/11 | `backend/src/models/index.js` | Inicialización automática del cargador de modelos y asociaciones de Sequelize vía CLI. | Instancia central `sequelize` y registro dinámico de entidades. |
| **09** | 04/11 | `backend/src/models/MarcaVirtual.js` | Definición de la entidad `marcas_virtuales` con validaciones de Sequelize (`notNull`, `notEmpty`, `len`, regex `TIME_REGEX` para horas). | Campos: `id`, `nombre`, `tipo_cocina`, `horario_apertura`, `horario_cierre`, `activo`, `timestamps`. |
| **10** | 04/11 | `backend/src/controllers/marcasController.js` | Implementación de controladores `listarMarcas` y `crearMarca` con validación previa de obligatoriedad, tipos de datos y formato de horas. | Retorna `200 OK` en listado y `201 Created` en inserción; `400 Bad Request` ante datos erróneos. |
| **11** | 04/11 | `backend/src/routes/marcasRoutes.js` | Definición de rutas REST: `GET /` y `POST /`. | Mapeo directo a los métodos del controlador. |
| **12** | 04/11 | `backend/src/middlewares/errorHandler.js` | Middleware central de captura de excepciones: captura JSON roto (400), errores Sequelize (400) y fallos generales (500). | Formato homogéneo de respuesta de error en toda la API. |
| **13** | 04/11 | `backend/src/utils/apiResponse.js` | Funciones auxiliares `successResponse` y `errorResponse`. | Respuestas JSON estándar con estructura `{ success, message, data/errors }`. |
| **14** | 04/11 | `backend/src/app.js` | Ensamble de Express, middlewares globales (`cors`, `express.json`), enrutador `/api/marcas` y manejador 404. | Aplicación HTTP modular desacoplada del arranque del servidor. |
| **15** | 04/11 | `backend/src/server.js` | Conexión con `sequelize.authenticate()`, sincronización con `sequelize.sync({ alter: true })` y escucha del puerto. | La tabla `marcas_virtuales` se crea o actualiza automáticamente al arrancar. |
| **16** | 04/11 | `backend/.env` / Config | Corrección del nombre de la base de datos de `dark_kitchen_hub` a `dark_kitchen_db`. | Conexión exitosa verificada contra la base de datos real del usuario. |
| **17** | 04/11 | Repositorio GitHub | Primer commit y subida del proyecto a `https://github.com/Luis458-git/Dark_kitchen.git` en rama `main`. | Control de versiones activo excluyendo credenciales sensibles. |
| **18** | 05/11 | Pruebas Postman | Verificación en vivo de endpoints HTTP: `POST /api/marcas` (código 201) y `GET /api/marcas` (código 200). | CRUD funcional del Día 1 comprobado y validado en base de datos. |
| **19** | 05/11 | `README.md` | Normalización de codificación a UTF-8 (resolviendo problema de formato binario en Git). | Texto, acentos y visualización limpia en GitHub y editores de código. |
| **20** | 05/11 | `README.md` | Modelado de datos formal: identificación de 8 entidades candidatas, selección de 3 principales (`marcas_virtuales`, `platillos`, `pedidos`). | Cumplimiento del 35% de la ponderación evaluativa. |
| **21** | 05/11 | `README.md` | Elaboración del diccionario de datos (tipos, nulos, llaves PK/FK, valores por defecto) y Diagrama ER visual en Mermaid. | Relaciones 1:N documentadas con reglas de integridad referencial. |
| **22** | 05/11 | Git Sync | Commit y push de documentación, diccionario de datos y checklist al repositorio remoto. | Repositorio 100% sincronizado y listo para evaluación. |

---

## 4. Estado Final del Día 1
Todos los criterios exigidos en la rúbrica del Día 1 han sido alcanzados y documentados con éxito. El proyecto cuenta con base de datos sincronizada, endpoints activos probados en Postman y modelado de datos completo.
