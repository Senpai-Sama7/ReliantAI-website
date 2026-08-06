import { useEffect, useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { flushVisibleReveals } from '@/lib/reveal';

const LAYOUT_SETTLE_MS = 450;

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

  useLayoutEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    if (!introComplete) return;

    let disposed = false;
    let cleanup: (() => void) | void;

    const timer = window.setTimeout(() => {
      if (disposed) return;
      cleanup = setupRef.current();
      // Single deferred refresh — the double refresh causes a layout
      // flash during the intro→content transition.
      window.requestAnimationFrame(() => {
        if (disposed) return;
        ScrollTrigger.refresh();
        flushVisibleReveals();
      });
    }, LAYOUT_SETTLE_MS);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introComplete, ...deps]);
}

export const INTRO_LAYOUT_SETTLE_MS = LAYOUT_SETTLE_MS;
