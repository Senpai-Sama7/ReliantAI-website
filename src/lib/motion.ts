/** Shared motion / viewport helpers for GSAP sections. */

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Width-based mobile check. Deliberately ignores touch capability so that
 * touch-enabled laptops/desktops still get the full desktop experience.
 */
export function isMobileViewport(breakpoint = 1024): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoint;
}

export function onMotionPreferenceChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = () => callback();
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
