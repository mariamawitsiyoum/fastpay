import { useState, useEffect } from 'react'
import { getTransactionHistory } from '../api/transactions'
import { formatDate } from '../utils/formatDate'

const typeLabels = {
  cash_in: 'Cash In',
  cash_out: 'Cash Out',
}

const typeStyles = {
  cash_in: 'text-emerald-600',
  cash_out: 'text-amber-600',
}

function TransactionHistory() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    async function fetchTransactions() {
      const data = await getTransactionHistory()
      setTransactions(data)
      setLoading(false)
    }

    fetchTransactions()
  }, [])

  if (loading) {
    return <p className="text-slate-500">Loading transaction history...</p>
  }

  const filteredTransactions = transactions.filter((txn) => {
    if (filterType === 'all') return true
    return txn.type === filterType
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Transaction History</h1>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm text-slate-700"
        >
          <option value="all">All transactions</option>
          <option value="cash_in">Cash In</option>
          <option value="cash_out">Cash Out</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {filteredTransactions.map((txn) => (
          <div key={txn.id} className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className={`font-semibold ${typeStyles[txn.type]}`}>
                {typeLabels[txn.type]}
              </span>
              <span className="text-slate-800 font-bold">
                {txn.amount} {txn.currency}
              </span>
            </div>

            <p className="text-slate-500 text-sm">{formatDate(txn.date)}</p>
            <p className="text-slate-700 text-sm">via {txn.agentName}</p>

            <a
              href={txn.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:text-sky-500 text-sm font-medium mt-2 inline-block"
            >
              View receipt
            </a>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <p className="text-slate-500 text-sm">No transactions found.</p>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory