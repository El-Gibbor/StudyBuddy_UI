import { useMutation, useQueryClient } from '@tanstack/react-query';
import skillsService from '../services/skills/skills.service';

// Hook for adding skills
export const useAddSkillsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (skillsData) => skillsService.addSkills(skillsData),
    onSuccess: (data) => {
      // Invalidate and refetch user skills query
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
      // Also invalidate user profile if it includes skills
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      console.error('Failed to add skills:', error);
    }
  });
};

// Hook for updating all skills
export const useUpdateSkillsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (skillsData) => skillsService.updateSkills(skillsData),
    onSuccess: (data) => {
      // Invalidate and refetch user skills query
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
      // Also invalidate user profile if it includes skills
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      console.error('Failed to update skills:', error);
    }
  });
};

// Hook for removing specific skills
export const useRemoveSkillsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (skillsData) => skillsService.removeSkills(skillsData),
    onSuccess: (data) => {
      // Invalidate and refetch user skills query
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
      // Also invalidate user profile if it includes skills
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      console.error('Failed to remove skills:', error);
    }
  });
};