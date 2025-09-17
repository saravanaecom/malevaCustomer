import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Truck, FileText, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Shipments", icon: <Truck size={20} />, path: "/shipments" },
    { name: "Invoices", icon: <FileText size={20} />, path: "/invoices" },
    { name: "Orders", icon: <ShoppingCart size={20} />, path: "/orders" },
    { name: "Profile", icon: <User size={20} />, path: "/profile" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-white border-r border-gray-200 flex-col shadow-sm">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            
            <div>
              <h1 className="text-2xl font-bold text-[#1F2937]">Maleva</h1>
            
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-6 py-8">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-4 mb-2 text-left rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                  ? "bg-[#0A66C2] text-white shadow-lg" 
                  : "text-[#6B7280] hover:bg-gray-50 hover:text-[#1F2937]"
              }`}
            >
              {item.icon}
              <span className="ml-4 font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="ml-4 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Maleva Logo"
                className="h-5 w-auto filter brightness-0 invert"
              />
            </div>
            <span className="text-lg font-bold text-[#1F2937]">Maleva</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#6B7280]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-white border-t border-gray-100">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 text-left ${
                  location.pathname === item.path 
                    ? "bg-[#0A66C2] text-white" 
                    : "text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-[#6B7280] hover:text-red-500 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-0 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}