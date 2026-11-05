# Especificación Técnica de Requerimientos y Checklist de Control — Día 2

**Proyecto:** DarkKitchen Hub (Gestor de Cocinas Ocultas y Despacho Multiplataforma)  
**Entorno Tecnológico:** Node.js, Express, Sequelize ORM, MySQL, React, Tailwind CSS / CSS Modules  
**Foco de la Jornada:** Cierre de CRUDs relacionales, autenticación centralizada con JWT y construcción de interfaz en React.

---

## 1. Contexto y Cambio de Alcance respecto al Día 1

| Aspecto | Día 1 | Día 2 |
| :--- | :--- | :--- |
| **Control de Acceso** | Sin autenticación (cero login, registro o tokens). | **Autenticación obligatoria**: rutas protegidas con JWT. |
| **Cobertura CRUD** | Endpoints iniciales (`POST` y `GET`) en 1 entidad. | **5 endpoints completos** en todas las entidades del modelo. |
| **Integridad Relacional** | Esquematizada en diagrama ER. | **Verificada en backend**: validación de FK y bloqueo en eliminación. |
| **Frontend** | Solo estructura base de carpetas. | **Aplicación funcional**: login, rutas protegidas y vistas CRUD completas. |
| **Modelo de Datos** | Entidades exclusivas de negocio. | Se suma la entidad transversal **Usuario** con contraseñas cifradas. |

> **Regla de Alcance:** La autenticación distingue estrictamente entre *usuario autenticado* y *usuario no autenticado*. La implementación de roles (admin/operador) o permisos diferenciados queda explícitamente fuera de alcance.

---

## 2. Requerimientos Funcionales (RF)

### 2.1. Módulo de Autenticación y Usuarios

* **RF-01 (Entidad Usuario):** Persistencia en base de datos de usuarios con los campos:
  * `id`: Entero autoincremental o UUID.
  * `nombre`: Cadena de texto obligatoria.
  * `correo`: Cadena de texto obligatoria, con formato de email válido y restricción de unicidad (`UNIQUE`).
  * `password`: Cadena cifrada (hash); debe exigir al menos 8 caracteres antes del cifrado.
  * `fechaCreacion`: Marca de tiempo generada automáticamente.
* **RF-02 (Registro de Usuario - `POST /api/auth/register`):** Endpoint público. Valida datos obligatorios y formato. Si el correo ya existe, retorna `400 Bad Request`. Cifra la contraseña con `bcrypt` y guarda el registro. Retorna `201 Created` con los datos del usuario (excluyendo el hash de la contraseña).
* **RF-03 (Inicio de Sesión - `POST /api/auth/login`):** Endpoint público. Recibe `correo` y `password`. Si las credenciales no coinciden, retorna `401 Unauthorized`. Si son válidas, genera y retorna `200 OK` con la estructura `{ token, usuario }`.
* **RF-04 (Consulta de Perfil Activo - `GET /api/auth/me`):** Endpoint protegido. Decodifica el token provisto y devuelve los datos del usuario autenticado con `200 OK`. Sin token válido responde `401 Unauthorized`.
* **RF-05 (Middleware de Protección de Rutas):** Interceptor que extrae el encabezado `Authorization: Bearer <token>`. Si falta, está malformado o expirado, corta la petición respondiendo inmediatamente `401 Unauthorized` con el cuerpo `{"error": "No autorizado"}`.

### 2.2. Módulo de CRUDs Empresariales y Relaciones

* **RF-06 (Ciclo CRUD Completo por Entidad):** Todas las entidades de negocio (mínimo 3: `marcas_virtuales`, `platillos`, `pedidos`/`ordenes_despacho`) deben exponer sus 5 endpoints operativos bajo el middleware de autenticación:
  1. `POST /api/:entidad` $\rightarrow$ `201 Created` (o `400 Bad Request` ante fallo de validación).
  2. `GET /api/:entidad` $\rightarrow$ `200 OK` con el arreglo de registros.
  3. `GET /api/:entidad/:id` $\rightarrow$ `200 OK` con el recurso, o `404 Not Found` si no existe.
  4. `PUT /api/:entidad/:id` $\rightarrow$ `200 OK` con el registro actualizado, o `404 Not Found`.
  5. `DELETE /api/:entidad/:id` $\rightarrow$ `200 OK` o `204 No Content`.
* **RF-07 (Validación de Integridad Referencial en Inserción/Edición):** Al crear o actualizar un registro dependiente de una clave foránea (ej. un platillo asignado a `marca_id`), el backend debe comprobar la existencia del registro padre. Si no existe, responder `400 Bad Request` o `404 Not Found`.
* **RF-08 (Restricción de Eliminación Relacional):** Si se solicita eliminar un registro que tiene elementos dependientes asociados (ej. borrar una marca que aún posee platillos activos), la API debe interceptar el conflicto de integridad referencial y responder con código `409 Conflict`.
* **RF-09 (Eager Loading en Consultas):** El endpoint de listado (`GET /api/:entidad`) debe incluir los datos descriptivos de la entidad foránea asociada (ej. incluir el nombre de la marca dentro de cada platillo).

### 2.3. Módulo de Front End en React

* **RF-10 (Autenticación en Cliente):** Formularios dedicados para Login (`/login`) y Registro (`/register`) con captura y despliegue de mensajes de error de la API.
* **RF-11 (Persistencia de Sesión):** Almacenar el JWT (en `localStorage` o Contexto de React) tras un login exitoso y redireccionar al panel principal.
* **RF-12 (Inyección Automática de Token):** Configurar el cliente HTTP (instancia de Axios o envoltorio de Fetch en `services/`) para inyectar automáticamente el header `Authorization: Bearer <token>` en cada consulta hacia rutas protegidas.
* **RF-13 (Rutas Protegidas en Navegación):** Implementar un componente protector (`ProtectedRoute`) en React Router que verifique la presencia del token. Si no existe sesión, debe redirigir a `/login`.
* **RF-14 (Expulsión por Token Vencido):** Si cualquier petición a la API responde con código `401 Unauthorized`, el cliente debe limpiar el token almacenado y redirigir automáticamente a `/login`.
* **RF-15 (Cierre de Sesión):** Botón visible de «Cerrar sesión» que destruye el token local y redirige a la vista de login.
* **RF-16 (Vistas de Gestión por Entidad):** Crear una vista dedicada por cada entidad de negocio que incluya:
  * Tabla/lista de datos con columnas descriptivas e información relacionada.
  * Formulario para crear nuevos registros y modal o vista para editar.
  * Botón de eliminar con confirmación obligatoria previa a la llamada HTTP.
  * En campos que representen claves foráneas, usar un menú selector (`<select>`) alimentado dinámicamente desde el endpoint `GET` de la entidad padre.

---

## 3. Requerimientos No Funcionales (RNF)

* **RNF-01 (Seguridad Criptográfica):** Las contraseñas deben cifrarse obligatoriamente con `bcrypt` (usando factor de coste/sal de al menos 10). Bajo ninguna circunstancia deben almacenarse en texto plano ni viajar en respuestas JSON de la API.
* **RNF-02 (Expiración y Secreto de Tokens):** El JWT debe firmarse con un tiempo de expiración definido (ej. `1h` u `8h`). La clave secreta (`JWT_SECRET`) debe residir exclusivamente en el archivo de variables de entorno `.env` y nunca exponerse en el código fuente.
* **RNF-03 (Protección de Repositorio y Variables de Entorno):** El archivo `.env` debe permanecer ignorado en `.gitignore`. Se debe versionar y documentar un archivo `.env.example` con la lista de variables necesarias sin valores reales.
* **RNF-04 (Estandarización de Errores):** Respuestas de error consistentes en formato JSON en toda la API ante peticiones inválidas (400), accesos no autorizados (401), recursos inexistentes (404), conflictos de dependencia (409) y fallos internos (500).
* **RNF-05 (Modularidad de Código):** Mantenimiento de la arquitectura desacoplada:
  * Backend: `models/`, `controllers/`, `routes/`, `middlewares/`, `config/`.
  * Frontend: `components/`, `pages/`, `services/`, `context/` (o hooks de sesión).

---

## 4. Investigación a Profundidad Obligatoria (Deep Research)

El informe técnico detallado se encuentra documentado en:  
📄 [`docs/investigacion_jwt_seguridad.md`](file:///c:/Users/Latitude%205490/Desktop/practicas%20de%20progra/practicas%20semana%2010/Mini_proyecto/docs/investigacion_jwt_seguridad.md)

1. **Anatomía del JWT:** Tres segmentos Base64URL ($\text{Header} \,.\, \text{Payload} \,.\, \text{Signature}$). Diferencia entre codificación e integridad por firma HMAC SHA-256.
2. **Implementación en Express:** Uso de `jsonwebtoken` con `jwt.sign()` y `jwt.verify()`, captura de `TokenExpiredError` y `JsonWebTokenError`.
3. **Ciclo de Vida y Renovación:** Ventana de expiración (`8h`) y estrategia de Refresh Tokens.
4. **Vectores de Ataque en Front End:** `localStorage` (XSS) vs. `Cookie HttpOnly` (CSRF), justificación técnica de la solución adoptada.
5. **Políticas de Seguridad en Producción:** Minimización de payload, cifrado bcrypt (coste 10), transporte HTTPS y clave privada en `.env`.
6. **Fuentes Formales Consultadas:** RFC 7519, OWASP Cheat Sheets y documentación oficial de Auth0 y Node.js.

---

## 5. Matriz de Entregables y Criterios de Evaluación

| Criterio Oficial | Ponderación | Entregables Requeridos para Calificación | Estado |
| :--- | :---: | :--- | :---: |
| **CRUDs completos** | **30%** | Los 5 endpoints de todas las entidades responden JSON con códigos semánticos correctos (`200`, `201`, `204`, `400`, `404`, `409`). | **Completado (100%)** |
| **Autenticación** | **25%** | Registro (`/register`), login (`/login`) con JWT, contraseñas hasheadas con bcrypt y middleware `auth` protegiendo rutas privadas. | **Completado (100%)** |
| **Front end en React** | **20%** | Login, registro, rutas protegidas, botón de logout, y una página por entidad con tablas, formularios y eliminación con confirmación. | **Completado (100%)** |
| **Relaciones y validaciones** | **15%** | Verificación de existencia de claves foráneas en backend, prevención de eliminación con dependencias y validación estricta de inputs. | **Completado (100%)** |
| **Organización y documentación** | **10%** | Estructura de carpetas limpia, `.env` fuera de Git, `README.md` con instrucciones de instalación, informe Deep Research y colección de Postman. | **Completado (100%)** |

---

## 6. Checklist de Ejecución y Seguimiento (Día 2)

### Fase 1: Investigación y Documentación Base (10%)
- [X] Redactar el informe de investigación a profundidad sobre JWT, almacenamiento y vectores de ataque (XSS vs. CSRF). *(Completado en `docs/investigacion_jwt_seguridad.md`)*
- [X] Incorporar las fuentes bibliográficas y documentar la decisión técnica adoptada. *(Completado: RFC 7519, OWASP, Auth0)*
- [X] Actualizar el Diagrama Entidad-Relación visual incorporando la entidad `Usuario`. *(Completado en `README.md`)*
- [X] Actualizar el archivo `README.md` con los pasos para clonar, configurar `.env`, instalar dependencias y levantar backend y frontend. *(Completado en Secciones 9 y 10 de `README.md`)*
- [X] Verificar que `.env` esté listado en `.gitignore` y que exista `.env.example` sincronizado. *(Completado)*

### Fase 2: Backend — Autenticación y Seguridad (25%)
- [X] Instalar dependencias de seguridad: `npm install bcrypt jsonwebtoken` en `backend/`. *(Completado)*
- [X] Crear el modelo Sequelize `Usuario.js` con validaciones de unicidad y longitud mínima de contraseña. *(Completado en `backend/src/models/Usuario.js`)*
- [X] Crear el controlador `authController.js` con las funciones `register`, `login` y `getMe`. *(Completado en `backend/src/controllers/authController.js`)*
- [X] Endpoint `POST /api/auth/register`: Comprobar duplicidad de correo, hashear password y responder `201 Created` sin exponer el hash. *(Completado y probado)*
- [X] Endpoint `POST /api/auth/login`: Comparar password con `bcrypt.compare`, firmar token JWT con expiración y responder `200 OK` con `{ token, usuario }`. *(Completado y probado)*
- [X] Endpoint `GET /api/auth/me`: Responder datos del usuario correspondiente al token decodificado. *(Completado y probado)*
- [X] Implementar middleware `authMiddleware.js`: Validar `Authorization: Bearer <token>`; responder `401 Unauthorized` si falta o no es válido. *(Completado en `backend/src/middlewares/authMiddleware.js`)*
- [X] Proteger las rutas de las entidades de negocio con el middleware de autenticación. *(Completado: marcas, platillos y pedidos protegidos)*

### Fase 3: Backend — CRUDs Completos y Validación Relacional (45%)
- [X] **Entidad 1 (`marcas_virtuales`):** Completar endpoints `GET /:id`, `PUT /:id` y `DELETE /:id`. *(Completado en `marcasController.js`)*
- [X] **Entidad 2 (`platillos`):** Implementar los 5 endpoints del CRUD (`POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id`). *(Completado en `platillosController.js`)*
- [X] **Entidad 3 (`ordenes_despacho` / `pedidos`):** Implementar los 5 endpoints del CRUD completo. *(Completado en `pedidosController.js`)*
- [X] Validar en backend la existencia de la entidad foránea referenciada en `POST` y `PUT`; devolver `400` o `404` si no existe. *(Completado: validado con código 400)*
- [X] Manejar restricción de eliminación: devolver `409 Conflict` si se intenta borrar un registro con dependencias asociadas. *(Completado: verificado con código 409)*
- [X] Configurar carga relacionada (eager loading / include de Sequelize) en los listados `GET`. *(Completado: `include: [MarcaVirtual]`)*
- [X] Exportar colección de pruebas en Postman o Thunder Client con casos de éxito (`200`, `201`, `204`) y error (`400`, `401`, `404`, `409`). *(Completado en `docs/DarkKitchen_Hub_Day2.postman_collection.json`)*

### Fase 4: Frontend — Autenticación, Rutas Protegidas y Vistas (20%)
- [X] Configurar cliente HTTP base (`apiClient.js`) con interceptor que adjunte el encabezado `Authorization: Bearer <token>`. *(Completado en `frontend/src/api/apiClient.js`)*
- [X] Configurar interceptor de respuesta: si la API devuelve `401`, purgar token y redirigir a `/login`. *(Completado en `apiClient.js`)*
- [X] Implementar contexto de autenticación (`AuthContext.jsx`) con funciones de `login`, `logout` y persistencia de sesión. *(Completado en `frontend/src/context/AuthContext.jsx`)*
- [X] Crear componente `ProtectedRoute.jsx` para restringir el acceso a vistas privadas sin token. *(Completado en `frontend/src/components/common/ProtectedRoute.jsx`)*
- [X] Construir vistas públicas: `LoginPage.jsx` y `RegisterPage.jsx`. *(Completado en `frontend/src/pages/`)*
- [X] Diseñar barra de navegación con botón visible de «Cerrar sesión». *(Completado en `frontend/src/components/common/Navbar.jsx`)*
- [X] Construir vista CRUD para Entidad 1 (tabla de listado, formulario de creación/edición y botón eliminar con confirmación). *(Completado en `frontend/src/pages/MarcasPage.jsx`)*
- [X] Construir vista CRUD para Entidad 2 (tabla con datos relacionados, formularios y selector dinámico `<select>`). *(Completado en `frontend/src/pages/PlatillosPage.jsx`)*
- [X] Construir vista CRUD para Entidad 3 (tabla, formularios y selectores dinámicos hacia entidades relacionadas). *(Completado en `frontend/src/pages/DespachoPage.jsx`)*
- [X] Verificar que todos los formularios capturen errores de validación emitidos por la API. *(Completado con componentes `Alert` reactivos)*
