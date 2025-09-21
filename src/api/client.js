// Axios API Client Configuration
import axios from 'axios';
import { ServerURL } from '../config/serverConfig.js';
import { logger } from '../utils/logger.js';

// Create Axios instance
const apiClient = axios.create({
  baseURL: ServerURL.PRODUCTION_HOST_URL,
  timeout: 15000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add request start time for logging
    config.metadata = { startTime: new Date() };
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add company ref ID
    config.headers['X-Company-ID'] = ServerURL.COMPANY_REF_ID;
    
    // Log API request
    logger.logApiCall(config.method || 'POST', config.url || '', 'REQUEST_STARTED');
    
    return config;
  },
  (error) => {
    logger.logError(error, 'API_CLIENT', 'REQUEST_INTERCEPTOR');
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Calculate response time
    const responseTime = new Date() - response.config.metadata.startTime;
    
    // Log successful response
    logger.logApiCall(
      response.config.method || 'POST',
      response.config.url || '',
      response.status,
      responseTime
    );
    
    return response;
  },
  (error) => {
    // Calculate response time if available
    const responseTime = error.config?.metadata?.startTime 
      ? new Date() - error.config.metadata.startTime 
      : 0;
    
    // Log API error with details
    logger.logApiCall(
      error.config?.method || 'UNKNOWN',
      error.config?.url || 'UNKNOWN',
      error.response?.status || 0,
      responseTime
    );
    
    // Log detailed error
    logger.logError(error, 'API_CLIENT', 'RESPONSE_ERROR');
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;