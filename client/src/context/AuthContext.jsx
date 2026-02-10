import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/services'
import { useMockLogin } from '../api/mockAuth'

const useMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = useCallback(async (email, password) => {
    if (useMock) {
      const data = useMockLogin(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      return
    }
    try {
      const { data } = await authApi.login(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
    } catch (err) {
      // Fallback: mock login when backend unavailable (demo mode)
      const data = useMockLogin(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    if (useMock) {
      // Simple mock registration
      const newUser = { id: 'mock-id', name, email, role: 'user' }
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      return
    }
    // No fallback to mock for register - if backend is down, registration fails
    const { data } = await authApi.register(name, email, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (!token || !stored) {
      setLoading(false)
      return
    }
    if (useMock) {
      setUser(JSON.parse(stored))
      setLoading(false)
      return
    }
    try {
      const { data } = await authApi.me()
      setUser(data)
    } catch {
      // Fallback: use stored user when backend unavailable (demo mode)
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
