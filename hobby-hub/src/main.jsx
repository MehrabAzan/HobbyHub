import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ApplyTheme, LoadSettings } from './lib/settings'
import App from './App.jsx'

ApplyTheme(LoadSettings().theme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
