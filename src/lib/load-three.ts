// Once the vendor-three chunk has been injected, this flag short-circuits
// repeat callers. Declared on `Window` so the rest of the file can use the
// typed accessor without `any` casts.
declare global {
  interface Window {
    __threeVendorLoaded?: boolean;
  }
}

/**
 * Lazy-inject the `vendor-three` chunk produced by Vite's manual chunks
 * configuration in `vite.config.ts`). The chunk URL is hard-coded below
 * because the alternative — resolving it from Vite's manifest at runtime —
 * adds significant complexity for a small marketing site. **If the build
 * hash in this URL drifts, the helper will silently no-op** (the chunk will
 * still be served by the normal dynamic-import path used elsewhere). Bump
 * the hash here after every Vite build that changes the chunk filename, or
 * extract it from `dist/assets/` and update.
 *
 * TODO: replace the hard-coded URL with a build-time `?url` import so the
 * hash is always correct.
 *
 * Safe to call multiple times — repeat calls return immediately if the
 * script is already loaded or in flight.
 */
const VENDOR_THREE_URL = '/assets/vendor-three-Cppjh5mf.js';

export function loadVendorThree(url: string = VENDOR_THREE_URL): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.__threeVendorLoaded) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    try {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${url}"]`
      );
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          window.__threeVendorLoaded = true;
          resolve();
          return;
        }
        existing.addEventListener(
          'load',
          () => {
            window.__threeVendorLoaded = true;
            window.dispatchEvent(new Event('threejs-loaded'));
            resolve();
          },
          { once: true }
        );
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      const s = document.createElement('script');
      s.src = url;
      s.defer = true;
      s.dataset.loaded = 'false';
      s.addEventListener(
        'load',
        () => {
          s.dataset.loaded = 'true';
          window.__threeVendorLoaded = true;
          window.dispatchEvent(new Event('threejs-loaded'));
          resolve();
        },
        { once: true }
      );
      s.addEventListener('error', reject, { once: true });
      document.body.appendChild(s);
    } catch (err) {
      reject(err);
    }
  });
}
