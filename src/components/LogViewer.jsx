// Log Viewer Component
import { useState, useEffect } from 'react';
import { logger } from '../utils/logger.js';
import { devAccess } from '../utils/devAccess.js';

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(logger.getCurrentDate());
  const [filterType, setFilterType] = useState('ALL');
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [devCredentials, setDevCredentials] = useState({ username: '', password: '' });
  const [hasDevAccess, setHasDevAccess] = useState(devAccess.canAccessLogs());

  useEffect(() => {
    loadLogs();
  }, [selectedDate, filterType]);

  const loadLogs = () => {
    let allLogs = logger.getLogsForDate(selectedDate);
    
    if (filterType !== 'ALL') {
      allLogs = allLogs.filter(log => log.type === filterType);
    }
    
    setLogs(allLogs.reverse()); // Show newest first
  };

  const exportLogs = () => {
    const allLogs = logger.exportLogs(7);
    const dataStr = JSON.stringify(allLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maleva_logs_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear today\'s logs?')) {
      localStorage.removeItem(`maleva_logs_${selectedDate}`);
      setLogs([]);
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'ERROR': return 'text-red-600 bg-red-50';
      case 'API_CALL': return 'text-blue-600 bg-blue-50';
      case 'USER_ACTION': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleDevLogin = (e) => {
    e.preventDefault();
    if (devAccess.devLogin(devCredentials.username, devCredentials.password)) {
      setHasDevAccess(true);
      setShowDevLogin(false);
      setDevCredentials({ username: '', password: '' });
    } else {
      alert('Invalid developer credentials');
    }
  };

  // If no dev access, show access denied
  if (!hasDevAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Developer Access Required</h2>
          <p className="text-gray-600 mb-6">This section is restricted to developers only.</p>
          
          {!showDevLogin ? (
            <button
              onClick={() => setShowDevLogin(true)}
              className="w-full bg-[#0A66C2] text-white py-3 rounded-lg font-semibold hover:bg-[#0A66C2]/90 transition-colors"
            >
              Developer Login
            </button>
          ) : (
            <form onSubmit={handleDevLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Developer Username"
                value={devCredentials.username}
                onChange={(e) => setDevCredentials({...devCredentials, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2]"
                required
              />
              <input
                type="password"
                placeholder="Developer Password"
                value={devCredentials.password}
                onChange={(e) => setDevCredentials({...devCredentials, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2]"
                required
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0A66C2] text-white py-3 rounded-lg font-semibold hover:bg-[#0A66C2]/90 transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setShowDevLogin(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#1F2937]">System Logs</h1>
            <div className="flex space-x-4">
              <button
                onClick={exportLogs}
                className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#0A66C2]/90"
              >
                Export Logs
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear Today's Logs
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2]"
              >
                <option value="ALL">All Types</option>
                <option value="ERROR">Errors</option>
                <option value="API_CALL">API Calls</option>
                <option value="USER_ACTION">User Actions</option>
              </select>
            </div>
          </div>

          {/* Log Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {logs.length} logs for {selectedDate}
            </p>
          </div>

          {/* Logs List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No logs found for selected date and type.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getLogColor(log.type)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-white">
                          {log.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        {log.status && (
                          <span className="text-xs text-gray-500">
                            Status: {log.status}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">
                        {log.context && `${log.context} - `}{log.action || log.method} {log.url}
                      </p>
                      <p className="text-sm">{log.message}</p>
                      {log.responseTime && (
                        <p className="text-xs text-gray-500 mt-1">Response Time: {log.responseTime}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}