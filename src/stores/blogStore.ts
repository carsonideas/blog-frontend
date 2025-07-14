

import { create } from 'zustand';
import { apiClient } from '../utils/api';
import { Blog } from '../types/Blog';

interface BlogStore {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;
  fetchBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  createBlog: (blogData: Partial<Blog>) => Promise<Blog>;
  updateBlog: (id: string, blogData: Partial<Blog>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,

  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<{ blogs: Blog[] }>('/api/blogs');
      set({ blogs: response.blogs || response, loading: false });
    } catch (error: any) {
      console.error('Fetch blogs error:', error);
      set({ error: error.message || 'Failed to fetch blogs', loading: false });
      throw error;
    }
  },

  fetchBlogById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<{ blog: Blog }>(`/api/blogs/${id}`);
      set({ currentBlog: response.blog || response, loading: false });
    } catch (error: any) {
      console.error('Fetch blog by ID error:', error);
      set({ error: error.message || 'Failed to fetch blog', loading: false });
      throw error;
    }
  },

  createBlog: async (blogData: Partial<Blog>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post<{ blog: Blog }>('/api/blogs', blogData);
      const newBlog = response.blog || response;
      set((state) => ({
        blogs: [newBlog, ...state.blogs],
        loading: false
      }));
      return newBlog;
    } catch (error: any) {
      console.error('Create blog error:', error);
      set({ error: error.message || 'Failed to create blog', loading: false });
      throw error;
    }
  },

  updateBlog: async (id: string, blogData: Partial<Blog>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put<{ blog: Blog }>(`/api/blogs/${id}`, blogData);
      const updatedBlog = response.blog || response;
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog.id === id ? updatedBlog : blog
        ),
        currentBlog: updatedBlog,
        loading: false
      }));
    } catch (error: any) {
      console.error('Update blog error:', error);
      set({ error: error.message || 'Failed to update blog', loading: false });
      throw error;
    }
  },

  deleteBlog: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/api/blogs/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
        loading: false
      }));
    } catch (error: any) {
      console.error('Delete blog error:', error);
      set({ error: error.message || 'Failed to delete blog', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
