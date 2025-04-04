import { Message, Chat } from '../models/Message';
import { MOCK_MESSAGES, MOCK_CHATS, MOCK_ADDITIONAL_USER } from '../mocks/mockMessagesData';
import { MOCK_USERS } from '../mocks/mockData';

export class MessagesService {
  async getChats(userId: number): Promise<Chat[]> {
    try {
      // В реальном API здесь был бы запрос к серверу
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chats?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Ошибка получения чатов:', error);
      throw error;
    }
  }

  async getMessages(chatId: number): Promise<Message[]> {
    try {
      // В реальном API здесь был бы запрос к серверу
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chats/${chatId}/messages`);
      return await response.json();
    } catch (error) {
      console.error('Ошибка получения сообщений:', error);
      throw error;
    }
  }

  async sendMessage(message: Partial<Message>): Promise<Message> {
    try {
      // В реальном API здесь был бы запрос к серверу
      const response = await fetch(`${process.env.REACT_APP_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });
      return await response.json();
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      throw error;
    }
  }

  async markAsRead(messageId: number): Promise<Message> {
    try {
      // В реальном API здесь был бы запрос к серверу
      const response = await fetch(`${process.env.REACT_APP_API_URL}/messages/${messageId}/read`, {
        method: 'PUT'
      });
      return await response.json();
    } catch (error) {
      console.error('Ошибка отметки сообщения как прочитанного:', error);
      throw error;
    }
  }
}

export class MockMessagesService {
  async getChats(userId: number): Promise<Chat[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userChats = MOCK_CHATS.filter(chat => 
          chat.participants.includes(userId)
        );
        resolve(userChats);
      }, 300);
    });
  }

  async getMessages(chatId: number): Promise<Message[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Находим участников чата
        const chat = MOCK_CHATS.find(c => c.id === chatId);
        if (!chat) {
          resolve([]);
          return;
        }

        // Фильтруем сообщения между участниками чата
        const messages = MOCK_MESSAGES.filter(msg => 
          chat.participants.includes(msg.sender) && 
          chat.participants.includes(msg.receiver)
        );
        
        // Сортируем по времени
        messages.sort((a, b) => {
          const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
          const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
          return dateA.getTime() - dateB.getTime();
        });
        
        resolve(messages);
      }, 300);
    });
  }

  async sendMessage(message: Partial<Message>): Promise<Message> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage: Message = {
          id: MOCK_MESSAGES.length + 1,
          sender: message.sender || 0,
          receiver: message.receiver || 0,
          content: message.content || '',
          timestamp: new Date(),
          read: false
        };
        
        MOCK_MESSAGES.push(newMessage);
        
        // Обновляем последнее сообщение в чате
        const chatId = MOCK_CHATS.findIndex(chat => 
          chat.participants.includes(newMessage.sender) && 
          chat.participants.includes(newMessage.receiver)
        );
        
        if (chatId !== -1) {
          MOCK_CHATS[chatId].lastMessage = newMessage;
        } else {
          // Если чата не существует, создаем новый
          MOCK_CHATS.push({
            id: MOCK_CHATS.length + 1,
            participants: [newMessage.sender, newMessage.receiver],
            lastMessage: newMessage,
            unreadCount: 1
          });
        }
        
        resolve(newMessage);
      }, 300);
    });
  }

  async markAsRead(messageId: number): Promise<Message> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_MESSAGES.findIndex(msg => msg.id === messageId);
        if (index === -1) {
          reject(new Error('Сообщение не найдено'));
          return;
        }
        
        MOCK_MESSAGES[index].read = true;
        
        // Обновляем счетчик непрочитанных сообщений
        const message = MOCK_MESSAGES[index];
        const chat = MOCK_CHATS.find(chat => 
          chat.participants.includes(message.sender) && 
          chat.participants.includes(message.receiver)
        );
        
        if (chat && chat.unreadCount > 0) {
          chat.unreadCount--;
        }
        
        resolve(MOCK_MESSAGES[index]);
      }, 300);
    });
  }
  
  // Вспомогательный метод для получения пользователя по ID
  getUserById(userId: number) {
    const allUsers = [...MOCK_USERS, MOCK_ADDITIONAL_USER];
    return allUsers.find(user => user.id === userId);
  }
}
