import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import Providers from './app/providers'
import { useAuth } from './hooks/useAuth'

// Import styles
import './styles/globals.css'
import './styles/animations.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

function App() {
  // Sync Firebase auth state → Redux
  useAuth()
  return <RouterProvider router={router} />
}

const rootElement = document.getElementById('root')
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>
  )
}
