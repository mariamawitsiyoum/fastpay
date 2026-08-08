import axiosInstance from './axiosInstance'

export async function loginRequest(email, password) {
  const response = await axiosInstance.post('/auth/login', { email, password })
  return response.data
}
export async function getCurrentUser() {
  const response = await axiosInstance.get('/auth/me')
  return response.data
}
export async function registerRequest(name, email, phone, password) {
  const response = await axiosInstance.post('/auth/register', { name, email, phone, password })
  return response.data
}
