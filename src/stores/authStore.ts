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

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  loading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const { user, token } = response;
      setAuthData(user, token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  register: async (data: RegisterData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      const { user, token } = response;
      setAuthData(user, token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
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
      const response = await apiClient.put<User>('/users/profile', data);
      localStorage.setItem('user', JSON.stringify(response));
      set({ user: response, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updatePassword: async (data: PasswordUpdate) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put('/users/password', data);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null })
}));

