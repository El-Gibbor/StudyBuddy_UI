// Error handling utilities
export const parseApiError = (error) => {
  return error?.response?.data?.error?.message || 
         error?.response?.data?.message ||
         error?.message || 
         'An unexpected error occurred';
};

export const getErrorType = (error) => {
  const message = parseApiError(error);
  
  if (message.includes('required') || message.includes('missing')) {
    return 'validation';
  }
  if (message.includes('permission') || message.includes('not authorized')) {
    return 'permission';
  }
  if (message.includes('not found')) {
    return 'notFound';
  }
  if (message.includes('already exists') || message.includes('duplicate')) {
    return 'duplicate';
  }
  if (message.includes('rate limit') || message.includes('too many')) {
    return 'rateLimit';
  }
  
  return 'generic';
};

// Common error messages
export const ERROR_MESSAGES = {
  validation: 'Please check your input and ensure all required fields are filled.',
  permission: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  duplicate: 'This item already exists.',
  rateLimit: 'You are performing actions too quickly. Please wait and try again.',
  network: 'Network error. Please check your connection and try again.',
  generic: 'Something went wrong. Please try again.'
};

export const getErrorMessage = (error) => {
  const errorType = getErrorType(error);
  const apiMessage = parseApiError(error);
  
  // Return API message if it's user-friendly, otherwise use our predefined messages
  if (apiMessage.length < 100 && !apiMessage.includes('Error:')) {
    return apiMessage;
  }
  
  return ERROR_MESSAGES[errorType];
};
