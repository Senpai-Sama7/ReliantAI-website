import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

export interface RevealOptions {
  y?: number;
  x?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  once?: boolean;
}

const defaults: Required<Pick<RevealOptions, 'y' | 'duration' | 'stagger' | 'ease' | 'start' | 'once'>> = {
  y: 40,
  duration: 0.8,
  stagger: 0.1,
  ease: 'power3.out',
  start: 'top 85%',
  once: true,
};

function resolveTargets(trigger: Element, targets: gsap.TweenTarget): gsap.TweenTarget {
  if (typeof targets === 'string') {
    return trigger.querySelectorAll(targets);
  }
  return targets;
}

/** Scroll-linked reveal that survives pin-spacer layout shifts. */
export function revealFrom(
  trigger: Element | null,
  targets: gsap.TweenTarget,
  options: RevealOptions = {}
): ScrollTrigger | null {
  if (!trigger || !targets) return null;

  const resolved = resolveTargets(trigger, targets);
  if (resolved instanceof NodeList && resolved.length === 0) return null;

  const opts = { ...defaults, ...options };

  if (prefersReducedMotion()) {
    gsap.set(resolved, { opacity: 1, y: 0, x: 0, clearProps: 'transform' });
    return null;
  }

  const tween = gsap.from(resolved, {
    y: opts.y,
    x: options.x ?? 0,
    opacity: 0,
    duration: opts.duration,
    stagger: opts.stagger,
    ease: opts.ease,
    immediateRender: false,
    scrollTrigger: {
      trigger,
      start: opts.start,
      toggleActions: opts.once ? 'play none none none' : 'play none none reverse',
      invalidateOnRefresh: true,
    },
  });

  const st = tween.scrollTrigger ?? null;
  if (st?.isActive) {
    gsap.set(resolved, { opacity: 1, y: 0, x: 0, clearProps: 'transform' });
  }

  return st;
}

/** After pin spacers settle, play any reveal tweens already in the viewport. */
export function flushVisibleReveals(): void {
  ScrollTrigger.getAll().forEach((st) => {
    if (!st.isActive) return;
    const animation = st.animation as gsap.core.Animation | undefined;
    if (animation && animation.progress() === 0) {
      animation.progress(1);
    }
  });
}
