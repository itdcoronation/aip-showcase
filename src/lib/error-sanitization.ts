/**
 * Error sanitization service for handling API error messages
 */
interface SanitizedError {
  message: string;
  code?: string;
  originalError?: any;
}

/**
 * Sanitizes error messages from API responses
 * @param error - The error object from API
 * @returns Sanitized error with user-friendly message
 */
export const sanitizeError = (error: any): SanitizedError => {
  let message = "An unexpected error occurred. Please try again.";
  let code: string | undefined;

  try {
    // Check for API response error structure
    if (error?.response?.data) {
      const errorData = error.response.data;

      // Priority order for error messages - check API response structure first
      if (errorData.Data?.api_response?.statusMessage) {
        message = errorData.Data.api_response.statusMessage;
      } else if (errorData.api_response?.statusMessage) {
        message = errorData.api_response.statusMessage;
      } else if (errorData.statusMessage) {
        message = errorData.statusMessage;
      } else if (errorData.error?.Data?.api_response?.statusMessage) {
        message = errorData.error.Data.api_response.statusMessage;
      } else if (errorData.error?.api_response?.statusMessage) {
        message = errorData.error.api_response.statusMessage;
      } else if (errorData.error?.statusMessage) {
        message = errorData.error.statusMessage;
      } else if (errorData.error?.Message) {
        message = errorData.error.Message;
      } else if (errorData.Message) {
        message = errorData.Message;
      } else if (errorData.message) {
        message = errorData.message;
      } else if (errorData.error) {
        if (typeof errorData.error === "string") {
          message = errorData.error;
        } else if (errorData.error.message) {
          message = errorData.error.message;
        }
      } else if (errorData.Data && typeof errorData.Data === "string") {
        message = errorData.Data;
      }

      // Extract error code
      code =
        errorData.Code ||
        errorData.code ||
        errorData.error?.Code ||
        error.response?.status?.toString();
    } else if (error?.message) {
      // Direct error message
      message = error.message;
    }

    // Handle specific error patterns
    if (message.includes("Network Error") || message.includes("ERR_NETWORK")) {
      message =
        "Network connection error. Please check your internet connection and try again.";
    } else if (message.includes("timeout")) {
      message = "Request timed out. Please try again.";
    } else if (message.includes("401") || message.includes("Unauthorized")) {
      message = "Session expired. Please log in again.";
    }
  } catch (sanitizationError) {
    console.error("Error during error sanitization:", sanitizationError);
  }

  return {
    message,
    code,
    originalError: error,
  };
};

/**
 * Generate unique error ID for tracking
 * @returns Unique error ID
 */
export const generateErrorId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ERR-${timestamp}-${randomId}`;
};

export const apiErrorHandler = (error: any, default_message?: string) => {
  let message: string = default_message || "An unexpected error occured";
  console.log("Error in apiErrorHandler:", error);

  if (error?.response?.data) {
    const errorData = error.response.data;

    if (errorData.errors) {
      // Handle validation errors
      const validationErrors = errorData.errors;
      const firstKey = Object.keys(validationErrors)[0];
      if (firstKey && validationErrors[firstKey]?.length > 0) {
        message = validationErrors[firstKey][0];
      }
    } else if (errorData.message) {
      message = errorData.message;
    } else if (errorData.error?.message) {
      message = errorData.error.message;
    }
  } else if (error?.message) {
    message = error.message;
  }

  return message;
};
