import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        console.log('Retrieved token from localStorage:', token ? 'Token exists' : 'No token found');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.log('Received 401 error - clearing auth data');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
            // Optionally redirect to login page
            // window.location.href = '/sign-in';
        }
        return Promise.reject(error);
    }
);


export default api;

