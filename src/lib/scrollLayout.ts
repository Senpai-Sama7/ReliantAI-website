import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { flushVisibleReveals } from '@/lib/reveal';

export const SCROLL_LAYOUT_READY = 'scroll:layout-ready';

let layoutReady = false;
const queue: Array<() => void> = [];

/** Fired after intro + pinned scroll-story sections have mounted and measured. */
export function markScrollLayoutReady(): void {
  if (layoutReady) return;
  layoutReady = true;
  window.dispatchEvent(new CustomEvent(SCROLL_LAYOUT_READY));
  queue.splice(0).forEach((fn) => fn());
  ScrollTrigger.refresh();
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    flushVisibleReveals();
  });
}

export function isScrollLayoutReady(): boolean {
  return layoutReady;
}

export function onScrollLayoutReady(fn: () => void): () => void {
  if (layoutReady) {
    fn();
    return () => {};
  }
  queue.push(fn);
  const handler = () => fn();
  window.addEventListener(SCROLL_LAYOUT_READY, handler);
  return () => {
    window.removeEventListener(SCROLL_LAYOUT_READY, handler);
    const idx = queue.indexOf(fn);
    if (idx >= 0) queue.splice(idx, 1);
  };
}

export function resetScrollLayoutReady(): void {
  layoutReady = false;
}
