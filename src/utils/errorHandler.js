// Error handler with user-friendly messages
import { logger } from './logger.js';

export const getErrorMessage = (error) => {
  // Log the error first
  logger.logError(error, 'API_ERROR', 'REQUEST_FAILED');

  // Handle different types of errors with user-friendly messages
  if (error.response) {
    const status = error.response.status;
    const errorData = error.response.data;
    
    switch (status) {
      case 400:
        return 'Invalid UserName & Password';
      
      case 401:
        return 'Invalid UserName & Password';
      
      case 403:
        return 'Access denied. Please contact administrator.';
      
      case 404:
        return 'Service temporarily unavailable. Please try again later.';
      
      case 500:
        return 'Please Enter the  correct User Name & Password'; 
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      
      default:
        // Check if there's a custom message from backend
        if (errorData?.Message) {
          return errorData.Message;
        }
        return 'Something went wrong. Please try again.';
    }
  } else if (error.request) {
    // Network error
    return 'Network connection failed. Please check your internet connection.';
  } else {
    // Other errors
    return error.message || 'An unexpected error occurred.';
  }
};

export const handleApiError = (error, context = '', action = '') => {
  // Log with context
  logger.logError(error, context, action);
  
  // Return user-friendly message
  return getErrorMessage(error);
};

export default {
  getErrorMessage,
  handleApiError
};