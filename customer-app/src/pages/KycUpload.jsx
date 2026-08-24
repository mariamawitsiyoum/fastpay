import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function KycUpload() {
  const { user, updateKycStatus } = useAuth()
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleFileChange(e) {
    const selectedFile = e.target.files[0]
    setError('')   // for previous attempts

    if (!selectedFile) {
      setFile(null)
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a JPG, PNG, or PDF file')
      setFile(null)
      return
    }

    const maxSizeInBytes = 5 * 1024 * 1024
    if (selectedFile.size > maxSizeInBytes) {
      setError('File must be under 5MB')
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('Mock KYC upload:', file.name)
    updateKycStatus('pending')
    setLoading(false)
    setFile(null)
  }

  // Already pending or verified so don't show the upload form at all
  if (user?.kyc_status === 'pending') {
    return (
      <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Under Review</h1>
        <p className="text-amber-600">
          Your document has been submitted and is pending review.
        </p>
      </div>
    )
  }

  if (user?.kyc_status === 'verified') {
    return (
      <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Verified</h1>
        <p className="text-emerald-600">
          Your account is already verified. No further action needed.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Upload KYC Document</h1>
      <p className="text-slate-500 text-sm mb-4">
        Upload a valid ID or passport to verify your account
      </p>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-slate-500 text-sm">
            ID Document <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-700 mt-1
              file:mr-3 file:py-2 file:px-3
              file:rounded file:border-0
              file:bg-sky-500 file:text-white
              file:hover:bg-sky-600 file:cursor-pointer"
          />
        </div>

        {file && (
          <p className="text-slate-700 text-sm">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-sky-500 hover:bg-sky-600 text-white rounded px-3 py-2 mt-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Submit for review'}
        </button>
      </form>
    </div>
  )
}

export default KycUpload