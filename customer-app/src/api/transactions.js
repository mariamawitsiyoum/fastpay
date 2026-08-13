const mockTransactions = [
  {
    id: 'txn_1001',
    type: 'cash_in',
    amount: 500,
    currency: 'USD',
    date: '2026-08-10T14:32:00Z',
    agentName: 'Bole Agent Kiosk',
    status: 'completed',
    receiptUrl: 'https://example.com/receipts/txn_1001.pdf',
  },
  {
    id: 'txn_1002',
    type: 'cash_out',
    amount: 200,
    currency: 'USD',
    date: '2026-08-05T09:15:00Z',
    agentName: 'Piassa Cash Point',
    status: 'completed',
    receiptUrl: 'https://example.com/receipts/txn_1002.pdf',
  },
  {
    id: 'txn_1003',
    type: 'cash_in',
    amount: 1000,
    currency: 'USD',
    date: '2026-07-28T17:50:00Z',
    agentName: 'Megenagna Express',
    status: 'completed',
    receiptUrl: 'https://example.com/receipts/txn_1003.pdf',
  },
]

export function getTransactionHistory() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions)
    }, 800)
  })
}