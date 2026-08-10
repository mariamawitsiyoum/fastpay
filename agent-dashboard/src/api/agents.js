import axiosInstance from './axiosInstance'

export async function registerAgentRequest(agentData) {
  const response = await axiosInstance.post('/agents/register', agentData)
  return response.data
}
export async function getDailyReport(date) {
  const response = await axiosInstance.get('/agents/me/daily-report', {
    params: { date },
  })
  return response.data
}
export async function getCommissions(filters) {
  const response = await axiosInstance.get('/agents/me/commissions', { params: filters })
  return response.data
}
export async function getMyProfile() {
  const response = await axiosInstance.get('/agents/me')
  return response.data
}

export async function updateMyProfile(updates) {
  const response = await axiosInstance.put('/agents/me', updates)
  return response.data
}
/*params: { date } tells axios to automatically build the query string for us — so this sends a request to /agents/me/daily-report?date=2026-07-27 without us manually gluing strings together. */