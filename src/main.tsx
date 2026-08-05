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

// Post-load non-critical tasks: enable hero 3D preserve-3d after paint and register a small SW.
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Enable preserve-3d after a short delay so initial layout is stable (reduces CLS).
    try {
      setTimeout(() => {
        const hero = document.querySelector('.hero-section') || document.getElementById('hero');
        if (hero && !hero.classList.contains('loaded')) {
          hero.classList.add('loaded');
        }
      }, 120);
    } catch (e) {
      // ignore
    }

    // Register service worker (best-effort)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.debug('SW registered:', reg.scope);
      }).catch(() => {
        // swallow registration errors
      });
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackLabel="The app recovered safely. Reload if the page still looks wrong.">
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
