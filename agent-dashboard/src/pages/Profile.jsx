import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getMyProfile, updateMyProfile } from '../api/agents'
import { useAuth } from '../hooks/useAuth'
import FormInput from '../components/FormInput'
import PrimaryButton from '../components/PrimaryButton'
import Skeleton from '../components/Skeleton'

function Profile() {
  const { agent } = useAuth()
  const [operatingHours, setOperatingHours] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
    placeholderData: {
      address: 'Addis ababa, Ethiopia',
      status: 'approved',
      commission_rate: 0.01,
      operating_hours: 'Mon-Sat 8:00-18:00',
    },
  })

  useEffect(() => {
    if (data) {
      setOperatingHours(data.operating_hours)
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: () => updateMyProfile({ operating_hours: operatingHours }),
    onSuccess: () => {
      setSuccessMessage('Profile updated successfully.')
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    setSuccessMessage('')
    mutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-50 min-h-full max-w-md">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-7 w-32 mb-6" />
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    )
  }

  if (isError) return <div className="p-8 text-red-600">Failed to load profile.</div>

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <p className="text-sm text-sky-600 font-semibold uppercase tracking-wide">Account</p>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile</h1>

      <div className="max-w-md">
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500">Name</span>
            <span className="text-slate-700 font-medium">{agent?.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-slate-500">Address</span>
            <span className="text-slate-700">{data.address}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-slate-500">Status</span>
            <span className="font-semibold text-emerald-600 capitalize">{data.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Commission Rate</span>
            <span className="text-slate-700">{data.commission_rate}</span>
          </div>
        </div>

        {successMessage && <p className="text-emerald-600 mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Operating Hours"
            type="text"
            value={operatingHours}
            onChange={(e) => setOperatingHours(e.target.value)}
          />
          <PrimaryButton type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}

export default Profile