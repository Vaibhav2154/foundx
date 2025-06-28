import api from '../config/api';

export const registerUser = async (data: any) => {
  const response = await api.post('/users/register', data);
  return response.data;
};

export const loginUser = async (data: any) => {
  const response = await api.post('/users/login', data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/users/logout');
  return response.data;
};
