import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth()
  if (authLoading) {
    return <p className="text-slate-500 text-center mt-10">Loading...</p>
  }
  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute