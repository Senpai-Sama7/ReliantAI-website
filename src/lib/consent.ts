declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    grantConsent?: () => void;
    denyConsent?: () => void;
  }
}

function consentCookieSuffix(): string {
  return window.location.protocol === 'https:' ? ';Secure' : '';
}

export function hasConsentChoice(): boolean {
  return document.cookie.split(';').some((c) => c.trim().startsWith('consent='));
}

export function grantAnalyticsConsent(): void {
  window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
  document.cookie = `consent=1;path=/;max-age=31536000;SameSite=Lax${consentCookieSuffix()}`;
}

export function denyAnalyticsConsent(): void {
  document.cookie = `consent=0;path=/;max-age=31536000;SameSite=Lax${consentCookieSuffix()}`;
}

export function wireGlobalConsentHandlers(): void {
  window.grantConsent = grantAnalyticsConsent;
  window.denyConsent = denyAnalyticsConsent;
}
