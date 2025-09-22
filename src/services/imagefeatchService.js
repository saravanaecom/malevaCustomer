// Image Fetch Service with Axios
import { apiClient } from '../api/client.js';
import { IMAGEFETCH_ENDPOINTS } from '../api/endpoints/imagefetch.js';
import { ServerURL } from '../config/serverConfig.js';

class ImageFetchService {
  async fetchOrderImages(orderId) {
    try {
      const ImageDirectory = `/Upload/${ServerURL.COMPANY_REF_ID}/SalesOrder/${orderId}/`;
      
      console.log('🖼️ Image API Request:', {
        url: IMAGEFETCH_ENDPOINTS.FETCH_IMAGE,
        ImageDirectory: ImageDirectory
      });

      const params = {
      ImageDirectory: ImageDirectory
      };
      
      // POST request with ImageDirectory as form data
      const response = await apiClient.post(IMAGEFETCH_ENDPOINTS.FETCH_IMAGE, null, {
        params: params,
      
      });
      
      console.log('📸 Image API Response:', {
        status: response.status,
        data: response.data
      });
      
      const responseData = response.data;
      
      // API returns array of image paths directly
      if (response.status === 200 && Array.isArray(responseData) && responseData.length > 0) {
        // Convert to full URLs
        const imageUrls = responseData.map(imagePath => {
          return `${ServerURL.PRODUCTION_HOST_URL}${imagePath}`;
        });
        
        console.log('✅ Images Success:', imageUrls);
        return imageUrls;
      }
      
      console.log('📭 No images found for order:', orderId);
      return [];
      
    } catch (error) {
      const message = error.response?.data?.Message || error.message || 'Failed to fetch order images';
      console.error('❌ Image fetch error:', message);
      return [];
    }
  }

}

export const imageFetchService = new ImageFetchService();
export default imageFetchService;