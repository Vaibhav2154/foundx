import api from '../config/api';

export const createProject = async (data: any) => {
  try {
    const response = await api.post('/projects/create', data);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const response = await api.get('/projects/');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
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
