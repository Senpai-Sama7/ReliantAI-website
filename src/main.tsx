import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { wireGlobalConsentHandlers } from './lib/consent'
import { exposeTelemetryDebug, installGlobalTelemetry } from './lib/telemetry'
import { installRecoveryHooks } from './lib/recovery'

wireGlobalConsentHandlers()
installGlobalTelemetry()
exposeTelemetryDebug()
installRecoveryHooks()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
