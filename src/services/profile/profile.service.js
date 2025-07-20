import axiosClient from "../../utils/apiClient";

class ProfileService {
  async updateProfile(userId, profileData) {
    try {
      const response = await axiosClient.patch(`/user/${userId}`, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async getUserProfile(userId) {
    try {
      const response = await axiosClient.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
}

const profileService = new ProfileService();
export default profileService;
