# Control de Requerimientos y Entregables — Mini Proyecto 1 (Día 1)

**Proyecto:** DarkKitchen Hub (Gestor de Cocinas Ocultas y Despacho Multiplataforma)  
**Stack Base:** Node.js, Express, Sequelize, MySQL, React  
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

## 3. Estado Final del Día 1
Todos los criterios exigidos en la rúbrica del Día 1 han sido alcanzados con éxito.
