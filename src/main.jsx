import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GLOBAL_UI_SETTINGS } from './config/uiConfig.js'

// Aplicar el escalado general a toda la UI Web (Tailwind rem units reaccionarán a esto instántaneamente)
document.documentElement.style.fontSize = GLOBAL_UI_SETTINGS.BASE_HTML_FONT_SIZE;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
