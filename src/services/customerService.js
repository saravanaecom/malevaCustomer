import { apiRequest } from './apiService.js';

export const customerService = {
  async getCustomerDetails(customerId, companyId) {
    try {
      const response = await apiRequest('/CustomersLoginApp/GetCustomerDetails', 'POST', {
        Id: parseInt(customerId),
        Comid: parseInt(companyId)
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching customer details:', error);
      throw error;
    }
  }
};