import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "../services/authService.js";
import { userStore } from "../store/userStore.js";
import { extractCredentialsFromUrl, clearUrlParams, shouldAutoLogin, getDefaultCredentials } from "../utils/urlAuth.js";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Auto-login from URL and redirect if already logged in
  useEffect(() => {
    const handleAutoLogin = async () => {
      // Check if already authenticated
      if (userStore.isUserAuthenticated()) {
        navigate('/dashboard', { replace: true });
        return;
      }

      // Check for URL parameters for auto-login
      const urlCreds = extractCredentialsFromUrl();
      
      // Auto-login if accessing dashboard directly or has URL credentials
      if ((urlCreds.autoLogin && urlCreds.username && urlCreds.password) || shouldAutoLogin()) {
        const credentials = (urlCreds.username && urlCreds.password) 
          ? { username: urlCreds.username, password: urlCreds.password }
          : getDefaultCredentials();
        setLoading(true);
        try {
          const response = await authService.login({
            username: credentials.username,
            password: credentials.password,
            oldUserId: ''
          });
          
          if (response.success) {
            userStore.setUser(response.user);
            clearUrlParams(); // Remove credentials from URL
            const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
            navigate(redirectPath, { replace: true });
          }
        } catch (error) {
          setError('Auto-login failed: ' + error.message);
          clearUrlParams();
        } finally {
          setLoading(false);
        }
      }
    };

    handleAutoLogin();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const formData = new FormData(e.target);
    const credentials = {
      username: formData.get('username'),
      password: formData.get('password'),
      oldUserId: '' // Optional parameter
    };
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        // Store user data in centralized store
        userStore.setUser(response.user);
      
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message || 'Please enter correct credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-12 md:px-24 bg-white animate-fade-in-left">
        
        {/* Logo & Company Name */}
        <div className="mb-12 text-center animate-bounce-in">
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => navigate("/dashboard")}>
            <div className="w-16 h-16 bg-gradient-to-br from-[#0A66C2] to-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 animate-float">
              <img
                src="/logo.png"
                alt="Maleva Logo"
                className="h-10 w-auto filter brightness-0 invert"
              />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0A66C2] to-[#2563EB] bg-clip-text text-transparent mb-2 animate-slide-up">
              Maleva
            </h1>
            <p className="text-[#6B7280] text-lg animate-slide-up-delay">
              Logistics Platform
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 animate-slide-up-form">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div className="animate-slide-in-right" style={{animationDelay: '0.3s'}}>
            <label className="block text-sm font-semibold text-[#1F2937] mb-3">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white focus:scale-105 focus:shadow-lg"
              required
            />
          </div>

          <div className="animate-slide-in-right" style={{animationDelay: '0.5s'}}>
            <label className="block text-sm font-semibold text-[#1F2937] mb-3">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white focus:scale-105 focus:shadow-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0A66C2] to-[#2563EB] text-white py-4 rounded-xl font-semibold hover:from-[#0A66C2]/90 hover:to-[#2563EB]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-slide-in-right disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{animationDelay: '0.7s'}}
          >
            <span className="inline-flex items-center">
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && (
                <svg className="ml-2 w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </span>
          </button>
          
          {/* Test Button with your working credentials */}
        
        </form>
      </div>

      {/* Right Side - Background with Overlay */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src="/truckmaleva.jpg"
          alt="Shipping Truck"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/80 via-[#2563EB]/70 to-[#14B8A6]/60 animate-gradient-shift"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-white/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-white/20 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-white/40 rounded-full animate-float-fast"></div>

        {/* Text */}
        <div className="relative z-10 text-center px-10 animate-fade-in-right">
          <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-4 tracking-wide drop-shadow-lg animate-text-glow">
           SHIP SPARE IN  TRANSIT
          </h2>
          <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-md animate-slide-up-delay-2">
            Powered by Maleva
          </p>
          <div className="mt-8 flex justify-center space-x-3">
            <div className="w-4 h-4 bg-white/80 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-4 h-4 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
          
          {/* Progress Bar Animation */}
          <div className="mt-8 w-64 mx-auto">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full animate-progress-bar"></div>
            </div>
            <p className="text-white/70 text-sm mt-2 animate-pulse">Loading your logistics experience...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
