import { ServerURL } from '../config/serverConfig.js';

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
    const apiUrl = `${ServerURL.PRODUCTION_HOST_URL}api${endpoint}`;
    console.log('Making API request to:', apiUrl);
    console.log('Request config:', config);
    
    const response = await fetch(apiUrl, config);
    
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