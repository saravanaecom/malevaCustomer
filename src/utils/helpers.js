// Utility helper functions
export const formatCurrency = (amount, currency = 'RM') => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency === 'RM' ? 'MYR' : currency,
  }).format(amount);
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
};

export const getStatusColor = (status) => {
  const statusColors = {
    // Shipment statuses
    'pending': 'bg-yellow-500',
    'in_transit': 'bg-blue-500',
    'delivered': 'bg-green-500',
    'cancelled': 'bg-red-500',
    
    // Invoice statuses
    'draft': 'bg-gray-500',
    'sent': 'bg-blue-500',
    'paid': 'bg-green-500',
    'overdue': 'bg-red-500',
    
    // Order statuses
    'confirmed': 'bg-blue-500',
    'processing': 'bg-yellow-500',
    'shipped': 'bg-purple-500',
  };
  
  return statusColors[status.toLowerCase()] || 'bg-gray-500';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export default {
  formatCurrency,
  formatDate,
  getStatusColor,
  debounce,
  generateId,
};