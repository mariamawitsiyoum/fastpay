import { useQuery } from '@tanstack/react-query'
import { getDailyReport } from '../api/agents'

function DailyReport() {
  const today = new Date().toISOString().split('T')[0]

  const { data, isLoading, isError } = useQuery({
    queryKey: ['daily-report', today],
    queryFn: () => getDailyReport(today),
  })

  if (isLoading) {
    return <div className="p-8 text-gray-500">Loading daily report...</div>
  }

  if (isError) {
    return <div className="p-8 text-red-600">Failed to load daily report.</div>
  }

  if (!data) {
    return <div className="p-8 text-gray-500">No report data available.</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Daily Report — {data.date ?? today}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold">{data.total_transactions}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Volume</p>
          <p className="text-2xl font-bold">{data.total_volume}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Cash In</p>
          <p className="text-2xl font-bold">{data.cash_in_total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Cash Out</p>
          <p className="text-2xl font-bold">{data.cash_out_total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 md:col-span-2">
          <p className="text-sm text-gray-500">Commission Earned</p>
          <p className="text-2xl font-bold">{data.commission_earned}</p>
        </div>
      </div>
    </div>
  )
}

export default DailyReport
