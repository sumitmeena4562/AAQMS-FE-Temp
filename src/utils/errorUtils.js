/**
 * ── ERROR UTILITIES ──
 * Standardized error extraction logic for the entire platform.
 */

export const extractError = (err, fallback = "Something went wrong. Please try again.") => {
    // 1. Network / No Response
    if (!err.response) {
      if (err.message === 'Network Error') return "Network error. Please check your internet connection.";
      return err.message || fallback;
    }
  
    const { status, data } = err.response;
  
    // 2. Structured Data response
    if (data) {
      if (data.detail) return data.detail;
      if (data.non_field_errors) return data.non_field_errors[0];
      if (data.error) return data.error;
      if (data.message) return data.message;
  
      // 3. Nested Field Errors
      if (typeof data === 'object') {
        const messages = Object.entries(data)
          .map(([key, val]) => {
            const msg = Array.isArray(val) ? val[0] : val;
            if (key === 'non_field_errors' || key === 'error' || key === 'detail') return msg;
            const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `${readableKey}: ${msg}`;
          });
        if (messages.length > 0) return messages[0];
      }
      
      if (typeof data === 'string') return data;
    }
  
    // 4. Default Status Codes
    if (status === 401) return "Session expired or invalid credentials.";
    if (status === 403) return "Access denied. You don't have permission for this action.";
    if (status === 404) return "Resource not found or service unavailable.";
    if (status >= 500) return "We're experiencing server issues. Please try again later.";
    
    return fallback;
};
