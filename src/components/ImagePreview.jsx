import { Grid } from 'lucide-react';
import { setSelectedOrderId } from '../store/imageStore.js';
import { useState } from 'react';
import { imageFetchService } from '../services/imagefeatchService.js';

export default function ImagePreview({ orderId, className = "", onViewImages }) {
  const [loading, setLoading] = useState(false);

  const handleViewImages = async (e) => {
    e.stopPropagation(); // Prevent row click
    setLoading(true);
    
    try {
      // Fetch images from API
      const fetchedImages = await imageFetchService.fetchOrderImages(orderId);
      
      // Store order ID and images
      setSelectedOrderId(orderId);
      localStorage.setItem(`order_images_${orderId}`, JSON.stringify(fetchedImages));
      
      if (onViewImages) {
        onViewImages(); // Navigate to gallery
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleViewImages}
      disabled={loading}
      className={`relative p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 ${className}`}
      title="View Images"
    >
      {loading ? (
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600"></div>
      ) : (
        <Grid className="w-4 h-4" />
      )}
    </button>
  );
}