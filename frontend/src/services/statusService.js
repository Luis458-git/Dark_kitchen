/**
 * Servicio de Telemetría y Diagnóstico de Códigos de Estado HTTP
 * Utiliza fetch nativo con modo manual para evitar que Axios intercepte códigos 401 deslogueando al usuario
 */

const API_BASE = '/api/status';

export const statusService = {
  /**
   * Obtiene el catálogo completo de códigos soportados
   */
  async obtenerCatalogo() {
    const res = await fetch(`${API_BASE}/catalog`);
    if (!res.ok) {
      throw new Error(`Error al obtener catálogo: ${res.status}`);
    }
    return await res.json();
  },

  /**
   * Dispara una petición HTTP de prueba contra el endpoint /api/status/:code
   * @param {number} code - Código HTTP a probar (ej. 200, 201, 301, 400, 404, 500)
   * @param {string} method - Método HTTP (GET, POST, etc.)
   */
  async probarCodigo(code, method = 'GET') {
    const inicio = performance.now();
    let status = 0;
    let statusText = '';
    let headers = {};
    let data = null;
    let error = null;

    try {
      // Usamos no_redirect=true para recibir la respuesta HTTP de redirección sin que el navegador la consuma silenciosamente
      const url = `${API_BASE}/${code}?no_redirect=true`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Simulacion-Http': 'true'
        }
      });

      const fin = performance.now();
      status = res.status;
      statusText = res.statusText;

      // Extraer cabeceras relevantes
      headers = {
        'content-type': res.headers.get('content-type') || 'none',
        'location': res.headers.get('location') || null,
        'date': res.headers.get('date') || new Date().toUTCString(),
        'x-servidor': 'DarkKitchen-Hub-Atelier'
      };

      if (status === 204 || status === 304) {
        data = { message: `[Respuesta HTTP ${status} completada sin cuerpo]` };
      } else {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          data = await res.text();
        }
      }

      return {
        code,
        status,
        statusText,
        latenciaMs: Math.round(fin - inicio),
        headers,
        data,
        esExito: status >= 200 && status < 300,
        esRedireccion: status >= 300 && status < 400,
        esErrorCliente: status >= 400 && status < 500,
        esErrorServidor: status >= 500,
        timestamp: new Date().toLocaleTimeString()
      };
    } catch (err) {
      const fin = performance.now();
      return {
        code,
        status: status || 0,
        statusText: 'Network / Client Exception',
        latenciaMs: Math.round(fin - inicio),
        headers: {},
        data: null,
        error: err.message,
        esErrorServidor: true,
        timestamp: new Date().toLocaleTimeString()
      };
    }
  }
};
