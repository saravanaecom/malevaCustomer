import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Grid, Download } from 'lucide-react';
import { getSelectedOrderId } from '../store/imageStore.js';

export default function ImageGallery({ onBack }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const id = getSelectedOrderId();
    setOrderId(id);
  }, []);

  // Get real images from localStorage (stored by ImagePreview)
  const storedImages = orderId ? JSON.parse(localStorage.getItem(`order_images_${orderId}`) || '[]') : [];
  const mockImages = storedImages.length > 0 ? storedImages : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockImages.length) % mockImages.length);
  };

  if (!orderId || mockImages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            {!orderId ? 'No order selected' : 'No images available for this order'}
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Order #{orderId} Images</h1>
            <p className="text-sm text-gray-500">{currentImageIndex + 1} of {mockImages.length}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Grid className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">{mockImages.length} Images</span>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative h-[calc(100vh-80px)] flex items-center justify-center">
        <img
          src={mockImages[currentImageIndex]}
          alt={`Order ${orderId} image ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />

        {/* Navigation Arrows */}
        {mockImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
          {currentImageIndex + 1} / {mockImages.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {mockImages.length > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {mockImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}