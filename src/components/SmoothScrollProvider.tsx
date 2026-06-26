import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenisInstance } from '@/lib/lenis';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      setLenisInstance(null);
      return () => setLenisInstance(null);
    }

    const lenis = new Lenis({
      duration: 1.0,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.0,
    });

    setLenisInstance(lenis);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for smooth animation frame updates
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);

    // Disable GSAP's lag smoothing for better sync
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);

    // Initial refresh after a short delay
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      if (motionQuery.matches) {
        gsap.ticker.remove(tickerCallback);
        lenis.destroy();
        setLenisInstance(null);
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      clearTimeout(refreshTimer);
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return <>{children}</>;
}
