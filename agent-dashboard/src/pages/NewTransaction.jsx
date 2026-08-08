import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { lookupCustomer } from '../api/customers'
import { createTransaction } from '../api/transactions'
import FormInput from '../components/FormInput'
import PrimaryButton from '../components/PrimaryButton'
import Skeleton from '../components/Skeleton'

function NewTransaction() {
  const [phone, setPhone] = useState('')
  const [searchedPhone, setSearchedPhone] = useState(null)

  const [type, setType] = useState('cash_in')
  const [amount, setAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [receiverPhone, setReceiverPhone] = useState('')

  const customerQuery = useQuery({
    queryKey: ['customer-lookup', searchedPhone],
    queryFn: () => lookupCustomer(searchedPhone),
    enabled: !!searchedPhone,
  })

  const transactionMutation = useMutation({
    mutationFn: () =>
      createTransaction({
        customer_id: customerQuery.data.id,
        type,
        amount: parseFloat(amount),
        bank_name: bankName,
        receiver_name: receiverName,
        receiver_phone: receiverPhone,
      }),
  })

  function handleFindCustomer(e) {
    e.preventDefault()
    setSearchedPhone(phone)
  }

  function handleSubmitTransaction(e) {
    e.preventDefault()
    transactionMutation.mutate()
  }

  if (transactionMutation.isSuccess) {
    const result = transactionMutation.data
    return (
      <div className="p-8 bg-slate-50 min-h-full max-w-md">
        <p className="text-sm text-sky-600 font-semibold uppercase tracking-wide">Success</p>
        <h1 className="text-2xl font-bold mb-4 text-emerald-700">Transaction Complete</h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-xl shadow-sm p-5"
        >
          <div className="flex justify-between mb-1">
            <span className="text-slate-500">Transaction ID</span>
            <span className="text-slate-700">{result.id}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-slate-500">Amount</span>
            <span className="text-slate-700">{result.amount}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-slate-500">Commission</span>
            <span className="text-slate-700">{result.commission}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <span className="text-emerald-600 font-semibold">{result.status}</span>
          </div>
        </motion.div>
        <Link
          to={`/receipts/${result.receipt_id}`}
          className="inline-block mt-4 text-sky-600 hover:underline font-medium"
        >
          View Receipt →
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 bg-slate-50 min-h-full max-w-md">
      <p className="text-sm text-sky-600 font-semibold uppercase tracking-wide">Agent Tools</p>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">New Transaction</h1>

      {!customerQuery.data && (
        <form onSubmit={handleFindCustomer} className="mb-6">
          <FormInput
            label="Customer Phone"
            type="text"
            placeholder="e.g. 0911000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <PrimaryButton type="submit" disabled={!phone || customerQuery.isFetching}>
            {customerQuery.isFetching ? 'Searching...' : 'Find Customer'}
          </PrimaryButton>
        </form>
      )}

      {customerQuery.isFetching && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full" />
        </div>
      )}

      {customerQuery.isError && !customerQuery.isFetching && (
        <p className="text-red-600 mb-4">
          {customerQuery.error.response?.status === 404 ? 'Customer not found.' : 'Something went wrong.'}
        </p>
      )}

      {customerQuery.data && !customerQuery.isFetching && (
        <>
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <p className="font-bold text-slate-800">{customerQuery.data.name}</p>
            <p className="text-slate-500 text-sm mb-2">{customerQuery.data.phone}</p>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">KYC Status</span>
              <span className={customerQuery.data.kyc_status === 'verified' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                {customerQuery.data.kyc_status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Remaining Today</span>
              <span className="text-slate-700">{customerQuery.data.daily_limit - customerQuery.data.used_today}</span>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setType('cash_in')}
              className={`flex-1 py-2 rounded-full transition-colors ${type === 'cash_in' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'}`}
            >
              Cash In
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setType('cash_out')}
              className={`flex-1 py-2 rounded-full transition-colors ${type === 'cash_out' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'}`}
            >
              Cash Out
            </motion.button>
          </div>

          <form onSubmit={handleSubmitTransaction}>
            <FormInput label="Amount" required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <FormInput label="Bank Name" required type="text" placeholder="e.g. Commercial Bank of Ethiopia" value={bankName} onChange={(e) => setBankName(e.target.value)} />
            <FormInput label="Receiver Name" required type="text" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
            <FormInput label="Receiver Phone" required type="text" value={receiverPhone} onChange={(e) => setReceiverPhone(e.target.value)} />

            {transactionMutation.isError && (
              <p className="text-red-600 mb-4">
                {transactionMutation.error.response?.data?.error || 'Transaction failed.'}
              </p>
            )}

            <div className="mt-2">
              <PrimaryButton type="submit" disabled={transactionMutation.isPending}>
                {transactionMutation.isPending ? 'Processing...' : `Confirm ${type === 'cash_in' ? 'Cash In' : 'Cash Out'}`}
              </PrimaryButton>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default NewTransaction