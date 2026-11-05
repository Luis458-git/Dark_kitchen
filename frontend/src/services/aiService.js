import apiClient from '../api/apiClient';

export const aiService = {
  /**
   * Ejecuta la orquestación del Sistema Multi-Agente
   * @param {string} [clienteNombre] - Nombre opcional del cliente a analizar
   * @returns {Promise<{ orquestador: object, agente_analista: object, agente_recomendador: array, agente_cross_selling: object }>}
   */
  ejecutarMultiAgente: async (clienteNombre = '') => {
    const payload = clienteNombre ? { cliente_nombre: clienteNombre } : {};
    const res = await apiClient.post('/ai/multi-agent', payload);
    return res.data.data;
  },

  /**
   * Obtiene la lista de comensales frecuentes para el selector
   * @returns {Promise<Array>}
   */
  getClientes: async () => {
    const res = await apiClient.get('/ai/clientes');
    return res.data.data;
  }
};
