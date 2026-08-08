import axiosInstance from './axiosInstance'

export async function getNotifications() {
    const response = await axiosInstance.get('/notifications')
    return response.data
}
export async function markNotificationRead(notificationId) {
    const response = await axiosInstance.put(`/notifications/${notificationId}/read`)
    return response.data
}
export async function markAllNotificationsRead() {
    const response = await axiosInstance.put('/notifications/read-all')
    return response.data
}