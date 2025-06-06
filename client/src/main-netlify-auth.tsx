import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App-netlify-auth'
import './index.css'

// Configurar para ambiente Netlify
(window as any).__VITE_APP_ENV__ = 'netlify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)