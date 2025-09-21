// Custom hook to access user data across components
import { useState, useEffect } from 'react';
import { userStore } from '../store/userStore.js';

export const useUser = () => {
  const [user, setUser] = useState(userStore.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(userStore.isUserAuthenticated());

  useEffect(() => {
    // Subscribe to user store changes
    const unsubscribe = userStore.subscribe((userData, authStatus) => {
      setUser(userData);
      setIsAuthenticated(authStatus);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return {
    user,
    isAuthenticated,
    customerId: user?.customerId,
    companyId: user?.companyId,
    userId: user?.userId,
    username: user?.username,
    email: user?.email,
    name: user?.name,
  };
};

export default useUser;