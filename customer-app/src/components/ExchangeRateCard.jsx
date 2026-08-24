import { useState, useEffect } from 'react'
import { getExchangeRates } from '../api/exchangeRate'
import Skeleton from './Skeleton'

const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']

function ExchangeRateCard() {
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    async function fetchRate() {
      setLoading(true)
      setError('')

      try {
        const data = await getExchangeRates(baseCurrency)

        if (data.result !== 'success') {
          setError('Could not load exchange rate')
          return
        }

        setRates(data)
      } catch (err) {
        setError('Could not load exchange rate')
      } finally {
        setLoading(false)
      }
    }

    fetchRate()
  }, [baseCurrency])

  return (
    <div className="bg-white shadow-sm rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-500 text-sm">Exchange Rate</p>

        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
          className="border border-slate-300 rounded px-2 py-1 text-sm text-slate-700"
        >
          {currencyOptions.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      {/* {loading && <p className="text-slate-500 text-sm">Loading...</p>} */}
      {loading && (
        <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && rates && (
        <>
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 mb-3">
            <p className="text-slate-500 text-sm mb-1">1 {baseCurrency} equals</p>
            <p className="text-sky-600 text-3xl font-bold">
              {rates.conversion_rates.ETB.toFixed(2)} ETB
            </p>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sky-600 hover:text-sky-500 text-sm font-medium"
          >
            {expanded ? 'Hide other rates' : 'See other rates'}
          </button>

          {expanded && (
            <div className="mt-3">
              <p className="text-slate-500 text-sm mb-2">
                Other currencies (per 1 {baseCurrency})
              </p>

              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {Object.entries(rates.conversion_rates)
                  .filter(
                    ([currency]) => currency !== 'ETB' && currency !== baseCurrency
                  )
                  .map(([currency, value]) => (
                    <div
                      key={currency}
                      className="flex justify-between border-b border-slate-100 py-2 text-sm"
                    >
                      <span className="text-slate-700 font-medium">{currency}</span>
                      <span className="text-slate-800">{value.toFixed(4)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExchangeRateCard