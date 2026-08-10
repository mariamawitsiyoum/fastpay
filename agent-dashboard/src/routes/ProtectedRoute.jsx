import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { agent, loading } = useAuth()

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>
  }

  if (!agent) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
