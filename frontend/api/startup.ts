import api from '../config/api';

// Create a new startup
export const createStartUp = async (data: any) => {
  const response = await api.post('/startups/create', data);
  return response.data;
};

// Get startup info (requires auth)
export const getStartUp = async () => {
  const response = await api.get('/startups/');
  return response.data;
};

// Access a startup (no auth required)
export const getAccessStartUp = async (data: any) => {
  const response = await api.post('/startups/access', data);
  return response.data;
};

// Get employees (no auth required)
export const getEmployees = async (data: any) => {
  const response = await api.post('/startups/getEmployees', data);
  return response.data;
};
