# Lista de requerimientos — Mini Proyecto 1

Basado en el documento: Mini Proyecto 1 · Día 1 — Modelado de datos empresariales e inicio del CRUD.

El objetivo del proyecto es desarrollar un sistema empresarial utilizando Node.js para el backend y React para el frontend, con operaciones CRUD completas que permitan administrar la información de una empresa.

A continuación, organizo los requerimientos en funcionales, no funcionales y técnicos para que puedas utilizarlos en tu documentación.

## 1. Requerimientos funcionales

Son las funcionalidades que el sistema debe permitir realizar al usuario.

| ID    | Requerimiento                                                                             |
| ----- | ----------------------------------------------------------------------------------------- |
| RF-01 | El sistema debe permitir registrar nuevos datos de las entidades principales.             |
| RF-02 | El sistema debe permitir consultar y visualizar todos los registros almacenados.          |
| RF-03 | El sistema debe permitir consultar un registro específico mediante su identificador (ID). |
| RF-04 | El sistema debe permitir actualizar la información de los registros existentes.           |
| RF-05 | El sistema debe permitir eliminar registros existentes.                                   |
| RF-06 | El sistema debe solicitar una confirmación antes de eliminar un registro.                 |
| RF-07 | El sistema debe permitir gestionar al menos tres entidades relacionadas entre sí.         |
| RF-08 | El sistema debe permitir crear y editar registros mediante formularios.                   |
| RF-09 | El sistema debe mostrar la información de los registros mediante tablas o listas.         |

## 2. Requerimientos no funcionales

Son las características y condiciones técnicas que debe cumplir el sistema.

| ID     | Requerimiento                                                                                 |
| ------ | --------------------------------------------------------------------------------------------- |
| RNF-01 | El backend debe desarrollarse utilizando Node.js.                                             |
| RNF-02 | El frontend debe desarrollarse utilizando React.                                              |
| RNF-03 | El backend debe exponer una API REST.                                                         |
| RNF-04 | La API debe enviar y recibir información en formato JSON.                                     |
| RNF-05 | El sistema debe utilizar una base de datos para almacenar la información.                     |
| RNF-06 | El backend debe validar los campos obligatorios.                                              |
| RNF-07 | El backend debe verificar que los datos recibidos tengan los tipos de datos correspondientes. |
| RNF-08 | El proyecto debe mantener una separación entre backend y frontend.                            |

## 3. Requerimientos técnicos de la API REST

Cada entidad debe contar con las operaciones CRUD correspondientes.

| ID    | Método HTTP | Endpoint           | Función                           |
| ----- | ----------- | ------------------ | --------------------------------- |
| RT-01 | POST        | `/api/entidad`     | Crear un registro.                |
| RT-02 | GET         | `/api/entidad`     | Listar todos los registros.       |
| RT-03 | GET         | `/api/entidad/:id` | Consultar un registro específico. |
| RT-04 | PUT         | `/api/entidad/:id` | Actualizar un registro.           |
| RT-05 | DELETE      | `/api/entidad/:id` | Eliminar un registro.             |

Respuestas esperadas:

- `200`: Operación realizada correctamente.
- `201`: Registro creado correctamente.
- `204`: Registro eliminado correctamente.
- `404`: Registro no encontrado.

## 4. Requerimientos del modelo de datos

| ID    | Requerimiento                                                             |
| ----- | ------------------------------------------------------------------------- |
| RM-01 | El sistema debe contar con un mínimo de tres entidades.                   |
| RM-02 | Cada entidad debe tener atributos definidos.                              |
| RM-03 | Cada atributo debe tener un tipo de dato correspondiente.                 |
| RM-04 | Las entidades deben tener al menos una relación entre ellas.              |
| RM-05 | Se debe elaborar un diagrama entidad-relación.                            |
| RM-06 | El modelo de datos debe representar las necesidades reales de la empresa. |

## 5. Requerimientos de estructura del proyecto

El proyecto debe organizarse de la siguiente manera (actualizado al uso de Sequelize):

```
dark-kitchen-hub/
├── .gitignore
├── README.md
├── requerimientos.md
├── backend/
│   ├── .env                        # Variables de entorno reales (NO se sube a Git)
│   ├── .env.example                # Plantilla de variables de entorno (sí se sube)
│   ├── .sequelizerc                # Rutas de config, models, migrations y seeders para sequelize-cli
│   ├── package.json
│   └── src/
│       ├── app.js                  # Configuración de Express y middlewares
│       ├── server.js               # Sincronización de BD y arranque del puerto
│       ├── config/
│       │   └── database.js         # Configuración de MySQL con Sequelize (lee credenciales del .env)
│       ├── migrations/             # Migraciones generadas por CLI
│       ├── seeders/                # Datos iniciales para pruebas
│       ├── models/
│       │   ├── index.js            # Archivo generado por Sequelize
│       │   └── MarcaVirtual.js     # Modelo de la entidad Marca Virtual
│       ├── controllers/
│       │   └── marcasController.js # Lógica CRUD usando métodos de Sequelize
│       ├── routes/
│       │   └── marcasRoutes.js     # Endpoints REST
│       ├── middlewares/
│       │   └── errorHandler.js     # Manejo centralizado de excepciones
│       └── utils/
│           └── apiResponse.js      # Respuestas JSON consistentes
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx                 # Enrutador principal de vistas
        ├── main.jsx                # Render de React en el DOM
        ├── api/
        │   └── apiClient.js        # Instancia central de Axios / Fetch con baseURL
        ├── components/
        │   ├── common/             # Componentes transversales reutilizables
        │   │   ├── Navbar.jsx
        │   │   ├── Sidebar.jsx
        │   │   ├── ConfirmModal.jsx # Diálogo de confirmación para eliminar
        │   │   ├── Table.jsx        # Tabla dinámica para listar registros
        │   │   ├── Button.jsx
        │   │   └── Alert.jsx        # Notificaciones de error y éxito
        │   └── modules/            # Formularios y tablas específicas de cada entidad
        │       ├── marcas/
        │       │   ├── MarcaForm.jsx
        │       │   └── MarcaList.jsx
        │       └── platillos/
        │           ├── PlatilloForm.jsx
        │           └── PlatilloList.jsx
        ├── hooks/
        │   ├── useMarcas.js        # Lógica de consumo de datos y estados locales
        │   └── useModal.js         # Control de apertura/cierre de modales
        ├── layouts/
        │   └── DashboardLayout.jsx # Contenedor con Sidebar y Navbar integrados
        ├── pages/
        │   ├── MarcasPage.jsx      # Vista principal del CRUD de Marcas
        │   ├── PlatillosPage.jsx   # Vista principal del CRUD de Platillos
        │   └── DespachoPage.jsx    # Tablero de control de comandas
        └── services/
            ├── marcasService.js    # Funciones de consumo API: get, post, put, delete
            └── platillosService.js
```

- `models`: definición de las entidades.
- `controllers`: lógica de las operaciones CRUD.
- `routes`: rutas de la API.
- `app.js`: configuración de Express.
- `components`: formularios, tablas y botones.
- `pages`: vistas de cada entidad.
- `services`: comunicación con la API mediante Fetch o Axios.

## 6. Restricciones del proyecto

Importante

- No se debe implementar autenticación.
- No se debe implementar inicio de sesión (Login).
- No se debe implementar registro de usuarios.
- No se deben implementar tokens.
- No se deben implementar roles.
- El enfoque principal debe ser desarrollar CRUDs completos.

## 7. Entregables del primer día

- Documento con el tema elegido y su justificación empresarial.
- Identificación de las entidades principales.
- Diagrama entidad-relación con atributos y relaciones.
- Repositorio creado.
- Estructura de carpetas de backend y frontend.
- Servidor Node.js funcionando.
- Endpoint POST de al menos una entidad.
- Endpoint GET de al menos una entidad.
- Pruebas de los endpoints utilizando Postman, Thunder Client o una herramienta similar.

## 8. Criterios de evaluación

Distribución de la nota

Modelado de datos

35%

Enfoque empresarial

15%

Estructura del proyecto

20%

Inicio del CRUD

30%

## Mi recomendación

Te recomiendo trabajar en este orden:

1. Definir la problemática empresarial que resolverá el sistema.
2. Identificar al menos ocho entidades candidatas y seleccionar las principales.
3. Definir los atributos de cada entidad.
4. Establecer las relaciones entre las entidades.
5. Crear el diagrama entidad-relación.
6. Crear la base de datos.
7. Construir el backend con Node.js y Express.
8. Implementar y probar los CRUD.
9. Conectar React con la API.

Un detalle importante: aunque el documento pide CRUD completos como objetivo general, para la entrega del primer día solamente exige que estén funcionando los endpoints de crear y listar de al menos una entidad.

Así podemos avanzar paso a paso sin intentar construir todo el sistema de golpe.

---

## 9. Tecnologías y dependencias del backend

| Tipo       | Paquete         | Uso                                                       |
| ---------- | --------------- | --------------------------------------------------------- |
| Producción | `express`       | Servidor HTTP y definición de la API REST.                |
| Producción | `sequelize`     | ORM para modelar y consultar la base de datos.            |
| Producción | `mysql2`        | Driver de MySQL que utiliza Sequelize.                    |
| Producción | `dotenv`        | Carga de variables de entorno desde `.env`.               |
| Producción | `cors`          | Permite que el frontend (React) consuma la API.           |
| Desarrollo | `sequelize-cli` | Generación de modelos, migraciones y seeders desde la CLI. |
| Desarrollo | `nodemon`       | Reinicio automático del servidor al guardar cambios.      |

Comandos de instalación (ejecutados dentro de `backend/`):

```bash
# Dependencias de producción
npm install express sequelize mysql2 dotenv cors

# Dependencias de desarrollo
npm install --save-dev sequelize-cli nodemon
```

Scripts disponibles en `backend/package.json`:

| Script        | Comando                 | Descripción                            |
| ------------- | ----------------------- | -------------------------------------- |
| `npm start`   | `node src/server.js`    | Arranca el servidor.                   |
| `npm run dev` | `nodemon src/server.js` | Arranca el servidor en modo desarrollo. |

Variables de entorno (`backend/.env`, plantilla en `.env.example`):

| Variable      | Descripción                     |
| ------------- | ------------------------------- |
| `PORT`        | Puerto del servidor (3000).     |
| `DB_HOST`     | Host de MySQL.                  |
| `DB_PORT`     | Puerto de MySQL (3306).         |
| `DB_USER`     | Usuario de MySQL.               |
| `DB_PASSWORD` | Contraseña de MySQL.            |
| `DB_NAME`     | Nombre de la base de datos.     |

## 10. Bitácora de avances

### 04/11/2026 — Día 1

| #  | Actividad                                                                                                                                                       | Estado     |
| -- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1  | Análisis del documento de requerimientos.                                                                                                                       | Completado |
| 2  | Definición del tema **DarkKitchen Hub** y su justificación empresarial (`README.md`).                                                                            | Completado |
| 3  | Creación de `.gitignore` en la raíz (excluye `node_modules/`, `.env`, `dist/`, `build/`, logs).                                                                  | Completado |
| 4  | Creación de la estructura de carpetas de backend y frontend.                                                                                                    | Completado |
| 5  | Instalación de dependencias del backend (Express, Sequelize, mysql2, dotenv, cors, sequelize-cli, nodemon).                                                     | Completado |
| 6  | Reestructuración del backend para trabajar con Sequelize: `.sequelizerc`, `config/database.js`, `models/index.js` (generado con `npx sequelize-cli init:models`), carpetas `migrations/` y `seeders/`. | Completado |
| 7  | Configuración de credenciales de MySQL en `.env`; `database.js` las lee con `dotenv`. Creación de `.env.example` como plantilla.                                  | Completado |
| 8  | Creación del modelo base `MarcaVirtual` (`id`, `nombre`, `descripcion`, `activo`; tabla `marcas_virtuales`). Atributos sujetos a ajuste según el diagrama E-R.   | Completado |
| 9  | Configuración de `app.js` (CORS, JSON, ruta `/api/marcas`, respuesta 404 para rutas inexistentes, manejador de errores) y `server.js` (conexión + `sequelize.sync()`). | Completado |
| 10 | `errorHandler.js` con respuesta 400 para errores de validación de Sequelize y `apiResponse.js` con respuestas JSON estandarizadas.                              | Completado |
| 11 | Archivos del frontend creados como plantillas vacías (React y Vite aún sin instalar).                                                                           | Completado |
| 12 | Modelo `MarcaVirtual` definitivo: `id`, `nombre` VARCHAR(100), `tipo_cocina` VARCHAR(50), `horario_apertura` TIME, `horario_cierre` TIME, `activo` BOOLEAN (default true), timestamps. Con validaciones de Sequelize. | Completado |
| 13 | `marcasController.js` con `listarMarcas` y `crearMarca`, validación manual previa (obligatorios, tipos, longitud, formato de hora HH:MM o HH:MM:SS, booleano). | Completado |
| 14 | `marcasRoutes.js` con `GET /api/marcas` y `POST /api/marcas`.                                                                                                     | Completado |
| 15 | `errorHandler.js`: 400 para JSON mal formado y errores de validación de Sequelize; 500 con formato JSON homogéneo para el resto.                                 | Completado |
| 16 | `server.js`: `authenticate()` y luego `sync({ alter: true })` antes de abrir el puerto; si falla la BD, el proceso termina con error.                           | Completado |
| 17 | Pruebas automáticas: POST vacío → 400, tipos incorrectos → 400, JSON roto → 400, ruta inexistente → 404, error de BD → 500. Credenciales de MySQL verificadas.   | Completado |
| 18 | Corrección del nombre de la base de datos: `dark_kitchen_hub` → `dark_kitchen_db` (`.env`, `.env.example`, bitácora). Conexión, `sync` y `GET /api/marcas` (200) verificados. | Completado |
| 19 | Proyecto subido al repositorio de GitHub (`Luis458-git/Dark_kitchen`), excluyendo `.env` y `node_modules`. | Completado |
| 20 | Pruebas HTTP exitosas en Postman: `POST /api/marcas` (código 201) creando registros en MySQL y `GET /api/marcas` (código 200) listándolos correctamente. | Completado |

**Decisiones tomadas:**

- Se usa **Sequelize** como ORM en lugar de consultas SQL directas con `mysql2/promise`.
- El backend usa **CommonJS** (`require` / `module.exports`) por compatibilidad con `sequelize-cli`.
- Se instaló **Express 5** (última versión disponible).
- Las credenciales de la base de datos se guardan **solo en `.env`**, que no se sube al repositorio.

### Estado de los entregables del Día 1

| Entregable                                        | Estado      |
| ------------------------------------------------- | ----------- |
| Documento con el tema y justificación empresarial | Completado  |
| Identificación de las entidades principales       | Pendiente   |
| Diagrama entidad-relación                         | Pendiente   |
| Repositorio creado                                | Completado  |
| Estructura de carpetas de backend y frontend      | Completado  |
| Servidor Node.js funcionando                      | Completado (conectado a `dark_kitchen_db`) |
| Endpoint POST de al menos una entidad             | Completado (`POST /api/marcas`) |
| Endpoint GET de al menos una entidad              | Completado (`GET /api/marcas`)  |
| Pruebas con Postman / Thunder Client              | Completado (evidenciado con 201 Created y 200 OK) |

### Próximos pasos

1. Definir las entidades principales del negocio (mínimo 3 relacionadas).
2. Elaborar el Diagrama Entidad-Relación (ER) con atributos y relaciones (35% de la evaluación).
3. Guardar las capturas de Postman para el informe/documento de entrega.

