import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-12 md:px-24 bg-white">
        
        {/* Logo & Company Name */}
        <div className="mb-12 text-center">
          <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-16 h-16 bg-[#0A66C2] rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <img
                src="/logo.png"
                alt="Maleva Logo"
                className="h-10 w-auto filter brightness-0 invert"
              />
            </div>
            <h1 className="text-4xl font-bold text-[#1F2937] mb-2">
              Maleva
            </h1>
            <p className="text-[#6B7280] text-lg">
              Logistics Platform
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-3">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] focus:outline-none transition-all bg-gray-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-3">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] focus:outline-none transition-all bg-gray-50 focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0A66C2] text-white py-4 rounded-xl font-semibold hover:bg-[#0A66C2]/90 transition-all shadow-sm"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Right Side - Background with Overlay */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center">
        {/* Background Image */}
        <img
          src="/truckmaleva.jpg"
          alt="Shipping Truck"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/70 to-black/80"></div>

        {/* Text */}
        <div className="relative z-10 text-center px-10">
          <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-4 tracking-wide drop-shadow-lg">
            Reliable Shipping & Cargo Management
          </h2>
          <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-md">
            Powered by Maleva
          </p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse delay-100"></div>
            <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
