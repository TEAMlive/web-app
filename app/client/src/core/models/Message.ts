import { UserModel } from './User';

export interface Message {
  id: number;
  sender: number; // ID пользователя
  receiver: number; // ID пользователя
  content: string;
  timestamp: Date | string;
  read: boolean;
}

export interface Chat {
  id: number;
  participants: number[]; // ID пользователей
  lastMessage?: Message;
  unreadCount: number;
}

export class MessageModel implements Message {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: Date | string;
  read: boolean;

  constructor(data: Partial<Message>) {
    this.id = data.id || 0;
    this.sender = data.sender || 0;
    this.receiver = data.receiver || 0;
    this.content = data.content || '';
    this.timestamp = data.timestamp || new Date();
    this.read = data.read !== undefined ? data.read : false;
  }

  get isRead(): boolean {
    return this.read;
  }

  markAsRead(): void {
    this.read = true;
  }

  get formattedTime(): string {
    const date = this.timestamp instanceof Date 
      ? this.timestamp 
      : new Date(this.timestamp);
    
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get formattedDate(): string {
    const date = this.timestamp instanceof Date 
      ? this.timestamp 
      : new Date(this.timestamp);
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  }

  toJSON(): Message {
    return {
      id: this.id,
      sender: this.sender,
      receiver: this.receiver,
      content: this.content,
      timestamp: this.timestamp,
      read: this.read
    };
  }
}
