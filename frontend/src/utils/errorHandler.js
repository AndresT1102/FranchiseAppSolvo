import { showError, showWarning } from './sweetAlert';

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);

  if (!error.response) {
    showError(
      error.message === 'Network Error' 
        ? 'Cannot connect to the server. Please check your connection.' 
        : defaultMessage
    );
    return;
  }

  const { status, data } = error.response;

  let serverMessage = null;

  if (typeof data === 'string') {
    serverMessage = data;
  } 
  else if (typeof data === 'object' && data !== null) {
    // Intentar múltiples propiedades comunes
    serverMessage = 
      data.message ||      
      data.Message ||      
      data.error ||        
      data.title ||        
      data.detail ||       
      data.errors;         
  }

  const finalMessage = serverMessage || defaultMessage;

  switch (status) {
    case 400: // Bad Request - Validación
      showWarning(finalMessage);
      break;

    case 404: // Not Found
      showError(finalMessage);
      break;

    case 409: // Conflict - DUPLICADOS
      console.log('Showing WARNING with message:', finalMessage);
      showWarning(finalMessage);
      break;

    case 500: // Internal Server Error
      showError(finalMessage);
      if (import.meta.env.DEV && data?.details) {
        console.error('Server error details:', data.details);
      }
      break;

    default:
      showError(finalMessage);
  }
};

export const withErrorHandling = async (operation, errorMessage) => {
  try {
    return await operation();
  } catch (error) {
    handleApiError(error, errorMessage);
    throw error;
  }
};