import { useAuth } from '../context/AuthContext'
import ExchangeRateCard from '../components/ExchangeRateCard'
import RecentTransactions from '../components/RecentTransactions'
import KycStatusMessage from '../components/KycStatusMessage'

function Home() {
    const { user } = useAuth()
    console.log('Current user from context:', user)

  return (
     <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">
        Welcome back{user?.name ? `, ${user.name}` : ''}
      </h1>
       <KycStatusMessage status={user?.kyc_status} />
      <ExchangeRateCard />
      <div>
      <RecentTransactions />
      </div>
    </div>
  )
}

export default Home



