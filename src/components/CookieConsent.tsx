import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  denyAnalyticsConsent,
  grantAnalyticsConsent,
  hasConsentChoice,
} from '@/lib/consent';
import { prefersReducedMotion } from '@/lib/motion';

interface CookieConsentProps {
  /** Wait until intro overlay finishes so the bar does not compete with it. */
  ready?: boolean;
}

export default function CookieConsent({ ready = true }: CookieConsentProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(() => hasConsentChoice());
  const visible = ready && !dismissed;

  useEffect(() => {
    if (!visible || !barRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.15 }
      );
    }, barRef);

    return () => ctx.revert();
  }, [visible]);

  const dismiss = (choice: 'accept' | 'decline') => {
    if (choice === 'accept') {
      grantAnalyticsConsent();
    } else {
      denyAnalyticsConsent();
    }

    const bar = barRef.current;
    if (!bar || prefersReducedMotion()) {
      setDismissed(true);
      return;
    }

    gsap.to(bar, {
      y: 20,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => setDismissed(true),
    });
  };

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      role="dialog"
      aria-label="Cookie consent"
      className="cookie-consent fixed inset-x-0 bottom-0 z-[10050] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:px-6 sm:pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pointer-events-auto"
    >
      <div className="mx-auto max-w-5xl glass-dark border border-white/10 rounded-xl px-5 py-4 sm:px-6 sm:py-5 shadow-2xl shadow-black/40 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <p className="font-opensans text-sm text-white/80 leading-relaxed flex-1">
          We use cookies for analytics to improve your experience.{' '}
          <a
            href="/privacy-policy"
            className="text-orange underline underline-offset-2 hover:text-orange/80 transition-colors"
          >
            Privacy Policy
          </a>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => dismiss('decline')}
            className="font-opensans text-sm px-5 py-2.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => dismiss('accept')}
            className="font-opensans text-sm font-semibold px-5 py-2.5 rounded-lg bg-orange text-white hover:bg-orange/90 transition-colors shadow-lg shadow-orange/20"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
