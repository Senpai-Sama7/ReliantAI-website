import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import { wireGlobalConsentHandlers } from './lib/consent'
import { exposeTelemetryDebug, installGlobalTelemetry } from './lib/telemetry'
import { installRecoveryHooks } from './lib/recovery'

wireGlobalConsentHandlers()
installGlobalTelemetry()
exposeTelemetryDebug()
installRecoveryHooks()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackLabel="The app recovered safely. Reload if the page still looks wrong.">
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
