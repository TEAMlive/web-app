// User model that will connect with the Python backend
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isAuthenticated: boolean;
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
  isAuthenticated: boolean;

  constructor(data: Partial<User>) {
    this.id = data.id || 0;
    this.username = data.username || '';
    this.email = data.email || '';
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.avatar = data.avatar;
    this.isAuthenticated = data.isAuthenticated || false;
  }

  get fullName(): string {
    return this.firstName && this.lastName
      ? `${this.firstName} ${this.lastName}`
      : this.username;
  }

  toJSON(): User {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      isAuthenticated: this.isAuthenticated
    };
  }

  static createEmpty(): UserModel {
    return new UserModel({
      isAuthenticated: false
    });
  }
}
