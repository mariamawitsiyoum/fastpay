import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { loginRequest } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import PrimaryButton from '../components/PrimaryButton'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const { setAgent } = useAuth()

  const mutation = useMutation({
    mutationFn: () => loginRequest(email, password),
    onSuccess: (data) => {
      if (data.user.role !== 'agent') {
        setErrorMessage('This login is for agents only.')
        return
      }
      localStorage.setItem('token', data.token)
      setAgent(data.user)
      navigate('/dashboard')
    },
    onError: () => {
      setErrorMessage('Invalid email or password.')
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    mutation.mutate()
  }

  return (
    <AuthLayout>
      {errorMessage && (
        <div className="text-red-600 text-sm mb-4 text-center">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          required
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-2">
          <FormInput
            label="Password"
            required
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-9 text-gray-500"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="text-right mb-6">
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Forgot password?
          </a>
        </div>

        <PrimaryButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Logging in...' : 'Login'}
        </PrimaryButton>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        If you already have an account please,{' '}
        <a href="#" className="text-blue-600 font-semibold hover:underline">
          click here
        </a>{' '}
        to retrieve the password.
      </p>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up!
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Login