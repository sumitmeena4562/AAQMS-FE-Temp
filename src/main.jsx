import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from './lib/queryClient.js'
import './index.css'
import App from './App.jsx'

// Keep Neon DB alive — ping every 4 minutes to prevent cold start
const API_BASE = import.meta.env.PROD ? '/api/' : (import.meta.env.VITE_API_URL || '/api/');
setInterval(() => {
  // Always use the relative /ping/ if in production (handled by Vercel proxy)
  const pingUrl = import.meta.env.PROD ? '/ping/' : `${API_BASE.replace(/\/api\/?$/, '')}/ping/`;
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
