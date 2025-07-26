import { useQuery } from '@tanstack/react-query';
import profileService from '../services/profile/profile.service';   
import skillsService from '../services/skills/skills.service';

const useStatsQuery = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: profileService.getStats,
  });
}

const useUpcomingSessionsQuery = () => {
  return useQuery({
    queryKey: ['userUpcomingSessions'],
    queryFn: profileService.upComingSessions,
  });
}

// Hook for fetching current user skills
const useUserSkillsQuery = () => {
  return useQuery({
    queryKey: ['userSkills'],
    queryFn: skillsService.getUserSkills,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook for fetching specific user skills by ID
const useUserSkillsByIdQuery = (userId, options = {}) => {
  return useQuery({
    queryKey: ['userSkills', userId],
    queryFn: () => skillsService.getUserSkillsById(userId),
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
};

export {
    useStatsQuery,
    useUpcomingSessionsQuery,
    useUserSkillsQuery,
    useUserSkillsByIdQuery
}