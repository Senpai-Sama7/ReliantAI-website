import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/** Smooth scroll to a section id (GSAP + ScrollToPlugin, Lenis-compatible). */
export function scrollToSection(sectionId: string, offsetY = 80): void {
  const el = document.getElementById(sectionId);
  if (!el) return;

  gsap.to(window, {
    duration: 1.2,
    scrollTo: { y: el, offsetY },
    ease: 'power3.inOut',
  });
}
