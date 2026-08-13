import { useState, useEffect } from 'react'
import { getExchangeRates } from '../api/exchangeRate'

const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']

function ExchangeRate() {
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchRates() {
      setLoading(true)
      setError('')

      try {
        const data = await getExchangeRates(baseCurrency)

        if (data.result !== 'success') {
          setError('Could not load exchange rates. Please try again.')
          setRates(null)
          return
        }

        setRates(data)
      } catch (err) {
        setError('Could not load exchange rates. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [baseCurrency])

  return (
    <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Exchange Rates</h1>
      <p className="text-slate-500 text-sm mb-4">
        Live rates, refreshed each time you change currency
      </p>

      <div className="mb-4">
        <label className="text-slate-500 text-sm">Base currency</label>
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full mt-1 text-slate-700"
        >
          {currencyOptions.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-slate-500 text-sm">Loading rates...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && rates && (
        <div>
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 mb-4">
            <p className="text-slate-500 text-sm mb-1">
              1 {baseCurrency} equals
            </p>
            <p className="text-sky-600 text-3xl font-bold">
              {rates.conversion_rates.ETB.toFixed(2)} ETB
            </p>
          </div>

          <p className="text-slate-500 text-sm mb-2">Other currencies</p>

          <div className="flex flex-col gap-2">
            {Object.entries(rates.conversion_rates)
              .filter(([currency]) => currency !== 'ETB' && currency !== baseCurrency)
              .slice(0, 8)
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
    </div>
  )
}

export default ExchangeRate