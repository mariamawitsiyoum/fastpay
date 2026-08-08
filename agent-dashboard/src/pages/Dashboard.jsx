import { useQuery } from '@tanstack/react-query'
import { getDailyReport } from '../api/agents'
import Skeleton from '../components/Skeleton'
import { motion } from 'framer-motion'

function StatCard({ label, value, accentColor }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-sm border-l-4 ${accentColor} p-5`}
    >
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </motion.div>
  )
}

function Dashboard() {
  const today = new Date().toISOString().split('T')[0]

  const { data, isLoading, isError } = useQuery({
    queryKey: ['daily-report', today],
    queryFn: () => getDailyReport(today),
    placeholderData: {
      date: today,
      total_transactions: 12,
      total_volume: 45000,
      cash_in_total: 30000,
      cash_out_total: 15000,
      commission_earned: 450,
    },
  })

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-50 min-h-full">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-7 w-40 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (isError) {
    return <div className="p-8 text-red-600">Failed to load daily report.</div>
  }

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <div className="mb-8">
        <p className="text-sm text-sky-600 font-semibold uppercase tracking-wide">
            Daily Report
        </p>
        <h1 className="text-2xl font-bold text-slate-800">{data.date}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:auto-rows-[130px]">
        <motion.div
          whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
          transition={{ duration: 0.2 }}
          className="col-span-2 md:col-span-2 md:row-span-2 bg-sky-500 rounded-xl p-6 flex flex-col justify-between text-white"
        >
          <p className="text-sm font-medium text-sky-100">Total Volume</p>
          <p className="text-5xl font-bold">{data.total_volume}</p>
        </motion.div>

        <StatCard label="Total Transactions" value={data.total_transactions} accentColor="border-blue-600" />
        <StatCard label="Commission Earned" value={data.commission_earned} accentColor="border-indigo-600" />
        <StatCard label="Cash In" value={data.cash_in_total} accentColor="border-emerald-600" />
        <StatCard label="Cash Out" value={data.cash_out_total} accentColor="border-amber-600" />
      </div>
    </div>
  )
}

export default Dashboard