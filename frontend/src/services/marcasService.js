import apiClient from '../api/apiClient';

export const marcasService = {
  getAll: async () => {
    const res = await apiClient.get('/marcas');
    return res.data.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/marcas/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await apiClient.post('/marcas', data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/marcas/${id}`, data);
    return res.data.data;
  },

  toggleActivo: async (id, activoActual) => {
    const res = await apiClient.put(`/marcas/${id}`, { activo: !activoActual });
    return res.data.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/marcas/${id}`);
    return res.data;
  }
};
