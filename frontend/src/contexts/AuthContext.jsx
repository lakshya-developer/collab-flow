import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/auth'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t) setToken(t)
    if (u) setUser(JSON.parse(u))
  }, [])

  async function login(email, password) {
    const data = await apiLogin(email, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email }))
    setToken(data.token)
    setUser({ id: data.id, name: data.name, email: data.email })
    return data
  }

  async function register(name, email, password) {
    const data = await apiRegister(name, email, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email }))
    setToken(data.token)
    setUser({ id: data.id, name: data.name, email: data.email })
    return data
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/signin')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
