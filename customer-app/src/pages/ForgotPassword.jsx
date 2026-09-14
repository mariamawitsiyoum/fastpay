import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../api/auth'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import PrimaryButton from '../components/PrimaryButton'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    setError('')
    setLoading(true)

    try {
      await requestPasswordReset(email)
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <AuthLayout title="Check your email">
        <p className="text-slate-700 text-sm mb-4 text-center">
          If an account exists with <span className="font-medium">{email}</span>, we've sent a
          password reset link to it.
        </p>
        <Link to="/" className="text-sky-600 hover:text-sky-500 text-sm font-medium block text-center">
          Back to login
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Reset your password">
      <p className="text-slate-500 text-sm mb-4 text-center">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send reset link'}
        </PrimaryButton>
      </form>

      <p className="text-slate-500 text-sm mt-4 text-center">
        Remembered your password?{' '}
        <Link to="/" className="text-sky-600 hover:text-sky-500 font-medium">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default ForgotPassword