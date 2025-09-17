import { Truck, MapPin, Clock, Package } from "lucide-react";

export default function Shipments() {
  const shipments = [
    { id: "SO-1001", status: "In Transit", location: "Singapore", eta: "2 days", progress: 75 },
    { id: "SO-1002", status: "Delivered", location: "Malaysia", eta: "Completed", progress: 100 },
    { id: "SO-1003", status: "Processing", location: "Thailand", eta: "5 days", progress: 25 },
    { id: "SO-1004", status: "In Transit", location: "Indonesia", eta: "3 days", progress: 60 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-[#14B8A6] text-white";
      case "In Transit": return "bg-[#2563EB] text-white";
      case "Processing": return "bg-[#F59E0B] text-white";
      default: return "bg-[#6B7280] text-white";
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Shipments</h1>
          <p className="text-[#6B7280]">Track and manage your shipments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-[#0A66C2]/10 rounded-lg">
                <Package className="h-6 w-6 text-[#0A66C2]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#6B7280]">Total Shipments</p>
                <p className="text-2xl font-bold text-[#1F2937]">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-[#2563EB]/10 rounded-lg">
                <Truck className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#6B7280]">In Transit</p>
                <p className="text-2xl font-bold text-[#1F2937]">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
                <MapPin className="h-6 w-6 text-[#14B8A6]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#6B7280]">Delivered</p>
                <p className="text-2xl font-bold text-[#1F2937]">15</p>
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
                <p className="text-2xl font-bold text-[#1F2937]">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#1F2937]">Recent Shipments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Shipment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">ETA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1F2937]">
                      {shipment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                      {shipment.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                      {shipment.eta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#14B8A6] h-2 rounded-full" 
                          style={{ width: `${shipment.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-[#6B7280] mt-1">{shipment.progress}%</span>
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