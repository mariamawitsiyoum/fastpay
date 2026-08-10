import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCommissions } from '../api/agents'
import Skeleton from '../components/Skeleton'
import { motion } from 'framer-motion'

function Commissions() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['commissions', from, to],
    queryFn: () => getCommissions({ from, to }),
    placeholderData: {
      commissions: [
        { transaction_id: 101, amount: 50, date: '2026-07-27' },
        { transaction_id: 102, amount: 20, date: '2026-07-26' },
        { transaction_id: 103, amount: 120, date: '2026-07-25' },
      ],
      total_commission: 190,
    },
  })

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <p className="text-sm text-sky-600 font-semibold uppercase tracking-wide">Earnings</p>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Commissions</h1>

      <div className="flex gap-4 mb-6 items-end">
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
        <>
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-sky-500 p-5 mb-6 max-w-xs">
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-8 w-20" />
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="p-3"><Skeleton className="h-4 w-10" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-14" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
)}
      {isError && <p className="text-red-600">Failed to load commissions.</p>}

      {data && (
        <>
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-sky-500 p-5 mb-6 max-w-xs">
            <p className="text-sm text-slate-500 font-medium">Total Commission</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{data.total_commission}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.commissions.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-slate-500">
                      No commissions found.
                    </td>
                  </tr>
                )}
                {data.commissions.map((c) => (
                  <motion.tr
                    key={c.transaction_id}
                    whileHover={{ backgroundColor: 'rgb(248 250 252)' }}
                    transition={{ duration: 0.15 }}
                    className="border-t border-slate-100"
                  >
                    <td className="p-3 text-slate-700">{c.transaction_id}</td>
                    <td className="p-3 text-slate-700">{c.amount}</td>
                    <td className="p-3 text-slate-500">{c.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Commissions