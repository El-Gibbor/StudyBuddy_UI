import { useQuery } from '@tanstack/react-query';
import profileService from '../services/profile/profile.service';   
import skillsService from '../services/skills/skills.service';
import studyBuddyService from '../services/studybuddy/studybuddy.js';
import sessionsService from '../services/sessions/sessions.service.js';

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

// Hook for fetching all study buddies with filtering
const useStudyBuddiesQuery = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['studyBuddies', params],
    queryFn: () => studyBuddyService.getAllStudyBuddies(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    ...options
  });
};

// Hook for fetching a specific study buddy by ID
const useStudyBuddyByIdQuery = (id, options = {}) => {
  return useQuery({
    queryKey: ['studyBuddy', id],
    queryFn: () => studyBuddyService.getStudyBuddyById(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
};

// Hook for fetching current user availability
const useCurrentUserAvailabilityQuery = (options = {}) => {
  return useQuery({
    queryKey: ['currentUserAvailability'],
    queryFn: studyBuddyService.getCurrentUserAvailability,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    ...options
  });
};

// Hook for fetching sessions with filtering
const useSessionsQuery = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['sessions', params],
    queryFn: () => sessionsService.getSessions(params),
    staleTime: 1 * 60 * 1000, // 1 minute (sessions change frequently)
    refetchOnWindowFocus: false,
    ...options
  });
};

// Hook for fetching current user sessions
const useMySessionsQuery = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['mySessions', params],
    queryFn: () => sessionsService.getMySessions(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    ...options
  });
};

// Hook for fetching a specific session by ID
const useSessionByIdQuery = (id, options = {}) => {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionsService.getSessionById(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 30 * 1000, // 30 seconds (session details may change quickly)
    refetchOnWindowFocus: false,
    ...options
  });
};

export {
    useStatsQuery,
    useUpcomingSessionsQuery,
    useUserSkillsQuery,
    useUserSkillsByIdQuery,
    useStudyBuddiesQuery,
    useStudyBuddyByIdQuery,
    useCurrentUserAvailabilityQuery,
    useSessionsQuery,
    useMySessionsQuery,
    useSessionByIdQuery
}