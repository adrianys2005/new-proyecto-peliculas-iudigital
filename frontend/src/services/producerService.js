import api from './api';

export const getProducers = async () => {
  const response = await api.get('/producers');
  return response.data;
};

export const getProducerById = async (id) => {
  const response = await api.get(`/producers/${id}`);
  return response.data;
};

export const createProducer = async (producerData) => {
  const response = await api.post('/producers', producerData);
  return response.data;
};

export const updateProducer = async (id, producerData) => {
  const response = await api.put(`/producers/${id}`, producerData);
  return response.data;
};

export const deleteProducer = async (id) => {
  const response = await api.delete(`/producers/${id}`);
  return response.data;
};
