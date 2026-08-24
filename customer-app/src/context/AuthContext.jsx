import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('fastpay_user')

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    //   localStorage.removeItem('fastpay_user')
    }

    setAuthLoading(false)
  }, [])

  function loginUser(userData) {
    setUser(userData)
    localStorage.setItem('fastpay_user', JSON.stringify(userData))

  }

  function logoutUser() {
    setUser(null)
    localStorage.removeItem('fastpay_user')
  }
  function updateKycStatus(newStatus) {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, kyc_status: newStatus }
      localStorage.setItem('fastpay_user', JSON.stringify(updatedUser))
      return updatedUser
    })
  }


  const value = {
    user,
    authLoading,
    loginUser,
    logoutUser,
    updateKycStatus,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}