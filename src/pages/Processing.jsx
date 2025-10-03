import { ArrowLeft, Clock, Package, Truck, MapPin, Calendar, User, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useOrders } from "../hooks/useOrders.js";
import { useUser } from "../hooks/useUser.js";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ImagePreview from "../components/ImagePreview.jsx";
import ImageGallery from "./ImageGallery.jsx";

export default function Processing({ onBack }) {
  const { username, customerId } = useUser();
  const { orders: apiOrders, loading, error, refetch } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showImageGallery, setShowImageGallery] = useState(false);
  const itemsPerPage = 20;

  // Transform and filter processing orders
  const transformApiOrders = (apiData) => {
    if (!apiData || apiData.length === 0) return [];
    
    return apiData.map((order) => ({
      id: order.Id || 'N/A',
      customerName: order.CustomerName,
      jobType: order.JobTypeName,
      status: order.JobStatus?.trim() || 'Unknown',
      pickupDate: order.PickupDate ? new Date(order.PickupDate).toLocaleDateString() : 'N/A',
      deliveryDate: order.DeliveryDate ? new Date(order.DeliveryDate).toLocaleDateString() : 'N/A',
      origin: order.Origin,
      destination: order.Destination,
      cargoDetails: order['Cargo detaile'] || order.Commodity || 'N/A',
      awbNo: order.AWBNo,
    }));
  };

  // Filter processing orders
  const allOrders = transformApiOrders(apiOrders);
  const baseProcessingOrders = allOrders.filter(order => {
    const status = order.status?.toUpperCase().trim();
    return status?.includes('PROGRESS') || status?.includes('UNDER') || 
           status?.includes('WAITING') || status?.includes('ASSIGNED') || 
           status?.includes('LOADING') || status?.includes('PICK UP') ||
           status?.includes('AT ') || status?.includes('EXPORTED');
  });

  // Get unique statuses for filter
  const uniqueStatuses = [...new Set(baseProcessingOrders.map(order => order.status?.trim()).filter(Boolean))].sort();

  // Apply status filter
  const processingOrders = baseProcessingOrders.filter(order => {
    return statusFilter === 'ALL' || order.status?.trim() === statusFilter;
  }).sort((a, b) => parseInt(b.id) - parseInt(a.id));

  // Pagination
  const totalPages = Math.ceil(processingOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = processingOrders.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toUpperCase().trim();
    if (normalizedStatus?.includes('PROGRESS') || normalizedStatus?.includes('UNDER')) {
      return "bg-orange-100 text-orange-800";
    }
    switch (normalizedStatus) {
      case "ASSIGNED": return "bg-blue-100 text-blue-800";
      case "AT AIRPORT": return "bg-sky-100 text-sky-800";
      case "AT WAREHOUSE": return "bg-indigo-100 text-indigo-800";
      case "WAITING FOR BILLING": return "bg-yellow-100 text-yellow-800";
      case "WAITING FOR L-VESSEL": return "bg-cyan-100 text-cyan-800";
      case "PICK UP DONE": return "bg-emerald-100 text-emerald-800";
      case "WAITING CUS INSTRUCTION": return "bg-pink-100 text-pink-800";
      case "WAITING FOR CUSTOMER CHARGES": return "bg-rose-100 text-rose-800";
      case "WAITING FOR FLIGHT": return "bg-fuchsia-100 text-fuchsia-800";
      case "WAITING FOR CFS": return "bg-green-100 text-green-800";
      case "EXPORTED": return "bg-blue-100 text-blue-800";
      case "PICK UP FROM WAREHOUSE": return "bg-emerald-100 text-emerald-800";
      case "WAITING FOR O-VESSEL": return "bg-cyan-100 text-cyan-800";
      default: return "bg-orange-100 text-orange-800";
    }
  };

  // Show image gallery if requested
  if (showImageGallery) {
    return <ImageGallery onBack={() => setShowImageGallery(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-2">
              <Clock className="w-5 h-5 text-white" />
            </div>
            Processing Orders
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {processingOrders.length} active orders
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-800">Filter Orders</span>
              </div>
              {statusFilter !== 'ALL' && (
                <button
                  onClick={() => {
                    setStatusFilter('ALL');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl text-base font-semibold text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all"
              >
                <option value="ALL">🔍 All Processing Statuses ({baseProcessingOrders.length})</option>
                {uniqueStatuses.map(status => {
                  const count = baseProcessingOrders.filter(order => order.status?.trim() === status).length;
                  return (
                    <option key={status} value={status}>
                      ⚡ {status} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
            
            {/* Active Filter Display */}
            {statusFilter !== 'ALL' && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-800">
                  Filtered Results: <span className="font-bold text-green-900">{processingOrders.length} orders</span> with status <span className="px-2 py-1 bg-green-200 text-green-900 rounded-lg font-bold">{statusFilter}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <LoadingSpinner 
            message="Loading Processing Orders..." 
            type="orders"
            size="large"
          />
        )}

        {/* Mobile Cards */}
        {!loading && (
          <div className="block md:hidden">
            <div key={`mobile-${statusFilter}-${currentPage}`} className="space-y-4">
              {currentOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">
                    {statusFilter !== 'ALL' 
                      ? `No orders with status "${statusFilter}"` 
                      : 'No processing orders found'
                    }
                  </p>
                </div>
              ) : (
                currentOrders.map((order, index) => (
                  <div key={`${statusFilter}-${order.id}-${index}`} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">#{order.id}</h3>
                        <p className="text-xs text-gray-600">{order.customerName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    {/* Compact Info */}
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Cargo Name</span>
                        <span className="font-medium">{order.loadingVessel ||'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Route:</span>
                        <span className="font-medium">{order.origin} → {order.destination}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium">{order.deliveryDate}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Cargo:</span>
                        <span className="font-medium truncate ml-2">{order.cargoDetails}</span>
                      </div>
                    </div>
                    
                    {/* Image Preview */}
                    <div className="flex justify-center">
                      <ImagePreview 
                        orderId={order.id} 
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs" 
                        onViewImages={() => setShowImageGallery(true)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Desktop Table */}
        {!loading && (
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Processing Orders
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Showing {Math.min(currentOrders.length, startIndex + 1)}-{startIndex + currentOrders.length} of {processingOrders.length} orders
              </p>
            </div>
            
            <div className="h-[60vh] overflow-y-auto overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cargo Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Air Way Bill NUmber</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Job Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cargo Details</th>
        
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Image</th>
                  </tr>
                </thead>
                <tbody key={`table-${statusFilter}-${currentPage}`} className="divide-y divide-gray-100">
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        {statusFilter !== 'ALL' 
                          ? `No orders with status "${statusFilter}"` 
                          : 'No processing orders found'
                        }
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order, index) => (
                      <tr key={`${statusFilter}-${order.id}-${index}`} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                        <td className="px-4 py-3 text-sm font-bold text-blue-900">{order.loadingVessel}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{order.awbNo}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">{order.jobType}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(order.status)}`}>
                            <Clock className="w-3 h-3 mr-1" />
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 max-w-xs truncate">
                          {order.Quantity}  - {order.totalweight}
                        </td>
                       
                        <td className="px-4 py-3 text-center">
                          <ImagePreview 
                            orderId={order.id} 
                            onViewImages={() => setShowImageGallery(true)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Desktop Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            currentPage === pageNum
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
  );
}