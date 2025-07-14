

import { create } from 'zustand';
import { apiClient } from '../utils/api';
import { User } from '../types/User';
import { AuthResponse, LoginCredentials, RegisterData, PasswordUpdate, ProfileUpdate } from '../types/Auth';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdate) => Promise<void>;
  updatePassword: (data: PasswordUpdate) => Promise<void>;
  clearError: () => void;
}

// Helper function to set auth data in localStorage
const setAuthData = (user: User, token: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Helper function to clear auth data from localStorage
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Initialize state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return {
    user,
    token,
    isAuthenticated: !!token && !!user
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...getInitialState(),
  loading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      const { user, token } = response;
      setAuthData(user, token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error: any) {
      console.error('Login error:', error);
      set({ error: error.message || 'Login failed', loading: false });
      throw error; // Re-throw to allow component to handle if needed
    }
  },

  register: async (data: RegisterData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
      const { user, token } = response;
      setAuthData(user, token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error: any) {
      console.error('Register error:', error);
      set({ error: error.message || 'Registration failed', loading: false });
      throw error; // Re-throw to allow component to handle if needed
    }
  },

  logout: () => {
    clearAuthData();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  updateProfile: async (data: ProfileUpdate) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put<{ user: User }>('/api/user/profile', data);
      const updatedUser = response.user;
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      set({ user: updatedUser, loading: false });
    } catch (error: any) {
      console.error('Update profile error:', error);
      set({ error: error.message || 'Profile update failed', loading: false });
      throw error;
    }
  },

  updatePassword: async (data: PasswordUpdate) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put('/api/user/password', data);
      set({ loading: false });
    } catch (error: any) {
      console.error('Update password error:', error);
      set({ error: error.message || 'Password update failed', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
