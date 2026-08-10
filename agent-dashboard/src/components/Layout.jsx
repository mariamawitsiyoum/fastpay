//import { Link, useNavigate } from 'react-router-dom'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Layout({ children }) {
  const { agent, setAgent } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    setAgent(null)
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white flex items-center justify-between px-6 py-3">
        <h2 className="text-lg font-bold">FastPay Agent</h2>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'font-bold text-sky-400' : 'text-white hover:text-sky-300'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/customer-lookup"
            className={({ isActive }) =>
              isActive ? 'font-bold text-sky-400' : 'text-white hover:text-sky-300'
            }
          >
            Customer Lookup
          </NavLink>
          <NavLink
            to="/transactions/new"
            className={({ isActive }) =>
              isActive ? 'font-bold text-sky-400' : 'text-white hover:text-sky-300'
            }
          >
            New Transaction
          </NavLink>
          <NavLink
            to="/daily-report"
            className={({ isActive }) =>
              isActive ? 'font-bold text-sky-400' : 'text-white hover:text-sky-300'
            }
          >
            Daily Report
          </NavLink>
          <NavLink
            to="/commissions"
            className={({ isActive }) =>
              isActive ? 'font-bold text-sky-400' : 'text-white hover:text-sky-300'
            }
          >
            Commissions
          </NavLink>
          <NavLink
            to="/transactions"
            end
            className={({ isActive }) =>
              isActive ? 'font-bold text-sky-400' : 'text-white hover:text-sky-300'
            }
          >
            Transactions
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'font-bold text-sky-400' : 'text-white hover:text-sky-300'
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              isActive ? 'font-bold text-sky-400' : 'text-white hover:text-sky-300'
            }
          >
            Notifications
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-400">{agent?.name}</p>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}

export default Layout