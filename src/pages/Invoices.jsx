import { FileText, DollarSign, Calendar, Download } from "lucide-react";

export default function Invoices() {
  const invoices = [
    { id: "INV-2025-01", amount: "$2,500", status: "Paid", date: "2025-01-15", dueDate: "2025-01-30" },
    { id: "INV-2025-02", amount: "$1,200", status: "Pending", date: "2025-01-10", dueDate: "2025-01-25" },
    { id: "INV-2025-03", amount: "$3,800", status: "Overdue", date: "2024-12-20", dueDate: "2025-01-05" },
    { id: "INV-2025-04", amount: "$950", status: "Paid", date: "2025-01-08", dueDate: "2025-01-23" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-[#14B8A6] text-white";
      case "Pending": return "bg-[#F59E0B] text-white";
      case "Overdue": return "bg-[#EF4444] text-white";
      default: return "bg-[#6B7280] text-white";
    }
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);
  const paidAmount = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Invoices</h1>
          <p className="text-[#6B7280]">Manage your billing and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-[#0A66C2]/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-[#0A66C2]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#6B7280]">Total Amount</p>
                <p className="text-2xl font-bold text-[#1F2937]">${totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
                <FileText className="h-6 w-6 text-[#14B8A6]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#6B7280]">Paid</p>
                <p className="text-2xl font-bold text-[#1F2937]">${paidAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                <Calendar className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-[#6B7280]">Pending</p>
                <p className="text-2xl font-bold text-[#1F2937]">${pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#1F2937]">Recent Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Invoice ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Issue Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1F2937]">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1F2937]">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                      {invoice.dueDate}
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