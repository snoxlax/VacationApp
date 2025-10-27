/**
 * Client-side validation utilities
 * its simple validation, not a full validation library
 * we could use a library like zod for more complex validation
 * we could add more validation rules later
 * but for now this is enough
 */

export function validateVacationRequest(formData) {
  const { startDate, endDate, reason } = formData;
  const errors = [];

  // Check if dates are provided
  if (!startDate || !endDate) {
    errors.push('Start Date and End Date are required');
    return { isValid: false, errors };
  }

  // Check if start date is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);

  if (start < today) {
    errors.push('Start Date cannot be in the past');
  }

  // Check if end date is after start date
  const end = new Date(endDate);
  if (end < start) {
    errors.push('End Date must be after or equal to Start Date');
  }

  // Check reason length
  if (reason && reason.length > 500) {
    errors.push('Reason must be 500 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors.join(', ') : null,
  };
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  const errors = [];

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    /* this could be add for more security */
    // if (!/(?=.*[a-z])/.test(password)) {
    //   errors.push('Password must contain at least one lowercase letter');
    // }
    // if (!/(?=.*[A-Z])/.test(password)) {
    //   errors.push('Password must contain at least one uppercase letter');
    // }
    // if (!/(?=.*\d)/.test(password)) {
    //   errors.push('Password must contain at least one number');
    // }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors.join(', ') : null,
  };
}
