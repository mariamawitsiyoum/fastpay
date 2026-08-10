import axiosInstance from "./axiosInstance";
export async function lookupCustomer(phone){
    const response = await axiosInstance.get('/customers/lookup', { params: { phone } })
    return response.data
}
export async function searchCustomersByName(name) {
  const response = await axiosInstance.get('/customers/search', {
    params: { name },
  })
  return response.data
}
export async function getTransactions(filters) {
  const response = await axiosInstance.get('/transactions', { params: filters })
  return response.data
}