import api from './api';

export const getMediaList = async () => {
  const response = await api.get('/media');
  return response.data;
};

export const getMediaById = async (id) => {
  const response = await api.get(`/media/${id}`);
  return response.data;
};

export const createMedia = async (mediaData) => {
  const response = await api.post('/media', mediaData);
  return response.data;
};

export const updateMedia = async (id, mediaData) => {
  const response = await api.put(`/media/${id}`, mediaData);
  return response.data;
};

export const deleteMedia = async (id) => {
  const response = await api.delete(`/media/${id}`);
  return response.data;
};
