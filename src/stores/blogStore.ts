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
  createBlog: (blogData: Partial<Blog>) => Promise<void>;
  updateBlog: (id: string, blogData: Partial<Blog>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBlogStore = create<BlogStore>((set) => ({
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,

  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<Blog[]>('/blogs');
      set({ blogs: response, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchBlogById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<Blog>(`/blogs/${id}`);
      set({ currentBlog: response, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createBlog: async (blogData: Partial<Blog>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post<Blog>('/blogs', blogData);
      set((state) => ({
        blogs: [...state.blogs, response],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateBlog: async (id: string, blogData: Partial<Blog>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put<Blog>(`/blogs/${id}`, blogData);
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog.id === id ? response : blog
        ),
        currentBlog: response,
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteBlog: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/blogs/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null })
}));