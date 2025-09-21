// Authentication Service with Axios
import { apiClient } from '../api/client.js';
import { AUTH_ENDPOINTS } from '../api/endpoints/auth.js';
import { handleApiError } from '../utils/errorHandler.js';
import { logger } from '../utils/logger.js';

class AuthService {
  async login(credentials) {
    try {
      const { username, password, oldUserId = '' } = credentials;
      
      // Send as query parameters to match your working URL
      const params = {
        Userid: username,
        Pwd: password,
        olduserid: oldUserId
      };
      
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, null, {
        params: params,
        headers: {
          'Token': localStorage.getItem('token') || ''
        }
      });
      
      const responseData = response.data;
      
      // Check if login was successful (status 200 and IsSuccess true)
      if (response.status === 200 && responseData.IsSuccess) {
        // Extract user data from Data1 array (first element)
        const loginData = responseData.Data1?.[0] || {};
        
        const userData = {
          customerId: loginData.UserId,  // UserId from your query
          companyId: loginData.Comid,   // Comid from your query
          userId: loginData.UserId,     // UserId from your query
          username: loginData.Priv || username,  // Priv (UserName) from your query
          companyName: loginData.CompanyName,    // CompanyName from your query
          mComid: loginData.MComid,     // MComid from your query
          menuData: responseData.Data2 || [],    // Menu data from Data2
          ...loginData
        };
        
        // Store token if provided
        if (responseData.Token) {
          localStorage.setItem('token', responseData.Token);
        }
        
        // Log successful login
        logger.logUserAction('LOGIN_SUCCESS', {
          username: username,
          customerId: userData.customerId,
          companyId: userData.companyId,
          userId: userData.userId
        });
        
        return {
          success: true,
          user: userData,
          token: responseData.Token,
          message: responseData.Message || 'Login successful'
        };
      } else {
        // Handle the specific error message from your .NET API
        const errorMessage = responseData.Message || 'Invalid UserName & Password';
        throw new Error(errorMessage);
      }
      
    } catch (error) {
      // Log the login attempt failure
      logger.logUserAction('LOGIN_FAILED', {
        username: credentials.username,
        error: error.message,
        status: error.response?.status
      });
      
      // Get user-friendly error message
      const errorMessage = handleApiError(error, 'AUTH_SERVICE', 'LOGIN');
      throw new Error(errorMessage);
    }
  }

  async logout() {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
        refreshToken
      });
      
      const { token, refreshToken: newRefreshToken } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Token refresh failed';
      throw new Error(message);
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
export default authService;