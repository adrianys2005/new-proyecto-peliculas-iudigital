import api from './api';

export const getTypes = async () => {
  const response = await api.get('/types');
  return response.data;
};

export const getTypeById = async (id) => {
  const response = await api.get(`/types/${id}`);
  return response.data;
};

export const createType = async (typeData) => {
  const response = await api.post('/types', typeData);
  return response.data;
};

export const updateType = async (id, typeData) => {
  const response = await api.put(`/types/${id}`, typeData);
  return response.data;
};

export const deleteType = async (id) => {
  const response = await api.delete(`/types/${id}`);
  return response.data;
};
