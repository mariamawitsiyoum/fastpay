import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
//<QueryClientProvider client={queryClient}> — makes React Query available to everything inside it
//<BrowserRouter> — enables React Router; it watches the browser's URL and lets us render different pages based on it (we'll define which pages in the next steps)
//<AuthProvider> — our own context from before, giving every component access to agent/setAgent