import { UserModel } from '../models/User';

export const MOCK_USERS = [
  {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Тест',
    lastName: 'Пользователь',
    avatar: 'https://i.pravatar.cc/150?img=1',
    password: 'password123'
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Админ',
    lastName: 'Системы',
    avatar: 'https://i.pravatar.cc/150?img=2',
    password: 'admin123'
  }

];

export const createMockUserModel = (user: any): UserModel => {
  const { password, ...userData } = user;
  return new UserModel({
    ...userData,
    isAuthenticated: true
  });
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
