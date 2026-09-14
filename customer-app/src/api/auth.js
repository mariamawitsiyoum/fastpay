// This simulates a network request to the backend.
// Later, we'll replace the inside of this function with a real axios call —
// nothing that USES this function will need to change.

export function signup(userData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Mock API received:', userData)

      // simulate a backend rule: email must not already exist
      if (userData.email === 'taken@example.com') {
        reject(new Error('Email is already registered'))
        return
      }

      resolve({
        id: 'mock-user-123',
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        kyc_status: 'unverified',
      })
    }, 1000) // 1 second fake delay, like a real network request
  })
}
export function login(credentials) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Mock login attempt:', credentials)

      if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
        resolve({
          id: 'mock-user-123',
          name: 'Test User',
          email: credentials.email,
          kyc_status: 'unverified',
        })
      } else {
        reject(new Error('Invalid email or password'))
      }
    }, 1000)
  })
}

export function requestPasswordReset(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Mock password reset requested for:', email)

      if (!email.includes('@')) {
        reject(new Error('Please enter a valid email'))
        return
      }

      resolve({ message: 'If an account exists with this email, a reset link has been sent.' })
    }, 1000)
  })
}