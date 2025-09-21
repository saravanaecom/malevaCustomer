// API Helper functions for .NET backend integration
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};

export const handleApiResponse = (response) => {
  const data = response.data;
  
  // Handle .NET API response structure
  if (data.IsSuccess) {
    return {
      success: true,
      data: data.Data1,
      message: data.Message,
      statusCode: data.StatusCode
    };
  } else {
    throw new Error(data.Message || 'API request failed');
  }
};

export const handleApiError = (error) => {
  if (error.response) {
    const errorData = error.response.data;
    
    return {
      success: false,
      message: errorData?.Message || errorData?.message || 'Request failed',
      statusCode: error.response.status,
      data: errorData
    };
  } else if (error.request) {
    return {
      success: false,
      message: 'Network error - please check your connection',
      statusCode: 0
    };
  } else {
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      statusCode: 0
    };
  }
};

export default {
  createFormData,
  handleApiResponse,
  handleApiError
};