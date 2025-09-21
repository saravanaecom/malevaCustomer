import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { logger } from './utils/logger.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './utils/logConsole.js'

// Cleanup old logs on app start
logger.cleanupOldLogs();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
