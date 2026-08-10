import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { registerRequest } from '../api/auth'
import { registerAgentRequest } from '../api/agents'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import PrimaryButton from '../components/PrimaryButton'

function SignUp() {
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [operatingHours, setOperatingHours] = useState('')
  const [nationalId, setNationalId] = useState('')

  const navigate = useNavigate()
  const { setAgent } = useAuth()

  const mutation = useMutation({
    mutationFn: async () => {
      // Call 1: create the base account
      const registerData = await registerRequest(name, email, phone, password)
      localStorage.setItem('token', registerData.token)
      setAgent(registerData.user)

      // Call 2: attach agent details (runs right after, using the token we just saved)
      await registerAgentRequest({
        address,
        operating_hours: operatingHours,
        phone,
        national_id_number: nationalId,
      })
    },
    onSuccess: () => {
      setSubmitted(true)
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.error || 'Something went wrong.')
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    mutation.mutate()
  }

  if (submitted) {
    return (
      <AuthLayout title="Application Submitted">
        <p className="text-center text-gray-600 mb-6">
          Your agent application is pending admin approval. We'll notify you once it's reviewed.
        </p>
        <PrimaryButton onClick={() => navigate('/login')}>
          Back to Login
        </PrimaryButton>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Agent Sign Up">
      {errorMessage && (
        <div className="text-red-600 text-sm mb-4 text-center">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput label="Full Name" required type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <FormInput label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormInput label="Phone" required type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <FormInput label="Password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <FormInput label="Address" required type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        <FormInput label="Operating Hours" required type="text" placeholder="e.g. Mon-Sat 8:00-18:00" value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} />
        <FormInput label="National ID Number" required type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />

        <div className="mt-2">
          <PrimaryButton type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Submitting...' : 'Submit Application'}
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  )
}

export default SignUp