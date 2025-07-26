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

// Sessions Mutations

// Hook for creating a new session
export const useCreateSessionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionData) => sessionsService.createSession(sessionData),
    onSuccess: (data) => {
      // Invalidate and refetch sessions queries
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mySessions'] });
      queryClient.invalidateQueries({ queryKey: ['userUpcomingSessions'] });
    },
    onError: (error) => {
      console.error('Failed to create session:', error);
    }
  });
};

// Hook for updating a session
export const useUpdateSessionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updateData }) => sessionsService.updateSession(id, updateData),
    onSuccess: (data, variables) => {
      // Invalidate specific session
      queryClient.invalidateQueries({ queryKey: ['session', variables.id] });
      // Invalidate sessions lists
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mySessions'] });
      queryClient.invalidateQueries({ queryKey: ['userUpcomingSessions'] });
    },
    onError: (error) => {
      console.error('Failed to update session:', error);
    }
  });
};

// Hook for canceling a session
export const useCancelSessionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => sessionsService.cancelSession(id),
    onSuccess: (data, id) => {
      // Invalidate specific session
      queryClient.invalidateQueries({ queryKey: ['session', id] });
      // Invalidate sessions lists
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mySessions'] });
      queryClient.invalidateQueries({ queryKey: ['userUpcomingSessions'] });
    },
    onError: (error) => {
      console.error('Failed to cancel session:', error);
    }
  });
};

// Hook for confirming a session
export const useConfirmSessionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => sessionsService.confirmSession(id),
    onSuccess: (data, id) => {
      // Invalidate specific session
      queryClient.invalidateQueries({ queryKey: ['session', id] });
      // Invalidate sessions lists
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mySessions'] });
      queryClient.invalidateQueries({ queryKey: ['userUpcomingSessions'] });
    },
    onError: (error) => {
      console.error('Failed to confirm session:', error);
    }
  });
};

// Hook for rejecting a session
export const useRejectSessionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => sessionsService.rejectSession(id),
    onSuccess: (data, id) => {
      // Invalidate specific session
      queryClient.invalidateQueries({ queryKey: ['session', id] });
      // Invalidate sessions lists
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mySessions'] });
      queryClient.invalidateQueries({ queryKey: ['userUpcomingSessions'] });
    },
    onError: (error) => {
      console.error('Failed to reject session:', error);
    }
  });
};

// Hook for completing a session with feedback
export const useCompleteSessionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, feedbackData }) => sessionsService.completeSession(id, feedbackData),
    onSuccess: (data, variables) => {
      // Invalidate specific session
      queryClient.invalidateQueries({ queryKey: ['session', variables.id] });
      // Invalidate sessions lists
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mySessions'] });
      queryClient.invalidateQueries({ queryKey: ['userUpcomingSessions'] });
      // Also invalidate stats as completing sessions affects them
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      console.error('Failed to complete session:', error);
    }
  });
};

// Hook for starting a session
export const useStartSessionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => sessionsService.startSession(id),
    onSuccess: (data, id) => {
      // Invalidate specific session
      queryClient.invalidateQueries({ queryKey: ['session', id] });
      // Invalidate sessions lists
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mySessions'] });
      queryClient.invalidateQueries({ queryKey: ['userUpcomingSessions'] });
    },
    onError: (error) => {
      console.error('Failed to start session:', error);
    }
  });
};