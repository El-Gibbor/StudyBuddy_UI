import apiClient from "../../utils/apiClient";

export const ticketsService = {
  // Create a new ticket
  async createTicket(ticketData) {
    const response = await apiClient.post('/tickets', ticketData);
    return response.data;
  },

  // Get all tickets with filtering
  async getTickets(params = {}) {
    const response = await apiClient.get('/tickets', { params });
    return response.data;
  },

  // Search tickets
  async searchTickets(params = {}) {
    const response = await apiClient.get('/tickets/search', { params });
    return response.data;
  },

  // Get tickets created by current user
  async getMyCreatedTickets(params = {}) {
    const response = await apiClient.get('/tickets/my/created', { params });
    return response.data;
  },

  // Get tickets claimed by current user
  async getMyClaimedTickets(params = {}) {
    const response = await apiClient.get('/tickets/my/claimed', { params });
    return response.data;
  },

  // Get ticket by ID
  async getTicketById(id) {
    const response = await apiClient.get(`/tickets/${id}`);
    return response.data;
  },

  // Update ticket
  async updateTicket(id, updateData) {
    const response = await apiClient.patch(`/tickets/${id}`, updateData);
    return response.data;
  },

  // Delete ticket
  async deleteTicket(id) {
    const response = await apiClient.delete(`/tickets/${id}`);
    return response.data;
  },

  // Claim a ticket
  async claimTicket(id) {
    const response = await apiClient.post(`/tickets/${id}/claim`);
    return response.data;
  },

  // Add comment to ticket
  async addComment(id, commentData) {
    const response = await apiClient.post(`/tickets/${id}/comments`, commentData);
    return response.data;
  },

  // Get comments for ticket
  async getTicketComments(id, params = {}) {
    const response = await apiClient.get(`/tickets/${id}/comments`, { params });
    return response.data;
  }
};

export default ticketsService;
