// Authentication API endpoints - matching .NET backend
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/CustomersLoginApp/LoginAppSuccess',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  VERIFY_TOKEN: '/api/auth/verify',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
};

export default AUTH_ENDPOINTS;