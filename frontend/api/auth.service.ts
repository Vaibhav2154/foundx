// auth.service.ts - API Service Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  startUpId?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data: any;
  message: string;
}

class AuthService {
  // Helper method to get auth token
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<AuthResponse> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const authToken = this.getAuthToken();
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async registerUser(userData: RegisterData): Promise<AuthResponse> {
    const startUpId = localStorage.getItem('startUpId');
    
    const requestData = {
      fullName: userData.fullName,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      ...(startUpId && { startUpId })
    };

    const response = await this.makeRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });

    if (response.success && startUpId) {
      localStorage.removeItem('startUpId');
    }

    return response;
  }

  async loginUser(loginData: LoginData): Promise<AuthResponse> {
    const response = await this.makeRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    // Store auth token if login successful
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response;
  }

  async logout(): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/users/logout', {
        method: 'POST',
      });

      // Clear stored auth data regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('startUpId');

      return response;
    } catch (error) {
      // Even if the API call fails, we should clear local storage
      // This handles cases where the token is expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('startUpId');
      
      // Return a success response since local logout succeeded
      return {
        success: true,
        data: null,
        message: 'Logged out locally'
      };
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const authService = new AuthService();