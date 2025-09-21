// Protected Route Component
import { Navigate } from 'react-router-dom';
import { userStore } from '../store/userStore.js';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = userStore.isUserAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to login with current path for auto-login
    const currentPath = window.location.pathname;
    return <Navigate to={`/login?redirect=${currentPath}`} replace />;
  }
  
  return children;
};

export default ProtectedRoute;