import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from './lib/queryClient.js'
import './index.css'
import App from './App.jsx'

// Keep Neon DB alive — ping every 4 minutes to prevent cold start
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal ? (import.meta.env.VITE_API_URL || '/api/') : '/api/';

setInterval(() => {
  // Use relative path if not on localhost (leverage Vercel proxy)
  const pingUrl = isLocal ? `${API_BASE.replace(/\/api\/?$/, '')}/ping/` : '/ping/';
  fetch(pingUrl, { credentials: 'include' }).catch(() => {});
}, 4 * 60 * 1000);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
