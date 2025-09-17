import { useNavigate } from "react-router-dom";
import { Truck, FileText, ShoppingCart, TrendingUp, Package, DollarSign, Clock, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const quickStats = [
    { title: "Active Shipments", value: "8", icon: <Truck className="h-6 w-6" />, color: "bg-[#2563EB]", link: "/shipments" },
    { title: "Pending Invoices", value: "3", icon: <FileText className="h-6 w-6" />, color: "bg-[#F59E0B]", link: "/invoices" },
    { title: "Recent Orders", value: "12", icon: <ShoppingCart className="h-6 w-6" />, color: "bg-[#14B8A6]", link: "/orders" },
    
    
  ];

  const recentActivities = [
    { type: "shipment", message: "Shipment SO-1001 arrived in Singapore", time: "2 hours ago", status: "success" },
    { type: "invoice", message: "Invoice INV-2025-02 is pending payment", time: "4 hours ago", status: "warning" },
    { type: "order", message: "New order ORD-5003 has been confirmed", time: "6 hours ago", status: "info" },
    { type: "shipment", message: "Shipment SO-1002 is in transit", time: "1 day ago", status: "info" },
  ];

  const quickActions = [
    { title: "Track Shipment", description: "Monitor your cargo in real-time", icon: <Package className="h-8 w-8" />, link: "/shipments" },
    { title: "View Invoices", description: "Check billing and payment status", icon: <FileText className="h-8 w-8" />, link: "/invoices" },
    { title: "Place Order", description: "Order new shipping services", icon: <ShoppingCart className="h-8 w-8" />, link: "/orders" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#1F2937] mb-3">Good morning, Karthick</h1>
          <p className="text-[#6B7280] text-lg">Here's what's happening with your logistics today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {quickStats.map((stat, index) => (
            <div 
              key={index} 
              onClick={() => navigate(stat.link)}
              className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#0A66C2]/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#6B7280] mb-3">{stat.title}</p>
                  <p className="text-3xl font-bold text-[#1F2937] mb-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#0A66C2]/10 transition-colors">
                  <div className="text-[#0A66C2]">
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#1F2937]">Recent Activities</h2>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-[#1F2937] font-medium">{activity.message}</p>
                        <p className="text-sm text-[#6B7280] mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#1F2937]">Quick Actions</h2>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <div 
                      key={index}
                      onClick={() => navigate(action.link)}
                      className="p-6 border border-gray-100 rounded-xl hover:border-[#0A66C2]/30 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#0A66C2]/10 transition-colors">
                            <div className="text-[#0A66C2]">{action.icon}</div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#1F2937]">{action.title}</h3>
                            <p className="text-sm text-[#6B7280] mt-1">{action.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-[#6B7280] group-hover:text-[#0A66C2] transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
