import api from '../config/api';

export const createTask = async (projectId: string, data: any) => {
  const response = await api.post(`/project/${projectId}/task/create`, data);
  return response.data;
};

export const assignMember = async (projectId: string, data: any) => {
  const response = await api.post(`/project/${projectId}/task/assignMember`, data);
  return response.data;
};

export const updateTask = async (projectId: string, data: any) => {
  const response = await api.post(`/project/${projectId}/task/updateTask`, data);
  return response.data;
};

export const deAssignMember = async (projectId: string, data: any) => {
  const response = await api.post(`/project/${projectId}/task/deleteMember`, data);
  return response.data;
};
