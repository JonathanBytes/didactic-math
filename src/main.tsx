import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import appPackage from '../package.json' with { type: 'json' }
import './index.css'
import App from './App.tsx'

const buildVersion =
  (appPackage?.version && typeof appPackage.version === 'string' && appPackage.version.trim()) ||
  (import.meta.env?.VITE_APP_VERSION as string | undefined)?.trim() ||
  new Date().toISOString()

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL('/sw.js', window.location.origin)
    swUrl.searchParams.set('version', buildVersion)

    navigator.serviceWorker
      .register(swUrl.toString())
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
