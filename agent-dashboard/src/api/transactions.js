import axiosInstance from './axiosInstance'

export async function createTransaction(transactionData) {
  const response = await axiosInstance.post('/transactions', transactionData)
  return response.data
}

export async function getTransactions(filters = {}) {
  const response = await axiosInstance.get('/transactions', {
    params: {
      type: filters.type || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    },
  })
  return response.data
}
