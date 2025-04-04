import { Message, Chat } from '../models/Message';
import { MOCK_USERS } from './mockData';

// Генерируем тестовые сообщения
export const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    sender: 2, // admin
    receiver: 1, // testuser
    content: 'Привет! Как дела с новым проектом?',
    timestamp: new Date('2025-04-03T10:30:00'),
    read: true
  },
  {
    id: 2,
    sender: 1, // testuser
    receiver: 2, // admin
    content: 'Привет! Всё идёт по плану, уже заканчиваю первую часть.',
    timestamp: new Date('2025-04-03T10:32:00'),
    read: true
  },
  {
    id: 3,
    sender: 2, // admin
    receiver: 1, // testuser
    content: 'Отлично! Когда планируешь закончить?',
    timestamp: new Date('2025-04-03T10:33:00'),
    read: true
  },
  {
    id: 4,
    sender: 1, // testuser
    receiver: 2, // admin
    content: 'Думаю, к концу недели всё будет готово.',
    timestamp: new Date('2025-04-03T10:35:00'),
    read: true
  },
  {
    id: 5,
    sender: 2, // admin
    receiver: 1, // testuser
    content: 'Супер! Тогда в понедельник обсудим результаты.',
    timestamp: new Date('2025-04-03T10:36:00'),
    read: false
  },
  // Новый чат
  {
    id: 6,
    sender: 3, // Добавим еще одного пользователя для демонстрации
    receiver: 1, // testuser
    content: 'Привет! Ты видел новое обновление?',
    timestamp: new Date('2025-04-02T15:20:00'),
    read: true
  },
  {
    id: 7,
    sender: 1, // testuser
    receiver: 3, // Новый пользователь
    content: 'Да, уже тестирую. Выглядит отлично!',
    timestamp: new Date('2025-04-02T15:22:00'),
    read: true
  },
  {
    id: 8,
    sender: 3,
    receiver: 1,
    content: 'Как тебе новые функции?',
    timestamp: new Date('2025-04-02T15:25:00'),
    read: false
  }
];

// Генерируем чаты на основе сообщений
export const MOCK_CHATS: Chat[] = [
  {
    id: 1,
    participants: [1, 2], // testuser и admin
    lastMessage: MOCK_MESSAGES[4],
    unreadCount: 1
  },
  {
    id: 2,
    participants: [1, 3], // testuser и новый пользователь
    lastMessage: MOCK_MESSAGES[7],
    unreadCount: 1
  }
];

// Добавим третьего пользователя в mock-данные
export const MOCK_ADDITIONAL_USER = {
  id: 3,
  username: 'developer',
  email: 'dev@example.com',
  firstName: 'Разработчик',
  lastName: 'Проекта',
  avatar: 'https://i.pravatar.cc/150?img=3',
  password: 'dev123'
};
