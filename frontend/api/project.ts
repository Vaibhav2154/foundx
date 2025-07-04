import api from '../config/api';

export const createProject = async (data: any) => {
  const response = await api.post('/projects/create', data);
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get('/projects/');
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await api.delete(`/projects/delete/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId: string, data: any) => {
  const response = await api.put(`/projects/update/${projectId}`, data);
  return response.data;
};

export const getProjectById = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const addMembersToProject = async (data: any) => {
  const response = await api.post('/projects/addMembers', data);
  return response.data;
};

export const removeMembers = async (data: any) => {
  const response = await api.post('/projects/removeMembers', data);
  return response.data;
};
