import { User } from '../types/User'

class AuthStore {
  private user: User | null = null
  private token: string | null = null
  private listeners: (() => void)[] = []

  constructor() {
    this.token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (userData) {
      this.user = JSON.parse(userData)
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener())
  }

  setAuth(user: User, token: string) {
    this.user = user
    this.token = token
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.notify()
  }

  clearAuth() {
    this.user = null
    this.token = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.notify()
  }

  getUser() {
    return this.user
  }

  getToken() {
    return this.token
  }

  isAuthenticated() {
    return !!this.token && !!this.user
  }
}

export const authStore = new AuthStore()

