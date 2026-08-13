import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { logoutUser } = useAuth()

  function handleLogout() {
    logoutUser()
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 px-6 py-4 flex items-center justify-between">
      <div className="text-xl font-bold">
        <span className="text-sky-600">fastPAY</span>
        <span className="text-sky-400"> ET</span>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/home" className="text-slate-100 hover:text-sky-400 text-sm font-medium">
          Home
        </Link>
        <Link to="/profile" className="text-slate-100 hover:text-sky-400 text-sm font-medium">
          Profile
        </Link>
        <Link to="/kyc" className="text-slate-100 hover:text-sky-400 text-sm font-medium">
           KYC
        </Link>
        <Link to="/agents" className="text-slate-100 hover:text-sky-400 text-sm font-medium">
           Agents
        </Link>
        {/* <Link to="/rates" className="text-slate-100 hover:text-sky-400 text-sm font-medium">
           Rates
        </Link> */}
        <Link to="/transactions" className="text-slate-100 hover:text-sky-400 text-sm font-medium">
          History
        </Link>

        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-500 text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar