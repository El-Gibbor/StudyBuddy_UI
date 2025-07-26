import { useMutation, useQueryClient } from '@tanstack/react-query';
import skillsService from '../services/skills/skills.service';
import studyBuddyService from '../services/studybuddy/studybuddy.js';
import sessionsService from '../services/sessions/sessions.service.js';

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

// Hook for adding availability
export const useAddAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (availabilityData) => studyBuddyService.addAvailability(availabilityData),
    onSuccess: (data) => {
      // Invalidate and refetch current user availability
      queryClient.invalidateQueries({ queryKey: ['currentUserAvailability'] });
      // Also invalidate study buddies queries as availability affects them
      queryClient.invalidateQueries({ queryKey: ['studyBuddies'] });
    },
    onError: (error) => {
      console.error('Failed to add availability:', error);
    }
  });
};

// Hook for updating availability
export const useUpdateAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, availabilityData }) => studyBuddyService.updateAvailability(id, availabilityData),
    onSuccess: (data) => {
      // Invalidate and refetch current user availability
      queryClient.invalidateQueries({ queryKey: ['currentUserAvailability'] });
      // Also invalidate study buddies queries as availability affects them
      queryClient.invalidateQueries({ queryKey: ['studyBuddies'] });
    },
    onError: (error) => {
      console.error('Failed to update availability:', error);
    }
  });
};

// Hook for removing availability
export const useRemoveAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => studyBuddyService.removeAvailability(id),
    onSuccess: (data) => {
      // Invalidate and refetch current user availability
      queryClient.invalidateQueries({ queryKey: ['currentUserAvailability'] });
      // Also invalidate study buddies queries as availability affects them
      queryClient.invalidateQueries({ queryKey: ['studyBuddies'] });
    },
    onError: (error) => {
      console.error('Failed to remove availability:', error);
    }
  });
};