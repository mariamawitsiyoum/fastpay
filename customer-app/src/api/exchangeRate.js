import axios from 'axios'

const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY
const BASE_URL = 'https://v6.exchangerate-api.com/v6'

export async function getExchangeRates(baseCurrency) {
  const response = await axios.get(`${BASE_URL}/${API_KEY}/latest/${baseCurrency}`)
  return response.data
}