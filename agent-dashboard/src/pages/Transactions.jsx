import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTransactions } from '../api/transactions'
import Skeleton from '../components/Skeleton'
import { motion } from 'framer-motion'

function Transactions() {
  const [type, setType] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['transactions', type, from, to],
    queryFn: () => getTransactions({ type, from, to }),
    placeholderData: {
      transactions: [
        { id: 101, type: 'cash_in', amount: 5000, commission: 50, status: 'completed' },
        { id: 102, type: 'cash_out', amount: 2000, commission: 20, status: 'completed' },
        { id: 103, type: 'cash_in', amount: 12000, commission: 120, status: 'completed' },
      ],
      total: 3,
    },
  })

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <p className="text-sm text-sky-600 font-semibold uppercase tracking-wide">History</p>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Transaction History</h1>

      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-600">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border-b border-gray-300 focus:border-sky-500 outline-none py-2 pr-4 bg-transparent"
          >
            <option value="">All</option>
            <option value="cash_in">Cash In</option>
            <option value="cash_out">Cash Out</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-600">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border-b border-gray-300 focus:border-sky-500 outline-none py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-600">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border-b border-gray-300 focus:border-sky-500 outline-none py-2"
          />
        </div>
      </div>
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Commission</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="p-3"><Skeleton className="h-4 w-8" /></td>
                  <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="p-3"><Skeleton className="h-4 w-14" /></td>
                  <td className="p-3"><Skeleton className="h-4 w-10" /></td>
                  <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
)}
      {isError && <p className="text-red-600">Failed to load transactions.</p>}

      {data && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Commission</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              )}
              {data.transactions.map((tx) => (
                <motion.tr
                  key={tx.id}
                  whileHover={{ backgroundColor: 'rgb(248 250 252)' }}
                  transition={{ duration: 0.15 }}
                  className="border-t border-slate-100"
                >
                  <td className="p-3 text-slate-700">{tx.id}</td>
                  <td className="p-3">
                    <span className={tx.type === 'cash_in' ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                      {tx.type === 'cash_in' ? 'Cash In' : 'Cash Out'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{tx.amount}</td>
                  <td className="p-3 text-slate-700">{tx.commission}</td>
                  <td className="p-3 text-slate-500">{tx.status}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Transactions