import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserModel, UserCredentials, UserRegistration } from '../models/User';
import { AuthService } from '../services/api';
import { MockAuthService } from '../mocks/mockApi';

interface AuthContextType {
  user: UserModel | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (userData: UserRegistration) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const USE_MOCK_API = process.env.REACT_APP_API_URL === undefined || process.env.REACT_APP_USE_MOCK_API === 'true';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const authService = USE_MOCK_API ? new MockAuthService() : new AuthService();

  useEffect(() => {
    // Load user on mount
    const loadUser = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(new UserModel({ ...userData, isAuthenticated: true }));
          } else {
            authService.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Сессия истекла. Пожалуйста, войдите снова.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [authService]);

  const login = async (credentials: UserCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await authService.login(credentials);
      setUser(new UserModel({ ...userData, isAuthenticated: true }));
    } catch (err: any) {
      setError(err.message || 'Не удалось войти. Проверьте ваши учетные данные.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserRegistration) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await authService.register(userData);
      setUser(new UserModel({ ...newUser, isAuthenticated: true }));
    } catch (err: any) {
      setError(err.message || 'Не удалось зарегистрироваться. Пожалуйста, попробуйте снова.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Не удалось выйти из системы.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
