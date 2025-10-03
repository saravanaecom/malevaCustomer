import { useNavigate } from "react-router-dom";
import { Truck, FileText, ShoppingCart, TrendingUp, Package, DollarSign, Clock, ArrowRight, CheckCircle, AlertCircle, MapPin, Calendar, BarChart3, PieChart } from "lucide-react";
import { useUser } from "../hooks/useUser.js";
import { useOrders } from "../hooks/useOrders.js";
import { useState, useEffect } from "react";
import Processing from "./Processing.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, customerId,  username } = useUser();
  const { orders: apiOrders, loading } = useOrders();
  const [animatedStats, setAnimatedStats] = useState({ total: 0, completed: 0, processing: 0, cancelled: 0 });
  const [showProcessing, setShowProcessing] = useState(false);

  // Transform API data
  const transformApiOrders = (apiData) => {
    if (!apiData || apiData.length === 0) return [];
    return apiData.map((order) => ({
      id: order.Id || 'N/A',
      customerName: order.CustomerName,
      jobType: order.JobTypeName,
      status: order.JobStatus?.trim() || 'Unknown',
      deliveryDate: order.DeliveryDate ? new Date(order.DeliveryDate).toLocaleDateString() : 'N/A',
      origin: order.Origin,
      destination: order.Destination,
      cargoDetails: order['Cargo detaile'] || order.Commodity || 'N/A',
      netAmount: order.ActualNetAmount || 0,
    }));
  };

  const orders = transformApiOrders(apiOrders);

  // Calculate real statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => {
    const status = order.status?.toUpperCase().trim();
    return status?.includes('COMPLET') || status?.includes('DONE');
  }).length;
  const processingOrders = orders.filter(order => {
    const status = order.status?.toUpperCase().trim();
    return status?.includes('PROGRESS') || status?.includes('UNDER') || 
           status?.includes('WAITING') || status?.includes('ASSIGNED') || 
           status?.includes('LOADING') || status?.includes('PICK UP') ||
           status?.includes('AT ') || status?.includes('EXPORTED');
  }).length;
  const cancelledOrders = orders.filter(order => {
    const status = order.status?.toUpperCase().trim();
    return status?.includes('CANCEL');
  }).length;

  // Animate numbers
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ total: totalOrders, completed: completedOrders, processing: processingOrders, cancelled: cancelledOrders });
    }, 500);
    return () => clearTimeout(timer);
  }, [totalOrders, completedOrders, processingOrders, cancelledOrders]);

  // Recent orders for activities
  const recentOrders = orders.slice(0, 5);

  // Show Processing page if requested
  if (showProcessing) {
    return <Processing onBack={() => setShowProcessing(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700 font-medium">Loading dashboard data...</p>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-10 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] mb-2 sm:mb-3 animate-slide-in-left">
                Good morning, {username || user?.name || 'User'}!
              </h1>
              <p className="text-[#6B7280] text-sm sm:text-base lg:text-lg animate-slide-in-right">Here's your logistics dashboard overview.</p>
              {customerId && (
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1 sm:mt-2">
                  Customer ID: {customerId} 
                </p>
              )}
            </div>
            <div className="hidden sm:block">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">System Online</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
          {/* Total Orders */}
          <div className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-up" 
               onClick={() => navigate('/orders')} style={{animationDelay: '0.1s'}}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-[#6B7280] mb-1 sm:mb-2">Total Orders</p>
                <p className="text-xl sm:text-3xl font-bold text-[#1F2937] animate-count-up">{animatedStats.total}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform self-end sm:self-auto">
                <ShoppingCart className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-up" 
               onClick={() => navigate('/orders')} style={{animationDelay: '0.2s'}}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-[#6B7280] mb-1 sm:mb-2">Completed</p>
                <p className="text-xl sm:text-3xl font-bold text-[#1F2937] animate-count-up">{animatedStats.completed}</p>
                <p className="text-xs text-green-600 mt-1">
                  {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}% rate
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform self-end sm:self-auto">
                <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Processing Orders */}
          <div className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-up" 
               onClick={() => setShowProcessing(true)} style={{animationDelay: '0.3s'}}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-[#6B7280] mb-1 sm:mb-2">Processing</p>
                <p className="text-xl sm:text-3xl font-bold text-[#1F2937] animate-count-up">{animatedStats.processing}</p>
                <p className="text-xs text-orange-600 mt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1 animate-spin" />
                  Progress
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform self-end sm:self-auto">
                <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-up" 
               onClick={() => navigate('/orders')} style={{animationDelay: '0.4s'}}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-[#6B7280] mb-1 sm:mb-2">Cancelled</p>
                <p className="text-xl sm:text-3xl font-bold text-[#1F2937] animate-count-up">{animatedStats.cancelled}</p>
                <p className="text-xs text-red-600 mt-1">
                  {totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0}% rate
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform self-end sm:self-auto">
                <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] flex items-center">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                    Recent Orders
                  </h2>
                  <button 
                    onClick={() => navigate('/orders')}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-4">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group" 
                           onClick={() => navigate('/orders')}>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 animate-pulse flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base text-[#1F2937] font-medium group-hover:text-blue-600 transition-colors truncate">
                            Order #{order.id} - {order.cargoDetails}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                            <p className="text-xs sm:text-sm text-[#6B7280] flex items-center">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{order.origin} → {order.destination}</span>
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                              order.status?.toUpperCase().includes('COMPLET') ? 'bg-green-100 text-green-800' :
                              order.status?.toUpperCase().includes('PROGRESS') ? 'bg-orange-100 text-orange-800' :
                              order.status?.toUpperCase().includes('CANCEL') ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent orders found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}