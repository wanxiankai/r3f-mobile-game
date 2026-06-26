import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import '@/styles/reset.css'
import '@/styles/global.css'

// Mobile console for on-device debugging (DEV only).
if (import.meta.env.DEV) {
  import('eruda').then(({ default: eruda }) => eruda.init())
}

const container = document.getElementById('root')
if (!container) throw new Error('Root container #root not found')

createRoot(container).render(
  // Production disables StrictMode to avoid R3F double-mount / double-render.
  import.meta.env.DEV ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  )
)
