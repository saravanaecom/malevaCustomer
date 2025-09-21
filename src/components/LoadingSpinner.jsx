import { Loader2, Package } from "lucide-react";

export default function LoadingSpinner({ 
  size = "large", 
  message = "Loading...", 
  subMessage = "Please wait", 
  type = "orders" 
}) {
  const getIcon = () => {
    switch (type) {
      case "orders":
        return <Package className="w-8 h-8 text-blue-600 mb-2" />;
      default:
        return <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "py-4";
      case "medium":
        return "py-8";
      case "large":
      default:
        return "py-12";
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${getSizeClasses()} bg-white rounded-xl`}>
      {/* Animated Spinner */}
      <div className="relative mb-4">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {getIcon()}
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">{message}</p>
        <p className="text-sm text-gray-500 mt-1">{subMessage}</p>
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );
}