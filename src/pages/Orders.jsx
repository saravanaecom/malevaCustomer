import { ShoppingCart, Package, Clock, CheckCircle, AlertCircle, X, User, Calendar, MapPin, Truck, FileText, DollarSign, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useOrders } from "../hooks/useOrders.js";
import { useUser } from "../hooks/useUser.js";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ImagePreview from "../components/ImagePreview.jsx";
import ImageGallery from "./ImageGallery.jsx";
import Processing from "./Processing.jsx";
import { useNavigate } from "react-router-dom";
export default function Orders() {
  const { username, customerId } = useUser();
  const navigate = useNavigate();
  const { orders: apiOrders, loading, error, refetch } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const itemsPerPage = 20;
  
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };
  
  // Transform API data to display format
  const transformApiOrders = (apiData) => {
    if (!apiData || apiData.length === 0) return [];
    
    return apiData.map((order) => {
      return {
        id: order.Id || 'N/A',
        billNo: order.Id || 'N/A',
        customerName: order.CustomerName,
        jobType: order.JobTypeName,
        status: order.JobStatus?.trim() || 'Unknown',
        pickupDate: order.PickupDate ? new Date(order.PickupDate).toLocaleDateString() : 'N/A',
        deliveryDate: order.DeliveryDate ? new Date(order.DeliveryDate).toLocaleDateString() : 'N/A',
        estimatedDelivery: order.DeliveryDate ? new Date(order.DeliveryDate).toLocaleDateString() : 'N/A',
        pickupAddress: order.PickupAddress,
        deliveryAddress: order.DeliveryAddress,
        origin: order.Origin,
        destination: order.Destination,
        commodity: order.Commodity,
        cargoDetails: order['Cargo detaile'] || order.Commodity || 'N/A',
        awbNo: order.AWBNo,
        loadingVessel: order.LoadingVesselName || '',
        offVessel: order.OffVesselName || '',
        loadingPort: order.LoadingPort || '',
        offPort: order.OffPort || '',
        netAmount: order.ActualNetAmount,
        Quantity: order.Quantity,
        totalweight: order.totalweight,
        currency: 'RM',
        items: 1,
        date: order.PickupDate ? new Date(order.PickupDate).toLocaleDateString() : 'N/A'
      };
    });
  };
  
  // Process and sort all orders
  const allOrders = transformApiOrders(apiOrders).sort((a, b) => {
    const idA = parseInt(a.id) || 0;
    const idB = parseInt(b.id) || 0;
    return idB - idA;
  });
  
  // Get unique statuses
  const uniqueStatuses = [...new Set(allOrders.map(order => order.status?.trim()).filter(Boolean))].sort();
  
  // Apply filter
  const filteredOrders = statusFilter === 'ALL' 
    ? allOrders 
    : allOrders.filter(order => order.status?.trim() === statusFilter);
  
  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);
  
  const goToPage = (page) => {
    setCurrentPage(page);
  };
  
  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const goToNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toUpperCase().trim();
    // Check if status contains "PROGRESS" or "UNDER" for in-progress statuses
    if (normalizedStatus?.includes('PROGRESS') || normalizedStatus?.includes('UNDER')) {
      return "bg-orange-100 text-orange-800";
    }
    switch (normalizedStatus) {
      case "ASSIGNED": return "bg-blue-100 text-blue-800";
      case "TEST NEW12": return "bg-purple-100 text-purple-800";
      case "AT AIRPORT": return "bg-sky-100 text-sky-800";
      case "AT WAREHOUSE": return "bg-indigo-100 text-indigo-800";
      case "DELIVERY DONE": return "bg-emerald-100 text-emerald-800";
      case "WAITING FOR BILLING": return "bg-yellow-100 text-yellow-800";
      case "JOB COMPLET": return "bg-green-100 text-green-800";
      case "WAITING FOR L-VESSEL": return "bg-cyan-100 text-cyan-800";
      case "PICK UP DONE": return "bg-emerald-100 text-emerald-800";
      case "Z-CANCEL": return "bg-red-100 text-red-800";
      case "TBA": return "bg-gray-100 text-gray-800";
      case "WAITING CUS INSTRUCTION": return "bg-pink-100 text-pink-800";
      case "WAITING FOR CUSTOMER CHARGES": return "bg-rose-100 text-rose-800";
      case "WAITING FOR FLIGHT": return "bg-fuchsia-100 text-fuchsia-800";
      case "DROP DONE": return "bg-teal-100 text-teal-800";
      case "WAITING FOR POD": return "bg-lime-100 text-lime-800";
      case "WAITING FOR CFS": return "bg-green-100 text-green-800";
      case "EXPORTED": return "bg-blue-100 text-blue-800";
      case "PICK UP FROM WAREHOUSE": return "bg-emerald-100 text-emerald-800";
      case "DROP FROM WARE HOUSE": return "bg-teal-100 text-teal-800";
      case "UNKNOWN": return "bg-slate-100 text-slate-800";
      case "WAITING FOR O-VESSEL": return "bg-cyan-100 text-cyan-800";
      case "UNLOADING DONE": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toUpperCase().trim();
    switch (normalizedStatus) {
      case "JOB COMPLET":
      case "COMPLETED":
      case "DELIVERED": return <CheckCircle className="h-4 w-4" />;
      case "SHIPPED": return <Package className="h-4 w-4" />;
      case "IN PROGRESS":
      case "PROCESSING": return <Clock className="h-4 w-4" />;
      default: return <ShoppingCart className="h-4 w-4" />;
    }
  };



  const completedAllOrders = allOrders.filter(order => {
    const status = order.status?.toUpperCase().trim();
    return status?.includes('COMPLET') || status?.includes('DONE');
  }).length;
  const processingAllOrders = allOrders.filter(order => {
    const status = order.status?.toUpperCase().trim();
    return status?.includes('PROGRESS') || status?.includes('UNDER') || 
           status?.includes('WAITING') || status?.includes('ASSIGNED') || 
           status?.includes('LOADING') || status?.includes('PICK UP') ||
           status?.includes('AT ') || status?.includes('EXPORTED');
  }).length;
  const cancelledAllOrders = allOrders.filter(order => {
    const status = order.status?.toUpperCase().trim();
    return status?.includes('CANCEL');
  }).length;
  // const totalValue = orders.reduce((sum, order) => {
  //   return sum + (order.netAmount || 0);
  // }, 0);

  // Show image gallery if requested
  if (showImageGallery) {
    return <ImageGallery onBack={() => setShowImageGallery(false)} />;
  }

  // Show processing page if requested
  if (showProcessing) {
    return <Processing onBack={() => setShowProcessing(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 animate-gradient-x">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-2">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            All Orders
          </h1>
         
          {error && (
            <div className="mt-2 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={refetch}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Filter className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-base font-semibold text-gray-900">Filter Orders</span>
              </div>
              {statusFilter !== 'ALL' && (
                <button
                  onClick={() => {
                    setStatusFilter('ALL');
                    setCurrentPage(1);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="ALL">🔍 All Statuses ({allOrders.length})</option>
                {uniqueStatuses.map(status => {
                  const count = allOrders.filter(order => order.status?.trim() === status).length;
                  return (
                    <option key={status} value={status}>

                      📋 {status} ({count})
                    </option>
                  );
                })}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <ChevronRight className="w-5 h-5 text-gray-400 transform rotate-90" />
              </div>
            </div>
            
            {/* Active Filter Display */}
            {statusFilter !== 'ALL' && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">
                  Showing {filteredOrders.length} orders with status: <span className="font-bold">{statusFilter}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="p-2 md:p-3 bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/20 rounded-lg mb-2 md:mb-0 self-start animate-pulse-slow">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#14B8A6] animate-bounce-slow" />
              </div>
              <div className="md:ml-4">
                <p className="text-xs md:text-sm text-[#6B7280]">Completed</p>
                <p className="text-xl md:text-2xl font-bold text-[#1F2937] animate-count-up">{completedAllOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up cursor-pointer" 
              onClick={() => navigate('/processing')}>
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="p-2 md:p-3 bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/20 rounded-lg mb-2 md:mb-0 self-start animate-pulse-slow">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-[#F59E0B] animate-spin-slow" />
              </div>
              <div className="md:ml-4">
                <p className="text-xs md:text-sm text-[#6B7280]">Processing</p>
                <p className="text-xl md:text-2xl font-bold text-[#1F2937] animate-count-up">{processingAllOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="p-2 md:p-3 bg-gradient-to-br from-red-500/10 to-red-500/20 rounded-lg mb-2 md:mb-0 self-start animate-pulse-slow">
                <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-red-500 animate-pulse" />
              </div>
              <div className="md:ml-4">
                <p className="text-xs md:text-sm text-[#6B7280]">Cancelled</p>
                <p className="text-xl md:text-2xl font-bold text-[#1F2937] animate-count-up">{cancelledAllOrders}</p>
              </div>
            </div>
          </div>     
        </div>

        {/* Loading Spinner */}
        {loading && (
          <LoadingSpinner 
            message="Loading Orders..." 
            subMessage="Please wait while we fetch your order data"
            type="orders"
            size="large"
          />
        )}

        {/* Mobile Card Layout */}
        {!loading && (
          <div key={`mobile-${statusFilter}-${currentPage}`} className="block md:hidden">
            {/* Mobile Pagination Info */}
            <div className="flex justify-between items-center mb-4 px-2">
              <p className="text-sm text-gray-600">
                Showing {Math.min(currentOrders.length, startIndex + 1)}-{startIndex + currentOrders.length} of {filteredOrders.length} orders
              </p>
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            
            <div className="h-[calc(100vh-280px)] overflow-y-auto space-y-3 px-1 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              {currentOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">
                    {statusFilter === 'ALL' ? 'No orders found' : `No orders with status "${statusFilter}"`}
                  </p>
                </div>
              ) : (
              currentOrders.map((order, index) => (
                <div 
                  key={`mobile-${statusFilter}-${order.id}-${index}`} 
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-xl transition-all duration-500 active:scale-[0.98] transform overflow-hidden animate-slide-in-bottom hover:scale-[1.02] group"
                  onClick={() => openModal(order)}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Status Banner */}
                  <div className={`h-1 w-full ${getStatusColor(order.status).includes('green') ? 'bg-green-400' : getStatusColor(order.status).includes('blue') ? 'bg-blue-400' : getStatusColor(order.status).includes('orange') ? 'bg-orange-400' : getStatusColor(order.status).includes('red') ? 'bg-red-400' : 'bg-gray-400'}`}></div>
                  
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <h3 className="font-bold text-[#1F2937] text-lg">#{order.id}</h3>
                        </div>
                        <p className="text-sm text-[#6B7280] font-medium">{order.customerName || 'N/A'}</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)} shadow-sm`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1.5">{order.status}</span>
                      </span>
                    </div>
                    
                    {/* Key Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Truck className="w-4 h-4 text-orange-500" />
                          <p className="text-xs font-medium text-gray-600">Job Type</p>
                        </div>
                        <p className="text-sm font-semibold text-[#1F2937] truncate">{order.jobType || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <p className="text-xs font-medium text-gray-600">Delivery</p>
                        </div>
                        <p className="text-sm font-semibold text-[#1F2937]">{order.estimatedDelivery || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {/* Route */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <p className="text-xs font-medium text-gray-600">Route</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#1F2937] bg-white px-2 py-1 rounded-lg">{order.origin}</span>
                        <div className="flex-1 mx-2">
                          <div className="h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 rounded"></div>
                        </div>
                        <span className="text-sm font-semibold text-[#1F2937] bg-white px-2 py-1 rounded-lg">{order.destination}</span>
                      </div>
                    </div>
                    
                    {/* Cargo Details */}
                    <div className="bg-orange-50 rounded-xl p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Package className="w-4 h-4 text-orange-500" />
                        <p className="text-xs font-medium text-orange-600">Cargo Details</p>
                      </div>
                      <p className="text-sm font-semibold text-orange-800">{order.cargoDetails}</p>
                    </div>
                    
                    {/* Image Preview */}
                    <div className="flex justify-center pt-2">
                      <ImagePreview 
                        orderId={order.id} 
                        className="w-full justify-center" 
                        onViewImages={() => setShowImageGallery(true)}
                      />
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
            
            {/* Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-4 px-2">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Desktop Table Layout */}
        {!loading && (
          <div key={`table-${statusFilter}-${currentPage}`} className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-lg font-semibold text-[#1F2937] animate-slide-in-left">Recent Orders</h2>
              <p className="text-sm text-gray-600">
                Showing {Math.min(currentOrders.length, startIndex + 1)}-{startIndex + currentOrders.length} of {filteredOrders.length} orders
              </p>
            </div>
            
            <div className="h-[60vh] overflow-y-auto overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"> Cargo Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Air Way Bill NUmber</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Job Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cargo Details</th>
                    
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Image</th>
                  </tr>
                </thead>
                <tbody key={`tbody-${statusFilter}-${currentOrders.length}`} className="divide-y divide-gray-100">
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        {statusFilter === 'ALL' ? 'No orders found' : `No orders with status "${statusFilter}"`}
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order, index) => (
                      <tr key={`${statusFilter}-${order.id}-${index}`} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-300 animate-fade-in-up group" >
                        <td className="px-4 py-3 text-sm font-bold text-blue-900">
                          {order.loadingVessel}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 max-w-xs truncate">
                          {order.awbNo || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">
                          {order.jobType || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
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
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(7, totalPages))].map((_, i) => {
                      const pageNum = currentPage <= 4 ? i + 1 : currentPage - 3 + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-2">
            <div className="bg-white rounded-3xl max-w-sm w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-4 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">Order Details</h2>
                  <button 
                    onClick={closeModal}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 space-y-4">
                {/* Order Header */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-2">#{selectedOrder.id}</h3>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)} shadow-sm`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1.5">{selectedOrder.status}</span>
                  </span>
                </div>
                
                {/* Order Info Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {/* Order ID - Important */}
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-blue-600">Order ID</p>
                      <p className="text-lg font-bold text-blue-800">{selectedOrder.id}</p>
                    </div>
                  </div>
                  
                  {/* Customer */}
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Customer</p>
                      <p className="text-base font-semibold text-[#1F2937]">{selectedOrder.customerName || 'N/A'}</p>
                    </div>
                  </div>
                  
                  
                  
                  {/* Route */}
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Route</p>
                      <p className="text-base font-semibold text-[#1F2937]">{selectedOrder.origin} → {selectedOrder.destination}</p>
                    </div>
                  </div>
                  
                  {/* Job Type */}
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Truck className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Job Type</p>
                      <p className="text-base font-semibold text-[#1F2937]">{selectedOrder.jobType || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {/* Cargo Details - Important */}
                  <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Package className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-600">Cargo Details</p>
                      <p className="text-base font-semibold text-orange-800">{selectedOrder.cargoDetails}</p>
                    </div>
                  </div>
                  
                  {/* Estimated Delivery Date - Important */}
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-600">Estimated Delivery Date</p>
                      <p className="text-base font-semibold text-green-800">{selectedOrder.estimatedDelivery || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {/* Pickup Address */}
                  {selectedOrder.pickupAddress && (
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Pickup Address</p>
                        <p className="text-sm text-[#1F2937] whitespace-pre-line">{selectedOrder.pickupAddress}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Delivery Address */}
                  {selectedOrder.deliveryAddress && (
                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Delivery Address</p>
                        <p className="text-sm text-[#1F2937] whitespace-pre-line">{selectedOrder.deliveryAddress}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* AWB Number */}
                  {selectedOrder.awbNo && (
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">AWB Number</p>
                        <p className="text-base font-semibold text-[#1F2937]">{selectedOrder.awbNo}</p>
                      </div>
                    </div>
                  )}
                  

                  
                  {/* Image Preview */}
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl">
                    <ImagePreview 
                      orderId={selectedOrder.id} 
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium" 
                      onViewImages={() => {
                        closeModal();
                        setShowImageGallery(true);
                      }}
                    />
                  </div>
                  
                  {/* Vessel Information - Always Show */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-[#1F2937] flex items-center">
                      <Package className="w-5 h-5 mr-2 text-blue-600" />
                      Vessel & Port Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-cyan-600">Loading Vessel Name</p>
                        <p className="font-semibold text-cyan-800">{selectedOrder.loadingVessel || 'Not specified'}</p>
                      </div>
                      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-cyan-600">Off Vessel Name</p>
                        <p className="font-semibold text-cyan-800">{selectedOrder.offVessel || 'Not specified'}</p>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-indigo-600">Loading Port</p>
                        <p className="font-semibold text-indigo-800">{selectedOrder.loadingPort || 'Not specified'}</p>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-indigo-600">Off Port</p>
                        <p className="font-semibold text-indigo-800">{selectedOrder.offPort || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  

                </div>
                
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="w-full bg-gradient-to-r from-[#0A66C2] to-[#2563EB] text-white py-3 rounded-xl font-semibold hover:from-[#0A66C2]/90 hover:to-[#2563EB]/90 transition-all duration-200"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}