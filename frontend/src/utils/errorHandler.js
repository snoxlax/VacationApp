/**
 * Utility function to extract meaningful error messages from API responses
 * Handles both axios errors and regular errors
 */
export function getErrorMessage(error) {
  if (error.response) {
    const { data } = error.response;

    if (data && data.error) {
      return data.error;
    }

    return 'An error occurred. Please try again.';
  }

  if (error.request) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

