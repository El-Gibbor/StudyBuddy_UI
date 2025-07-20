import axiosClient from "../../utils/apiClient";

class AvailabilityService {
  async updateAvailability(userId, availabilityData) {
    try {
      console.log('AvailabilityService: Updating availability for user:', userId);
      console.log('AvailabilityService: Availability data:', availabilityData);

      const response = await axiosClient.patch(`/availability/${userId}`, availabilityData);
      console.log('AvailabilityService: Availability updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('AvailabilityService: Error updating availability:', error);
      throw new Error(error.response?.data?.message || 'Failed to update availability');
    }
  }

  async getAvailability(userId) {
    try {
      console.log('AvailabilityService: Getting availability for user:', userId);
      
      const response = await axiosClient.get(`/availability/${userId}`);
      console.log('AvailabilityService: Availability retrieved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('AvailabilityService: Error getting availability:', error);
      throw new Error(error.response?.data?.message || 'Failed to get availability');
    }
  }
}

const availabilityService = new AvailabilityService();
export default availabilityService;