import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { telegraphRecovery } from '@/lib/telemetry';

let recoveryScheduled = false;

/** Kill orphaned ScrollTriggers and refresh layout — safe to call repeatedly. */
export function recoverScrollLayout(reason: string): void {
  if (typeof window === 'undefined') return;

  telegraphRecovery('recoverScrollLayout', { reason });

  try {
    ScrollTrigger.refresh(true);
  } catch (err) {
    telegraphRecovery('ScrollTrigger.refresh failed', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export function scheduleScrollRecovery(reason: string, delayMs = 120): void {
  if (recoveryScheduled) return;
  recoveryScheduled = true;
  window.setTimeout(() => {
    recoveryScheduled = false;
    recoverScrollLayout(reason);
  }, delayMs);
}

export function safeGsapContext(
  scope: Element,
  setup: () => void,
  label: string
): gsap.Context {
  try {
    return gsap.context(setup, scope);
  } catch (err) {
    telegraphRecovery('gsap.context setup failed', {
      label,
      error: err instanceof Error ? err.message : String(err),
    });
    scheduleScrollRecovery(`gsap-context:${label}`);
    return gsap.context(() => {}, scope);
  }
}

export function installRecoveryHooks(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('resize', () => {
    scheduleScrollRecovery('resize');
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      scheduleScrollRecovery('visibility-visible', 200);
    }
  });

  telegraphRecovery('recovery hooks installed');
}
