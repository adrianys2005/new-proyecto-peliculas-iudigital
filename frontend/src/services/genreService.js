import api from './api';

export const getGenres = async () => {
  const response = await api.get('/genres');
  return response.data;
};

export const getGenreById = async (id) => {
  const response = await api.get(`/genres/${id}`);
  return response.data;
};

export const createGenre = async (genreData) => {
  const response = await api.post('/genres', genreData);
  return response.data;
};

export const updateGenre = async (id, genreData) => {
  const response = await api.put(`/genres/${id}`, genreData);
  return response.data;
};

export const deleteGenre = async (id) => {
  const response = await api.delete(`/genres/${id}`);
  return response.data;
};
