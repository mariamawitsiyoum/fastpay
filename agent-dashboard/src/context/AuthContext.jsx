import { createContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../api/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [agent, setAgent] = useState({ name: 'Test Agent' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    getCurrentUser()
      .then((user) => setAgent(user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ agent, setAgent, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
