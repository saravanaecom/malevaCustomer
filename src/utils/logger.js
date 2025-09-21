// Logging utility for tracking errors and activities
class Logger {
  constructor() {
    this.logs = [];
  }

  // Get current date for log file naming
  getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  // Get current timestamp
  getCurrentTimestamp() {
    return new Date().toISOString();
  }

  // Log error with details
  logError(error, context = '', action = '') {
    const logEntry = {
      timestamp: this.getCurrentTimestamp(),
      type: 'ERROR',
      context,
      action,
      message: error.message,
      status: error.response?.status || 0,
      url: error.config?.url || '',
      method: error.config?.method?.toUpperCase() || '',
      data: error.response?.data || null,
      stack: error.stack
    };

    this.logs.push(logEntry);
    this.saveToStorage(logEntry);
    
    // Also log to console for development
    console.error(`[${logEntry.timestamp}] ${context} - ${action}:`, error);
  }

  // Log API calls
  logApiCall(method, url, status, responseTime = 0) {
    const logEntry = {
      timestamp: this.getCurrentTimestamp(),
      type: 'API_CALL',
      method: method.toUpperCase(),
      url,
      status,
      responseTime: `${responseTime}ms`
    };

    this.logs.push(logEntry);
    this.saveToStorage(logEntry);
  }

  // Log user actions
  logUserAction(action, details = {}) {
    const logEntry = {
      timestamp: this.getCurrentTimestamp(),
      type: 'USER_ACTION',
      action,
      details
    };

    this.logs.push(logEntry);
    this.saveToStorage(logEntry);
  }

  // Save log to localStorage (day-wise)
  saveToStorage(logEntry) {
    const date = this.getCurrentDate();
    const storageKey = `maleva_logs_${date}`;
    
    try {
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingLogs.push(logEntry);
      
      // Keep only last 100 entries per day to avoid storage overflow
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Failed to save log to storage:', error);
    }
  }

  // Get logs for a specific date
  getLogsForDate(date = null) {
    const targetDate = date || this.getCurrentDate();
    const storageKey = `maleva_logs_${targetDate}`;
    
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (error) {
      console.error('Failed to retrieve logs:', error);
      return [];
    }
  }

  // Clear old logs (keep only last 7 days)
  cleanupOldLogs() {
    const today = new Date();
    
    for (let i = 8; i <= 30; i++) {
      const oldDate = new Date(today);
      oldDate.setDate(today.getDate() - i);
      const dateStr = oldDate.toISOString().split('T')[0];
      const storageKey = `maleva_logs_${dateStr}`;
      localStorage.removeItem(storageKey);
    }
  }

  // Export logs for debugging
  exportLogs(days = 7) {
    const allLogs = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const logs = this.getLogsForDate(dateStr);
      allLogs.push(...logs);
    }
    
    return allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
}

// Create singleton instance
export const logger = new Logger();
export default logger;