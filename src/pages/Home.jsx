import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-100">
      <div className="text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#0A66C2] via-[#2563EB] to-[#14B8A6] rounded-3xl flex items-center justify-center shadow-2xl mb-6 transform hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="Maleva Logo"
              className="h-14 w-auto filter brightness-0 invert"
            />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome to Maleva
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your trusted logistics partner
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}