import apiClient from '../api/apiClient';

export const authService = {
  login: async (correo, password) => {
    const res = await apiClient.post('/auth/login', { correo, password });
    return res.data;
  },

  register: async (nombre, correo, password) => {
    const res = await apiClient.post('/auth/register', { nombre, correo, password });
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  }
};
