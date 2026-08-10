import axiosInstance from './axiosInstance'

export async function getReceipt(id) {
  const response = await axiosInstance.get(`/receipts/${id}`)
  return response.data
}
export async function shareReceipt(id, method, destination) {
  const response = await axiosInstance.post(`/receipts/${id}/share`, { method, destination })
  return response.data
}