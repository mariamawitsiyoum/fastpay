import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTransactionHistory } from '../api/transactions'
import { formatDate } from '../utils/formatDate'
import Skeleton from './Skeleton'
import PrimaryButton from './PrimaryButton'

const typeLabels = {
  cash_in: 'Cash In',
  cash_out: 'Cash Out',
}

const typeStyles = {
  cash_in: 'text-emerald-600',
  cash_out: 'text-amber-600',
}

function RecentTransactions() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      const data = await getTransactionHistory()
      setTransactions(data.slice(0, 3))
      setLoading(false)
    }

    fetchTransactions()
  }, [])

  return (
    <div className="bg-white shadow-sm rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-500 text-sm">Recent Transactions</p>
        {/* <button
          onClick={() => navigate('/transactions')}
          className="text-sky-600 hover:text-sky-500 text-sm font-medium"
        >
          View all
        </button> */}
       <PrimaryButton
          onClick={() => navigate('/transactions')}
          className="!w-auto !text-sm"
        >
          View all
        </PrimaryButton>
      </div>

      {/* {loading && <p className="text-slate-500 text-sm">Loading...</p>} */}
      {loading && (
            <div className="flex flex-col gap-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
            )}

      {!loading && transactions.length === 0 && (
        <p className="text-slate-500 text-sm">No transactions yet.</p>
      )}

      {!loading && (
        <div className="flex flex-col gap-2">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between border-b border-slate-100 py-2 last:border-b-0"
            >
              <div>
                <p className={`text-sm font-medium ${typeStyles[txn.type]}`}>
                  {typeLabels[txn.type]}
                </p>
                <p className="text-slate-500 text-xs">{formatDate(txn.date)}</p>
              </div>
              <p className="text-slate-800 font-semibold text-sm">
                {txn.amount} {txn.currency}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentTransactions