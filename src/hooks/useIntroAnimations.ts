import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { flushVisibleReveals } from '@/lib/reveal';

/**
 * Run GSAP setup once the intro overlay has finished and layout is stable.
 * Avoids ScrollTrigger measuring before pin spacers exist.
 */
export function useIntroAnimations(
  introComplete: boolean,
  setup: () => (() => void) | void,
  deps: React.DependencyList = []
): void {
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    if (!introComplete) return;

    let disposed = false;
    let cleanup: (() => void) | void;

    const timer = window.setTimeout(() => {
      if (disposed) return;
      cleanup = setupRef.current();
      ScrollTrigger.refresh();
      flushVisibleReveals();
      window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        flushVisibleReveals();
      });
    }, 450);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introComplete, ...deps]);
}
