import apiClient from "../../utils/apiClient";

export const notificationsService = {
  // Get user notifications with pagination and filters
  async getNotifications(params = {}) {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  // Get count of unread notifications
  async getUnreadCount() {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  // Mark a notification as read
  async markAsRead(id) {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  async markAllAsRead() {
    const response = await apiClient.patch('/notifications/mark-all-read');
    return response.data;
  }
};

export default notificationsService;
