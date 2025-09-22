// Orders Service with Axios
import { apiClient } from '../api/client.js';
import { ORDERS_ENDPOINTS } from '../api/endpoints/orders.js';
import { ServerURL } from '../config/serverConfig.js';

class OrdersService {
  async getCustomerOrders(customerId) {
    try {
      // Your API expects Id and Comid in POST body
      const requestBody = {
        Id: customerId,
        Comid: ServerURL.COMPANY_REF_ID
      };
      
      console.log('🚀 Orders API Request:', {
        url: ORDERS_ENDPOINTS.SELECT_SALE_ORDER,
        body: requestBody
      });
      
      const response = await apiClient.post(ORDERS_ENDPOINTS.SELECT_SALE_ORDER, requestBody);
      
      console.log('📦 Orders API Response:', {
        status: response.status,
        data: response.data
      });
      
      const responseData = response.data;
      
      // Check if request was successful
      if (response.status === 200 && responseData.IsSuccess) {
        console.log('✅ Orders Success - Data1:', responseData.Data1);
        return {
          success: true,
          orders: responseData.Data1 || [],
          message: responseData.Message || 'Orders retrieved successfully'
        };
      } else {
        console.log('❌ Orders Failed:', responseData.Message);
        throw new Error(responseData.Message || 'Failed to fetch orders');
      }
      
    } catch (error) {
      const message = error.response?.data?.Message || error.message || 'Failed to fetch customer orders';
      throw new Error(message);
    }
  }

}

export const ordersService = new OrdersService();
export default ordersService;