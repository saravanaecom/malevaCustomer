import { ShoppingCart, Package, Clock, CheckCircle } from "lucide-react";

export default function Orders() {
  const orders = [
    { id: "ORD-5001", product: "Ship Spare Parts", qty: 3, status: "Confirmed", date: "2025-01-15", total: "$1,250" },
    { id: "ORD-5002", product: "Engine Oil", qty: 10, status: "Processing", date: "2025-01-14", total: "$850" },
    { id: "ORD-5003", product: "Navigation Equipment", qty: 1, status: "Shipped", date: "2025-01-12", total: "$2,100" },
    { id: "ORD-5004", product: "Safety Gear", qty: 5, status: "Delivered", date: "2025-01-10", total: "$675" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-[#14B8A6] text-white";
      case "Shipped": return "bg-[#2563EB] text-white";
      case "Confirmed": return "bg-[#0A66C2] text-white";
      case "Processing": return "bg-[#F59E0B] text-white";
      default: return "bg-[#6B7280] text-white";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="h-4 w-4" />;
      case "Shipped": return <Package className="h-4 w-4" />;
      case "Processing": return <Clock className="h-4 w-4" />;
      default: return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'Delivered').length;
  const processingOrders = orders.filter(order => order.status === 'Processing').length;
  const totalValue = orders.reduce((sum, order) => sum + parseFloat(order.total.replace('$', '').replace(',', '')), 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Orders</h1>
          <p className="text-[#6B7280]">Track and manage your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-[#0A66C2]/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-[#0A66C2]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#6B7280]">Total Orders</p>
                <p className="text-2xl font-bold text-[#1F2937]">{totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-[#14B8A6]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#6B7280]">Completed</p>
                <p className="text-2xl font-bold text-[#1F2937]">{completedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                <Clock className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#6B7280]">Processing</p>
                <p className="text-2xl font-bold text-[#1F2937]">{processingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-[#2563EB]/10 rounded-lg">
                <Package className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#6B7280]">Total Value</p>
                <p className="text-2xl font-bold text-[#1F2937]">${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#1F2937]">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1F2937]">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1F2937]">
                      {order.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                      {order.qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1F2937]">
                      {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}