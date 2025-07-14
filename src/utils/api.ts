

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

class ApiClient {
  private api: AxiosInstance

  constructor(baseURL: string ) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        let message = 'Something went wrong'
        
        if (error.response?.data) {
          if (typeof error.response.data === 'object' && error.response.data.message) {
            message = error.response.data.message
          } else if (typeof error.response.data === 'string') {
            message = error.response.data
          } else if (typeof error.response.data === 'object') {
            message = JSON.stringify(error.response.data)
          }
        } else if (error.message) {
          message = error.message
        } else if (error.response?.statusText) {
          message = error.response.statusText
        }
        
        throw new Error(message)
      }
    )
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get(endpoint, config)
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post(endpoint, data, config)
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put(endpoint, data, config)
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.patch(endpoint, data, config)
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete(endpoint, config)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
