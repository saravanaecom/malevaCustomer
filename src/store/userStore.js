// User Store - Centralized user data management
class UserStore {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.listeners = [];
  }

  // Set user data after successful login
  setUser(userData) {
    this.user = {
      customerId: userData.customerId || userData.CustomerId,
      companyId: userData.companyId || userData.CompanyId,
      userId: userData.userId || userData.UserId,
      username: userData.username || userData.Username,
      email: userData.email || userData.Email,
      name: userData.name || userData.Name,
      ...userData
    };
    this.isAuthenticated = true;
    
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(this.user));
    localStorage.setItem('isAuthenticated', 'true');
    
    // Notify listeners
    this.notifyListeners();
  }

  // Get user data
  getUser() {
    if (!this.user) {
      // Try to load from localStorage
      const storedUser = localStorage.getItem('user');
      const storedAuth = localStorage.getItem('isAuthenticated');
      
      if (storedUser && storedAuth === 'true') {
        this.user = JSON.parse(storedUser);
        this.isAuthenticated = true;
      }
    }
    return this.user;
  }

  // Get specific user properties
  getCustomerId() {
    const user = this.getUser();
    return user?.customerId || null;
  }

  getCompanyId() {
    const user = this.getUser();
    return user?.companyId || null;
  }

  getUserId() {
    const user = this.getUser();
    return user?.userId || null;
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    this.getUser(); // Ensure data is loaded
    return this.isAuthenticated;
  }

  // Clear user data (logout)
  clearUser() {
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    this.notifyListeners();
  }

  // Subscribe to user changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.user, this.isAuthenticated));
  }
}

// Create singleton instance
export const userStore = new UserStore();
export default userStore;