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

// Response interceptor to handle 401 errors and HTML responses
api.interceptors.response.use(
    (response) => {
        // Check if response is HTML when JSON was expected
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('text/html') && response.config.headers?.['Content-Type'] === 'application/json') {
            console.error('Received HTML response when JSON was expected. Server might be down or returning error page.');
            throw new Error('Server returned HTML instead of JSON. Please check if the backend is running.');
        }
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
        
        // Handle HTML responses in error cases
        if (error.response?.headers?.['content-type']?.includes('text/html')) {
            console.error('Server returned HTML error page:', error.response?.status);
            return Promise.reject(new Error(`Server error: ${error.response?.status || 'Unknown'}. Backend may be down.`));
        }
        
        return Promise.reject(error);
    }
);


export default api;

