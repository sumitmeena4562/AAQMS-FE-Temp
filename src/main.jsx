import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import toast from 'react-hot-toast'
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // Global query error handling
      toast.error(`Sync Error: ${error.message || 'Check connection'}`)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // Global mutation error handling
      toast.error(`Action Failed: ${error.message || 'Please try again'}`)
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
