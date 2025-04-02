import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { User, UserCredentials, UserRegistration } from '../models/User';

export class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;
  private token: string | null = null;

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token && config.headers) {
          config.headers['Authorization'] = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  loadTokenFromStorage(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.token = token;
    }
  }
  
  get apiClient(): AxiosInstance {
    return this.api;
  }
}

export class AuthService {
  private apiService: ApiService;

  constructor() {
    this.apiService = ApiService.getInstance();
    this.apiService.loadTokenFromStorage();
  }

  async login(credentials: UserCredentials): Promise<User> {
    try {
      const response = await axios.post('/auth/login', credentials);
      const { user, token } = response.data;
      this.apiService.setToken(token);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: UserRegistration): Promise<User> {
    try {
      const response = await axios.post('/auth/register', userData);
      const { user, token } = response.data;
      this.apiService.setToken(token);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post('/auth/logout');
      this.apiService.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
      this.apiService.clearToken();
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axios.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null;
  }
}

export class UserService {
  private apiInstance: AxiosInstance;

  constructor() {
    this.apiInstance = ApiService.getInstance().apiClient;
  }

  async updateProfile(userId: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await this.apiInstance.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async updateAvatar(userId: number, file: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await this.apiInstance.post(`/users/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update avatar error:', error);
      throw error;
    }
  }
}
