const API_BASE_URL = 'http://103.215.139.8:8001/api';

export const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    mode: 'cors'
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  try {
    console.log('Making API request to:', `${API_BASE_URL}${endpoint}`);
    console.log('Request config:', config);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API Response:', result);
    return result;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};