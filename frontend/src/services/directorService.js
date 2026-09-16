import api from './api';

export const getDirectors = async () => {
  const response = await api.get('/directors');
  return response.data;
};

export const getDirectorById = async (id) => {
  const response = await api.get(`/directors/${id}`);
  return response.data;
};

export const createDirector = async (directorData) => {
  const response = await api.post('/directors', directorData);
  return response.data;
};

export const updateDirector = async (id, directorData) => {
  const response = await api.put(`/directors/${id}`, directorData);
  return response.data;
};

export const deleteDirector = async (id) => {
  const response = await api.delete(`/directors/${id}`);
  return response.data;
};
