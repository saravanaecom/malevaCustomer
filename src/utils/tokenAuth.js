// Token-based auto authentication
import { authService } from '../services/authService.js';

export const handleTokenAuth = async (token) => {
  try {
    // Store token temporarily
    localStorage.setItem('token', token);
    
    // Verify token by making an authenticated request
    const response = await fetch('/api/verify-token', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      return { success: true, user: userData };
    } else {
      localStorage.removeItem('token');
      throw new Error('Invalid token');
    }
  } catch (error) {
    localStorage.removeItem('token');
    throw error;
  }
};