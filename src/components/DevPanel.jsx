// Developer Panel for easy log access
import { useState } from 'react';
import { logger } from '../utils/logger.js';

const DevPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('ALL');

  const loadLogs = () => {
    const todayLogs = logger.getLogsForDate();
    const filteredLogs = filter === 'ALL' ? todayLogs : todayLogs.filter(log => log.type === filter);
    setLogs(filteredLogs.reverse().slice(0, 20)); // Show last 20 logs
  };

  const clearLogs = () => {
    const date = logger.getCurrentDate();
    localStorage.removeItem(`maleva_logs_${date}`);
    setLogs([]);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            setIsOpen(true);
            loadLogs();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
        >
          🔧 Dev Logs
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Developer Logs</span>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-black px-2 py-1 rounded text-xs"
          >
            <option value="ALL">All</option>
            <option value="ERROR">Errors</option>
            <option value="API_CALL">API Calls</option>
            <option value="USER_ACTION">User Actions</option>
          </select>
          <button
            onClick={loadLogs}
            className="bg-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
            onClick={clearLogs}
            className="bg-red-600 px-2 py-1 rounded text-xs hover:bg-red-700"
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="h-80 overflow-y-auto p-2 text-xs">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No logs found</p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded border-l-4 ${
                log.type === 'ERROR' ? 'border-red-500 bg-red-50' :
                log.type === 'API_CALL' ? 'border-blue-500 bg-blue-50' :
                'border-green-500 bg-green-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-semibold ${
                  log.type === 'ERROR' ? 'text-red-700' :
                  log.type === 'API_CALL' ? 'text-blue-700' :
                  'text-green-700'
                }`}>
                  {log.type}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="mt-1">
                <div className="font-medium text-gray-800">
                  {log.method} {log.url}
                </div>
                <div className="text-gray-600">
                  {log.message}
                </div>
                {log.status && (
                  <div className="text-gray-500">
                    Status: {log.status} {log.responseTime && `(${log.responseTime})`}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DevPanel;