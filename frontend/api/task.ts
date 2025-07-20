import api from '../config/api';

export const getAllTasks = async (startUpId: string) => {
  try {
    const response = await api.post('/task/getAllTasks', { startUpId });
    return response.data;
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    throw error;
  }
};

export const getTasksByProject = async (projectId: string) => {
  try {
    const response = await api.get(`/${projectId}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    throw error;
  }
};

export const createTask = async (projectId: string, data: any) => {
  try {
    const response = await api.post(`/${projectId}/task/create`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (projectId: string, data: any) => {
  try {
    const response = await api.post(`/${projectId}/task/updateTask`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (projectId: string, taskId: string) => {
  try {
    // Note: Delete functionality not implemented in backend yet
    throw new Error('Delete functionality is not available yet');
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const assignMemberToTask = async (projectId: string, memberEmail: string, taskId: string) => {
  try {
    const response = await api.post(`/task/${projectId}/task/assignMember`, { memberEmail, taskId });
    return response.data;
  } catch (error) {
    console.error('Error assigning member to task:', error);
    throw error;
  }
};
