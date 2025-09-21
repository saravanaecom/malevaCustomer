// Developer access control
const DEV_CREDENTIALS = {
  username: 'dev_admin',
  password: 'maleva_dev_2025'
};

class DevAccess {
  constructor() {
    this.isDevMode = false;
  }

  // Check if user is in developer mode
  isDeveloper() {
    return this.isDevMode || localStorage.getItem('dev_access') === 'true';
  }

  // Developer login
  devLogin(username, password) {
    if (username === DEV_CREDENTIALS.username && password === DEV_CREDENTIALS.password) {
      this.isDevMode = true;
      localStorage.setItem('dev_access', 'true');
      return true;
    }
    return false;
  }

  // Developer logout
  devLogout() {
    this.isDevMode = false;
    localStorage.removeItem('dev_access');
  }

  // Check if current environment allows dev access
  canAccessLogs() {
    // Only allow with dev credentials
    return this.isDeveloper();
  }
}

export const devAccess = new DevAccess();
export default devAccess;