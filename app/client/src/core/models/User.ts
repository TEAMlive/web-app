// User model that will connect with the Python backend
export interface User {
  id: number;
  username: string;
  email: string;
  isAuthenticated?: boolean;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string; // Добавлено поле для биографии
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  email: string;
  firstName?: string;
  lastName?: string;
}

export class UserModel implements User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  isAuthenticated: boolean;

  constructor(data: Partial<User>) {
    this.id = data.id || 0;
    this.username = data.username || '';
    this.email = data.email || '';
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.avatar = data.avatar;
    this.bio = data.bio;
    this.isAuthenticated = data.isAuthenticated || false;
  }

  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    } else if (this.firstName) {
      return this.firstName;
    } else if (this.lastName) {
      return this.lastName;
    }
    return this.username;
  }

  toJSON(): User {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      bio: this.bio,
      isAuthenticated: this.isAuthenticated
    };
  }

  static createEmpty(): UserModel {
    return new UserModel({
      isAuthenticated: false
    });
  }
}
