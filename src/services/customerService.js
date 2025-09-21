// Customer Service with Axios
import { apiClient } from '../api/client.js';
import { CUSTOMERS_ENDPOINTS } from '../api/endpoints/customers.js';
import { ServerURL } from '../config/serverConfig.js';

class CustomerService {
  async getCustomerDetails(customerId, companyId) {
    try {
      const requestBody = {
        Id: parseInt(customerId),
        Comid: parseInt(companyId || ServerURL.COMPANY_REF_ID)
      };
      
      console.log('🚀 Customer API Request:', {
        url: CUSTOMERS_ENDPOINTS.GET_CUSTOMER_DETAILS,
        body: requestBody
      });
      
      const response = await apiClient.post(CUSTOMERS_ENDPOINTS.GET_CUSTOMER_DETAILS, requestBody);
      
      console.log('📦 Customer API Response:', {
        status: response.status,
        data: response.data
      });
      
      const responseData = response.data;
      
      // Check if request was successful
      if (response.status === 200 && responseData.IsSuccess) {
        console.log('✅ Customer Success - Data1:', responseData.Data1);
        return responseData;
      } else {
        console.log('❌ Customer Failed:', responseData.Message);
        throw new Error(responseData.Message || 'Failed to fetch customer details');
      }
      
    } catch (error) {
      console.error('Error fetching customer details:', error);
      const message = error.response?.data?.Message || error.message || 'Failed to fetch customer details';
      throw new Error(message);
    }
  }

  async login(credentials) {
    try {
      const response = await apiClient.post(CUSTOMERS_ENDPOINTS.LOGIN, credentials);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.Message || error.message || 'Login failed';
      throw new Error(message);
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await apiClient.post(CUSTOMERS_ENDPOINTS.UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.Message || error.message || 'Failed to update profile';
      throw new Error(message);
    }
  }
}

export const customerService = new CustomerService();
export default customerService;