// Custom hook for orders with user context
import { useApi } from './useApi.js';
import { useUser } from './useUser.js';
import { ordersService } from '../services/ordersService.js';

export const useOrders = () => {
  const { customerId, companyId, userId } = useUser();
  
  // Get customer orders using user data
  const { data: ordersData, loading, error, refetch } = useApi(
    () => {
      console.log('👤 User Data for Orders:', { customerId, companyId, userId });
      
      if (!customerId || !companyId || !userId) {
        throw new Error('User data not available');
      }
      
      return ordersService.getCustomerOrders(customerId);
    },
    [customerId, companyId, userId], // Refetch when user data changes
    { immediate: customerId && companyId && userId } // Only fetch if user data is available
  );

  return {
    orders: ordersData?.orders || [],
    loading,
    error,
    refetch,
    success: ordersData?.success || false,
    message: ordersData?.message || ''
  };
};

export default useOrders;