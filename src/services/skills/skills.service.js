import axiosClient from "../../utils/apiClient";

class SkillsService {
    // Get current user skills
    async getUserSkills() {
        const response = await axiosClient.get('/user/skills');
        return response.data;

    }

    // Add skills to current user profile
    async addSkills(skillsData) {
        const response = await axiosClient.post('/user/skills', skillsData);
        return response.data;
    }

    // Update all skills for current user
    async updateSkills(skillsData) {
        const response = await axiosClient.patch('/user/skills', skillsData);
        return response.data;
    }

    // Remove specific skills from current user profile
    async removeSkills(skillsData) {
        const response = await axiosClient.delete('/user/skills', { data: skillsData });
        return response.data;
    }

    // Get skills for a specific user (for viewing other users' profiles)
    async getUserSkillsById(userId) {
        const response = await axiosClient.get(`/user/${userId}/skills`);
        return response.data;
    }

}

const skillsService = new SkillsService();
export default skillsService;
