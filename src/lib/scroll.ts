import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { getLenisInstance } from '@/lib/lenis';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollToPlugin);

/** Smooth scroll to a section id (Lenis when active, otherwise GSAP ScrollToPlugin). */
export function scrollToSection(sectionId: string, offsetY = 80): void {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const lenis = getLenisInstance();

  if (prefersReducedMotion()) {
    if (lenis) {
      lenis.scrollTo(el, { offset: -offsetY, immediate: true });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - offsetY;
      window.scrollTo({ top, behavior: 'auto' });
    }
    return;
  }

  if (lenis) {
    lenis.scrollTo(el, { offset: -offsetY, duration: 1.2 });
    return;
  }

  gsap.to(window, {
    duration: 1.2,
    scrollTo: { y: el, offsetY },
    ease: 'power3.inOut',
  });
}
