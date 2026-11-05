# Informe de Investigación Técnica: Arquitectura de Autenticación con JWT y Seguridad en Clientes Web

**Proyecto:** DarkKitchen Hub  
**Fecha:** 05/11/2026  
**Módulo:** Seguridad y Autenticación Centralizada (Día 2)  
**Autor:** Equipo de Desarrollo Backend & Frontend  

---

## 1. Anatomía y Funcionamiento Criptográfico del JSON Web Token (JWT)

El estándar RFC 7519 define al **JSON Web Token (JWT)** como un contenedor compacto y autónomo para la transmisión segura de afirmaciones (*claims*) en formato JSON entre partes.

### 1.1. Estructura de los Tres Segmentos
Un JWT está compuesto por tres cadenas separadas por puntos (`.`):
$$\text{JWT} = \text{Header} \,.\, \text{Payload} \,.\, \text{Signature}$$

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AZGlsby5jb20iLCJpYXQiOjE3OTM4ODgwMDAsImV4cCI6MTc5Mzg5MTYwMH0.3eD8wKjF7gL...
```

1. **Header (Encabezado):** Objeto JSON codificado en **Base64URL** que especifica los metadatos del token:
   * `alg`: Algoritmo criptográfico de firma (ej. `HS256` para HMAC con SHA-256).
   * `typ`: Tipo de token (`JWT`).
2. **Payload (Carga útil / Claims):** Objeto JSON codificado en **Base64URL** con las afirmaciones sobre la entidad:
   * *Claims registrados:* `iat` (*issued at*), `exp` (*expiration time*).
   * *Claims públicos/privados del negocio:* `id`, `correo`, `nombre`.
3. **Signature (Firma criptográfica):** Se genera tomando la concatenación del Header y el Payload codificados, procesándolos mediante el algoritmo indicado y una clave secreta privada:
   $$\text{Signature} = \text{HMAC-SHA256}(\text{base64UrlEncode}(\text{Header}) + "." + \text{base64UrlEncode}(\text{Payload}), \, \text{SECRET\_KEY})$$

### 1.2. Codificación vs. Cifrado
* **Codificación (Encoding):** Base64URL **no es cifrado**. Cualquier receptor o intermediario puede decodificar el Header y el Payload y leer su contenido directamente.
* **Integridad (Signature):** La firma no oculta los datos, pero garantiza **integridad e inalterabilidad**. Si un atacante modifica un solo carácter del payload (por ejemplo, cambiar `id: 2` por `id: 1`), el cálculo de la firma en el servidor con la clave privada no coincidirá, y la librería rechazará el token de inmediato.

---

## 2. Implementación en Express con `jsonwebtoken`

En el ecosistema Node.js, la librería de referencia es `jsonwebtoken`.

### 2.1. Métodos Principales
* **`jwt.sign(payload, secret, [options])`:** Genera y firma el token con expiración:
  ```js
  const token = jwt.sign(
    { id: usuario.id, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
  ```
* **`jwt.verify(token, secret)`:** Verifica la validez temporal y criptográfica de la firma. Devuelve el payload decodificado o lanza una excepción.

### 2.2. Manejo de Errores de Verificación
* **`TokenExpiredError`:** Ocurre cuando el tiempo actual supera `payload.exp`. Se captura y responde con `401 Unauthorized` indicando la expiración de la sesión.
* **`JsonWebTokenError`:** Ocurre ante tokens truncados, firmas falsificadas o algoritmos discrepantes. Se responde con `401 Unauthorized`.

---

## 3. Ciclo de Vida del Token, Expiración y Estrategias de Renovación

### 3.1. Ventanas de Expiración
* **Tokens de corta duración (15 min a 1 hora):** Minimizan la ventana de riesgo si el token es interceptado.
* **Tokens de sesión laboral (4 a 8 horas):** Adecuados para sistemas internos de cocina/despacho donde se busca evitar que el operador deba iniciar sesión repetidas veces durante su turno.

### 3.2. Estrategia de Refresh Tokens (Ampliación)
Para sistemas distribuidos de alta seguridad se implementa el patrón de dos tokens:
* **Access Token:** Corta vida (15 min), viaja en el encabezado `Authorization`.
* **Refresh Token:** Larga vida (7 a 30 días), almacenado de forma segura en base de datos y/o en una cookie `httpOnly`. Cuando el Access Token expira, el frontend solicita un nuevo par mediante `POST /api/auth/refresh`.

---

## 4. Análisis de Vulnerabilidades y Almacenamiento en Front End: XSS vs. CSRF

| Mecanismo de Almacenamiento | Vector Principal de Riesgo | Nivel de Exposición | Mitigación Técnica |
| :--- | :--- | :--- | :--- |
| **`localStorage` / `sessionStorage`** | **XSS (Cross-Site Scripting)** | **Alta:** Cualquier script malicioso inyectado puede ejecutar `localStorage.getItem('token')` y exfiltrarlo. | Sanitizar todo el contenido HTML de entrada, implementar Content Security Policy (CSP) estricta y validar entradas en cliente y servidor. |
| **`Cookie HttpOnly`** | **CSRF (Cross-Site Request Forgery)** | **Media:** JavaScript no puede leer la cookie, lo que previene el robo por XSS, pero el navegador la envía automáticamente en peticiones cross-origin no deseadas. | Flags de cookie `HttpOnly; Secure; SameSite=Strict` o `SameSite=Lax`, sumado a tokens anti-CSRF o cabeceras personalizadas (`X-Requested-With`). |

### Decisión Técnica para DarkKitchen Hub (Día 2)
Para este entorno educativo y de integración API REST pura desacoplada con cliente React:
1. Se utiliza almacenamiento del JWT en **`localStorage`**, permitiendo que el cliente HTTP inyecte explícitamente el encabezado estándar:
   ```http
   Authorization: Bearer <token>
   ```
2. Esto elimina la vulnerabilidad a ataques **CSRF**, ya que las solicitudes que alteran el estado no envían credenciales implícitas de cookies.
3. Se previene **XSS** mediante el escape nativo de cadenas de React en el DOM y sanitización estricta de inputs.
4. Se implementa un interceptor de Axios que purga el almacenamiento y redirige automáticamente ante respuestas `401`.

---

## 5. Políticas de Seguridad en Producción

1. **Minimización de Datos en el Payload:** Solo se incluyen identificadores no sensibles (`id`, `correo`, `nombre`). **Nunca incluir contraseñas, hashes, números telefónicos privados ni información financiera**.
2. **Cifrado Fuerte de Contraseñas:** Algoritmo `bcrypt` con un costo de sal de 10 (`saltRounds = 10`), resistente a ataques de diccionario y fuerza bruta mediante ralentización computacional deliberada.
3. **Transporte Obligatorio HTTPS:** En producción, todo el tráfico debe circular sobre TLS/SSL para evitar ataques Man-in-the-Middle (MitM) que capturen el token en tránsito.
4. **Protección del Secreto:** `JWT_SECRET` debe ser una cadena aleatoria de alta entropía (mínimo 32 caracteres) guardada exclusivamente en variables de entorno `.env` que nunca se suben al control de versiones.

---

## 6. Fuentes Bibliográficas y Referencias Oficiales

1. **RFC 7519 — JSON Web Token (JWT):** Internet Engineering Task Force (IETF). [https://datatracker.ietf.org/doc/html/rfc7519](https://datatracker.ietf.org/doc/html/rfc7519)
2. **OWASP Foundation — JSON Web Token Cheat Sheet for Java/Node.js:** [https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
3. **OWASP Foundation — Cross-Site Scripting (XSS) Prevention Cheat Sheet:** [https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
4. **Auth0 by Okta — Token-Based Authentication Best Practices:** [https://auth0.com/docs/secure/tokens/json-web-tokens](https://auth0.com/docs/secure/tokens/json-web-tokens)
5. **Node.js `jsonwebtoken` Official Documentation:** [https://github.com/auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
