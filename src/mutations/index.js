import { useMutation, useQueryClient } from '@tanstack/react-query';
import skillsService from '../services/skills/skills.service';
import studyBuddyService from '../services/studybuddy/studybuddy.js';
import sessionsService from '../services/sessions/sessions.service.js';
import ticketsService from '../services/tickets/tickets.service';
import notificationsService from '../services/notifications/notifications.service';

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

// Ticket Mutations

// Hook for creating a ticket
export const useCreateTicketMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ticketData) => ticketsService.createTicket(ticketData),
    onSuccess: (data) => {
      // Invalidate tickets queries
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['myCreatedTickets'] });
    },
    onError: (error) => {
      console.error('Failed to create ticket:', error);
    }
  });
};

// Hook for updating a ticket
export const useUpdateTicketMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updateData }) => ticketsService.updateTicket(id, updateData),
    onSuccess: (data, variables) => {
      // Invalidate specific ticket
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
      // Invalidate tickets lists
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['myCreatedTickets'] });
      queryClient.invalidateQueries({ queryKey: ['myClaimedTickets'] });
    },
    onError: (error) => {
      console.error('Failed to update ticket:', error);
    }
  });
};

// Hook for deleting a ticket
export const useDeleteTicketMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => ticketsService.deleteTicket(id),
    onSuccess: (data, id) => {
      // Invalidate tickets lists
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['myCreatedTickets'] });
      queryClient.invalidateQueries({ queryKey: ['myClaimedTickets'] });
      // Remove the specific ticket from cache
      queryClient.removeQueries({ queryKey: ['ticket', id] });
    },
    onError: (error) => {
      console.error('Failed to delete ticket:', error);
    }
  });
};

// Hook for claiming a ticket
export const useClaimTicketMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => ticketsService.claimTicket(id),
    onSuccess: (data, id) => {
      // Invalidate specific ticket
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      // Invalidate tickets lists
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['myClaimedTickets'] });
    },
    onError: (error) => {
      console.error('Failed to claim ticket:', error);
    }
  });
};

// Hook for adding a comment to a ticket
export const useAddTicketCommentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, commentData }) => ticketsService.addComment(id, commentData),
    onSuccess: (data, variables) => {
      // Invalidate ticket comments
      queryClient.invalidateQueries({ queryKey: ['ticketComments', variables.id] });
      // Invalidate specific ticket (comment count might change)
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
    },
    onError: (error) => {
      console.error('Failed to add comment:', error);
    }
  });
};

// Hook for marking a notification as read
export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => notificationsService.markAsRead(id),
    onSuccess: (data, variables) => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
    }
  });
};

// Hook for marking all notifications as read
export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
    },
    onError: (error) => {
      console.error('Failed to mark all notifications as read:', error);
    }
  });
};