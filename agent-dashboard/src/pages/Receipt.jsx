import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getReceipt, shareReceipt } from '../api/receipts'
import FormInput from '../components/FormInput'
import PrimaryButton from '../components/PrimaryButton'
import Skeleton from '../components/Skeleton'

function Receipt() {
  const { id } = useParams()
  const [destination, setDestination] = useState('')
  const [shareMessage, setShareMessage] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['receipt', id],
    queryFn: () => getReceipt(id),
    placeholderData: {
      id,
      transaction_id: 101,
      pdf_url: 'https://example.com/receipts/55.pdf',
      qr_code_data: 'https://ethiosend.com/verify/55',
    },
  })

  const shareMutation = useMutation({
    mutationFn: () => shareReceipt(id, 'email', destination),
    onSuccess: () => {
      setShareMessage('Receipt sent successfully.')
    },
  })

  function handleShare(e) {
    e.preventDefault()
    setShareMessage('')
    shareMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-50 min-h-full max-w-sm">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-7 w-28 mb-6" />
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col items-center">
          <Skeleton className="h-[180px] w-[180px] mb-4" />
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Skeleton className="h-5 w-28 mb-3" />
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    )
  }

  if (isError) return <div className="p-8 text-red-600">Failed to load receipt.</div>

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <p className="text-sm text-sky-600 font-semibold uppercase tracking-wide">Receipt</p>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Receipt #{data.id}</h1>

      <div className="max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col items-center"
        >
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data.qr_code_data)}`}
            alt="Receipt QR code"
            className="mb-4"
          />
          <p className="text-sm text-slate-500 mb-4">Transaction #{data.transaction_id}</p>
          <a
            href={data.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:underline text-sm font-medium"
          >
            View PDF Receipt
          </a>
        </motion.div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-3">Share Receipt</h2>

          {shareMessage && <p className="text-emerald-600 text-sm mb-3">{shareMessage}</p>}

          <form onSubmit={handleShare}>
            <FormInput
              label="Email"
              type="email"
              placeholder="customer@example.com"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <PrimaryButton type="submit" disabled={shareMutation.isPending}>
              {shareMutation.isPending ? 'Sending...' : 'Send Receipt'}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Receipt