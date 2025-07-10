export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const SERVICE_BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};
