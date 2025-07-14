import { User } from './User';

export interface LoginCredentials {
  email?: string;
  username?: string;
  emailOrUsername?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileUpdate {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
}