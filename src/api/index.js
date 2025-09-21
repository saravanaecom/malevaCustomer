// API exports - Single point of import

// Step 1: Import everything you need for the default export
import { apiClient } from './client.js';
import { authService } from '../services/authService.js';


import { ordersService } from '../services/ordersService.js';

// Step 2: Re-export everything as named exports (for individual imports)
export { apiClient } from './client.js';
export { AUTH_ENDPOINTS } from './endpoints/auth.js';


export { ORDERS_ENDPOINTS } from './endpoints/orders.js';
export { authService } from '../services/authService.js';
export { ordersService } from '../services/ordersService.js';
export { useApi, useMutation } from '../hooks/useApi.js';
export { useAuth, AuthProvider } from '../hooks/useAuth.js';

// Step 3: Create default export object with imported variables
export default {
  apiClient,        // ✅ Correct: uses imported variable
  authService,      // ✅ Correct: uses imported variable  
  ordersService,    // ✅ Correct: uses imported variable
};