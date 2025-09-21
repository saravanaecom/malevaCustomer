// Console commands for viewing logs
import { logger } from './logger.js';
import { devAccess } from './devAccess.js';

// Add global functions to window for console access
window.viewLogs = (date = null) => {
  if (!devAccess.canAccessLogs()) {
    console.error('❌ Developer access required. Use devLogin("username", "password") first.');
    return [];
  }
  const logs = logger.getLogsForDate(date);
  console.table(logs);
  return logs;
};

window.viewErrorLogs = (date = null) => {
  if (!devAccess.canAccessLogs()) {
    console.error('❌ Developer access required. Use devLogin("username", "password") first.');
    return [];
  }
  const logs = logger.getLogsForDate(date);
  const errorLogs = logs.filter(log => log.type === 'ERROR');
  console.table(errorLogs);
  return errorLogs;
};

window.viewApiLogs = (date = null) => {
  const logs = logger.getLogsForDate(date);
  const apiLogs = logs.filter(log => log.type === 'API_CALL');
  console.table(apiLogs);
  return apiLogs;
};

window.exportAllLogs = (days = 7) => {
  if (!devAccess.canAccessLogs()) {
    console.error('❌ Developer access required. Use devLogin("username", "password") first.');
    return [];
  }
  const logs = logger.exportLogs(days);
  console.log('All logs:', logs);
  return logs;
};

window.clearTodayLogs = () => {
  const date = logger.getCurrentDate();
  localStorage.removeItem(`maleva_logs_${date}`);
  console.log('Today\'s logs cleared');
};

// Developer login function
window.devLogin = (username, password) => {
  if (devAccess.devLogin(username, password)) {
    console.log('✅ Developer access granted!');
    console.log('📋 Log Console Commands Available:');
    console.log('viewLogs() - View today\'s logs');
    console.log('viewLogs("2025-01-20") - View logs for specific date');
    console.log('viewErrorLogs() - View only error logs');
    console.log('viewApiLogs() - View only API call logs');
    console.log('exportAllLogs(7) - Export last 7 days of logs');
    console.log('clearTodayLogs() - Clear today\'s logs');
    return true;
  } else {
    console.error('❌ Invalid developer credentials');
    return false;
  }
};

console.log('🔒 Developer Mode Required for Logs');
console.log('Use: devLogin("dev_admin", "maleva_dev_2025") to access logs');