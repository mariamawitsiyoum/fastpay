import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'
import { Link } from 'react-router-dom'
function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function validate() {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!phone.trim()) newErrors.phone = 'Phone number is required'
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!email.includes('@')) {
      newErrors.email = 'Enter a valid email'
    }
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setServerError('')
    setLoading(true)

    try {
      const newUser = await signup({ name, phone, email })
      console.log('Signup successful:', newUser)
      navigate('/')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white shadow-sm rounded-xl p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Create your account
        </h1>
        <p className="text-slate-500 text-sm mb-4">
          Sign up to start sending and receiving with fastPAY
        </p>

        {serverError && (
          <p className="text-red-600 text-sm mb-3">{serverError}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-slate-500 text-sm">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-slate-300 rounded px-3 py-2 w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-slate-500 text-sm">
              Phone number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-slate-300 rounded px-3 py-2 w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="text-slate-500 text-sm">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-slate-300 rounded px-3 py-2 w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-500 hover:bg-sky-600 text-white rounded px-3 py-2 mt-2 font-medium disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <p className="text-slate-500 text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/" className="text-sky-600 hover:text-sky-500 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup