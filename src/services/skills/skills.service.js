import axiosClient from "../../utils/apiClient";

class SkillsService {
    async updateSkills(skillsData) {
        try {
            console.log('SkillsService: Updating skills:', skillsData);

            const response = await axiosClient.patch('/user/skills', skillsData);
            console.log('SkillsService: Skills updated successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SkillsService: Error updating skills:', error);
            throw new Error(error.response?.data?.message || 'Failed to update skills');
        }
    }

     async deleteSkill(skillData) {
        try {
            console.log('SkillsService: Deleting skill:', skillData);

            const response = await axiosClient.delete('/user/skills', { data: skillData });
            console.log('SkillsService: Skill deleted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('SkillsService: Error deleting skill:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete skill');
        }
    }


}

const skillsService = new SkillsService();
export default skillsService;
