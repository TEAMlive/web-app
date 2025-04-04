import { User, UserCredentials, UserRegistration } from '../models/User';
import { MOCK_USERS, delay } from './mockData';

export class MockAuthService {
  private token: string | null = null;
  private currentUser: User | null = null;

  constructor() {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      this.token = savedToken;
      const userId = parseInt(savedToken.split('-')[0]);
      const foundUser = MOCK_USERS.find(user => user.id === userId);
      if (foundUser) {
        const { password, ...userData } = foundUser;
        this.currentUser = {
          ...userData,
          isAuthenticated: true
        };
      }
    }
  }

  async login(credentials: UserCredentials): Promise<User> {
    await delay(800);

    const user = MOCK_USERS.find(
      user => user.username === credentials.username && user.password === credentials.password
    );

    if (!user) {
      throw new Error('Неверное имя пользователя или пароль');
    }

    this.token = `${user.id}-${Date.now()}-token`;
    localStorage.setItem('authToken', this.token);

    const { password, ...userData } = user;
    this.currentUser = {
      ...userData,
      isAuthenticated: true
    };

    return this.currentUser;
  }

  async register(userData: UserRegistration): Promise<User> {
    await delay(1000);

    const existingUser = MOCK_USERS.find(
      user => user.username === userData.username || user.email === userData.email
    );

    if (existingUser) {
      throw new Error('Пользователь с таким именем или email уже существует');
    }

    const firstUser = MOCK_USERS[0];
    this.token = `${firstUser.id}-${Date.now()}-token`;
    localStorage.setItem('authToken', this.token);

    const { password, ...userInfo } = firstUser;
    this.currentUser = {
      ...userInfo,
      isAuthenticated: true
    };

    return this.currentUser;
  }

  async logout(): Promise<void> {
    await delay(300);
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('authToken');
  }

  async getCurrentUser(): Promise<User | null> {
    await delay(500);
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }
}

export class MockUserService {
  private static mockAuthInstance: MockAuthService | null = null;
  
  constructor() {
    if (!MockUserService.mockAuthInstance) {
      MockUserService.mockAuthInstance = new MockAuthService();
    }
  }

  async updateProfile(userId: number, userData: Partial<User>): Promise<User> {
    await delay(800);
    
    const currentUser = await MockUserService.mockAuthInstance?.getCurrentUser();
    if (!currentUser) {
      throw new Error('Пользователь не авторизован');
    }

    const updatedUser = {
      ...currentUser,
      ...userData
    };

    return updatedUser;
  }

  async updateAvatar(userId: number, file: File): Promise<User> {
    await delay(1200); 
    
    const currentUser = await MockUserService.mockAuthInstance?.getCurrentUser();
    if (!currentUser) {
      throw new Error('Пользователь не авторизован');
    }
    
    const newAvatarId = Math.floor(Math.random() * 70) + 1; 

    return {
      ...currentUser,
      avatar: `https://i.pravatar.cc/150?img=${newAvatarId}`
    };
  }
}
