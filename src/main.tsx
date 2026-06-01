import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app.tsx'
import './index.css'
import { FileSettingsProvider } from './state/file-settings-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FileSettingsProvider>
      <App />
    </FileSettingsProvider>
  </StrictMode>,
)
