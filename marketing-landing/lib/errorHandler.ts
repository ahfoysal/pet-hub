/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/errorHandler.ts
export interface CustomError extends Error {
  status?: number;
  data?: any;
}

export const createErrorHandler = (setError: (error: string) => void) => {
  return (error: unknown): string => {
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error instanceof Error) {
      // Handle native JavaScript errors
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      // Handle object errors (like API responses)
      const objError = error as Record<string, unknown>;
      
      if (objError.message && typeof objError.message === 'string') {
        errorMessage = objError.message;
      } else if (objError.error && typeof objError.error === 'string') {
        errorMessage = objError.error;
      } else if (objError.data && typeof objError.data === 'object') {
        const dataObj = objError.data as Record<string, unknown>;
        if (dataObj.message && typeof dataObj.message === 'string') {
          errorMessage = dataObj.message as string;
        }
      }
    } else if (typeof error === 'string') {
      // Handle string errors
      errorMessage = error;
    }

    // Set the error in the component state
    setError(errorMessage);
    console.error("Error occurred:", error);
    
    return errorMessage;
  };
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    
    if (errorObj.data && typeof errorObj.data === 'object') {
      const data = errorObj.data as Record<string, unknown>;
      if (data.message && typeof data.message === 'string') {
        return data.message;
      }
    }
    
    if (errorObj.message && typeof errorObj.message === 'string') {
      return errorObj.message;
    }
  }

  return "An unexpected error occurred. Please try again.";
};