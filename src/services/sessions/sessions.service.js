import axiosClient from "../../utils/apiClient";

class SessionsService {
    // Create a new session (book a session with a study buddy)
    async createSession(sessionData) {
            const response = await axiosClient.post('/sessions', sessionData);
            return response.data;
       
    }

    // Get sessions with advanced filtering
    async getSessions(params = {}) {
        try {
            console.log('SessionsService: Fetching sessions with params:', params);

            const response = await axiosClient.get('/sessions', { params });
            console.log('SessionsService: Sessions fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SessionsService: Error fetching sessions:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch sessions');
        }
    }

    // Get current user sessions
    async getMySessions(params = {}) {
        try {
            console.log('SessionsService: Fetching my sessions with params:', params);

            const response = await axiosClient.get('/sessions/my-sessions', { params });
            console.log('SessionsService: My sessions fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SessionsService: Error fetching my sessions:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch my sessions');
        }
    }

    // Get session by ID
    async getSessionById(id) {
        try {
            console.log('SessionsService: Fetching session by ID:', id);

            const response = await axiosClient.get(`/sessions/${id}`);
            console.log('SessionsService: Session fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SessionsService: Error fetching session:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch session');
        }
    }

    // Update session (confirm, cancel, add feedback, etc.)
    async updateSession(id, updateData) {
        try {
            console.log('SessionsService: Updating session:', { id, updateData });

            const response = await axiosClient.patch(`/sessions/${id}`, updateData);
            console.log('SessionsService: Session updated successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SessionsService: Error updating session:', error);
            throw new Error(error.response?.data?.message || 'Failed to update session');
        }
    }

    // Cancel session
    async cancelSession(id) {
        try {
            console.log('SessionsService: Canceling session:', id);

            const response = await axiosClient.delete(`/sessions/${id}`);
            console.log('SessionsService: Session canceled successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SessionsService: Error canceling session:', error);
            throw new Error(error.response?.data?.message || 'Failed to cancel session');
        }
    }

    // Confirm session (helper accepts the session)
    async confirmSession(id) {
        try {
            console.log('SessionsService: Confirming session:', id);

            const response = await axiosClient.patch(`/sessions/${id}`, { status: 'confirmed' });
            console.log('SessionsService: Session confirmed successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SessionsService: Error confirming session:', error);
            throw new Error(error.response?.data?.message || 'Failed to confirm session');
        }
    }

    // Reject session (helper rejects the session)
    async rejectSession(id) {
        try {
            console.log('SessionsService: Rejecting session:', id);

            const response = await axiosClient.patch(`/sessions/${id}`, { status: 'cancelled' });
            console.log('SessionsService: Session rejected successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SessionsService: Error rejecting session:', error);
            throw new Error(error.response?.data?.message || 'Failed to reject session');
        }
    }

    // Complete session with feedback
    async completeSession(id, feedbackData) {
        try {
            console.log('SessionsService: Completing session:', { id, feedbackData });

            const response = await axiosClient.patch(`/sessions/${id}`, {
                status: 'completed',
                ...feedbackData
            });
            console.log('SessionsService: Session completed successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SessionsService: Error completing session:', error);
            throw new Error(error.response?.data?.message || 'Failed to complete session');
        }
    }

    // Mark session as in progress
    async startSession(id) {
        try {
            console.log('SessionsService: Starting session:', id);

            const response = await axiosClient.patch(`/sessions/${id}`, { status: 'in_progress' });
            console.log('SessionsService: Session started successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SessionsService: Error starting session:', error);
            throw new Error(error.response?.data?.message || 'Failed to start session');
        }
    }
}

const sessionsService = new SessionsService();
export default sessionsService;
