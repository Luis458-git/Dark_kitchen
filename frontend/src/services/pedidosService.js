import apiClient from '../api/apiClient';

export const pedidosService = {
  getAll: async () => {
    const res = await apiClient.get('/pedidos');
    return res.data.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/pedidos/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await apiClient.post('/pedidos', data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/pedidos/${id}`, data);
    return res.data.data;
  },

  cambiarEstado: async (id, nuevoEstado) => {
    const res = await apiClient.put(`/pedidos/${id}`, { estado: nuevoEstado });
    return res.data.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/pedidos/${id}`);
    return res.data;
  }
};
