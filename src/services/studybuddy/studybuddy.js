import axiosClient from "../../utils/apiClient";

class StudyBuddyService {
    // Get all study buddies with advanced filtering
    async getAllStudyBuddies(params = {}) {
        try {
            console.log('StudyBuddyService: Fetching all study buddies with params:', params);

            const response = await axiosClient.get('/study-buddy', { params });
            console.log('StudyBuddyService: Study buddies fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('StudyBuddyService: Error fetching study buddies:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch study buddies');
        }
    }

    // Search study buddies by skills, name, or bio
    async searchStudyBuddies(searchParams) {
        try {
            console.log('StudyBuddyService: Searching study buddies with params:', searchParams);

            const response = await axiosClient.get('/study-buddy/search', { params: searchParams });
            console.log('StudyBuddyService: Study buddies search completed:', response.data);
            return response.data;
        } catch (error) {
            console.error('StudyBuddyService: Error searching study buddies:', error);
            throw new Error(error.response?.data?.message || 'Failed to search study buddies');
        }
    }

    // Get study buddy by ID with availability and session history
    async getStudyBuddyById(id) {
        try {
            console.log('StudyBuddyService: Fetching study buddy by ID:', id);

            const response = await axiosClient.get(`/study-buddy/${id}`);
            console.log('StudyBuddyService: Study buddy fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('StudyBuddyService: Error fetching study buddy:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch study buddy');
        }
    }

    // Add availability for the current user
    async addAvailability(availabilityData) {
        try {
            console.log('StudyBuddyService: Adding availability:', availabilityData);

            const response = await axiosClient.post('/study-buddy/availability', availabilityData);
            console.log('StudyBuddyService: Availability added successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('StudyBuddyService: Error adding availability:', error);
            throw new Error(error.response?.data?.message || 'Failed to add availability');
        }
    }

    // Get current user availability
    async getCurrentUserAvailability() {
        try {
            console.log('StudyBuddyService: Fetching current user availability');

            const response = await axiosClient.get('/study-buddy/me/availability');
            console.log('StudyBuddyService: Current user availability fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('StudyBuddyService: Error fetching current user availability:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch current user availability');
        }
    }

    // Update availability
    async updateAvailability(id, availabilityData) {
        try {
            console.log('StudyBuddyService: Updating availability:', id, availabilityData);

            const response = await axiosClient.patch(`/study-buddy/availability/${id}`, availabilityData);
            console.log('StudyBuddyService: Availability updated successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('StudyBuddyService: Error updating availability:', error);
            throw new Error(error.response?.data?.message || 'Failed to update availability');
        }
    }

    // Remove availability
    async removeAvailability(id) {
        try {
            console.log('StudyBuddyService: Removing availability:', id);

            const response = await axiosClient.delete(`/study-buddy/availability/${id}`);
            console.log('StudyBuddyService: Availability removed successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('StudyBuddyService: Error removing availability:', error);
            throw new Error(error.response?.data?.message || 'Failed to remove availability');
        }
    }
}

export default new StudyBuddyService();
