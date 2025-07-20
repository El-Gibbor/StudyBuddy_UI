import axiosClient from "../../utils/apiClient";

class ProfileService {
  async updateProfile(userId, profileData) {
    try {
      const response = await axiosClient.patch(`/user/${userId}`, {
        name: profileData.name,
        major: profileData.major,
        studyYear: profileData.studyYear,
        bio: profileData.bio
      });
      console.log('ProfileService: Profile updated successfully:', response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }
}

const profileService = new ProfileService();
export default profileService;
