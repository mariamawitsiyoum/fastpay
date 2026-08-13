import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ExchangeRateCard from '../components/ExchangeRateCard'

function Home() {
    const { user } = useAuth()
    console.log('Current user from context:', user)

  return (
     <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">
        Welcome back{user?.name ? `, ${user.name}` : ''}
      </h1>

      <ExchangeRateCard />
    </div>
  )
}

export default Home



