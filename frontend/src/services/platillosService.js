import apiClient from '../api/apiClient';

export const platillosService = {
  getAll: async () => {
    const res = await apiClient.get('/platillos');
    return res.data.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/platillos/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await apiClient.post('/platillos', data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/platillos/${id}`, data);
    return res.data.data;
  },

  toggleDisponible: async (id, disponibleActual) => {
    const res = await apiClient.put(`/platillos/${id}`, { disponible: !disponibleActual });
    return res.data.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/platillos/${id}`);
    return res.data;
  }
};
