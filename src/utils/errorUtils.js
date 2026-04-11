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
  
      // 3. Nested Field Errors (Validation Errors)
      if (typeof data === 'object' && data !== null) {
        const errorData = data.errors || data; // Handle 'errors' wrapper or flat object
        if (typeof errorData === 'object' && errorData !== null && !Array.isArray(errorData)) {
          const messages = Object.entries(errorData)
            .map(([key, val]) => {
              const msg = Array.isArray(val) ? val[0] : val;
              if (key === 'non_field_errors' || key === 'error' || key === 'detail' || key === 'message' || key === 'status') return null;
              
              // Filter out python raw ErrorDetail strings if they slip in
              const cleanMsg = typeof msg === 'string' ? msg.replace(/ErrorDetail\(string='(.*?)', code='.*?'\)/g, '$1') : msg;

              const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              return `${readableKey}: ${cleanMsg}`;
            })
            .filter(Boolean); // Remove nulls
            
          if (messages.length > 0) return messages.join(' | ');
        }
      }
      
      // Fallback to data.message, but ignore raw python dict representations
      if (data.message && typeof data.message === 'string' && !data.message.includes('ErrorDetail(')) {
          return data.message;
      }
      
      if (typeof data === 'string') {
          return data.includes('ErrorDetail(') ? fallback : data;
      }
    }
  
    // 4. Default Status Codes
    if (status === 401) return "Session expired or invalid credentials.";
    if (status === 403) return "Access denied. You don't have permission for this action.";
    if (status === 404) return "Resource not found or service unavailable.";
    if (status >= 500) return "We're experiencing server issues. Please try again later.";
    
    return fallback;
};
