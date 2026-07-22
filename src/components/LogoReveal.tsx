import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/motion';

const FULL_TEXT = 'RELIANT AI';

/** Types the wordmark once, then settles into the Bold Industrial lockup. */
const LogoReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [reducedMotion] = useState(() => prefersReducedMotion());
  const [displayText, setDisplayText] = useState(() =>
    prefersReducedMotion() ? FULL_TEXT : ''
  );
  const [settled, setSettled] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (reducedMotion) {
      if (lineRef.current) {
        lineRef.current.style.opacity = '1';
        lineRef.current.style.transform = 'scaleX(1)';
      }
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    let currentIndex = 0;
    let active = true;

    const typeEffect = () => {
      if (!active) return;
      if (currentIndex < FULL_TEXT.length) {
        setDisplayText(FULL_TEXT.slice(0, currentIndex + 1));
        currentIndex++;
        timeout = setTimeout(typeEffect, 150);
      } else {
        // Finished typing — hold briefly, then retire the cursor.
        timeout = setTimeout(() => {
          if (!active) return;
          setSettled(true);
        }, 1200);
      }
    };

    timeout = setTimeout(typeEffect, 400);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power3.inOut', delay: 0.35 }
      );

      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
      });
    }, containerRef);

    return () => {
      active = false;
      clearTimeout(timeout);
      ctx.revert();
    };
  }, [reducedMotion]);

  const reliantPart = displayText.slice(0, 7);
  const aiPart = displayText.slice(7);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Logo Container - explicit height to prevent CLS */}
      <div
        ref={containerRef}
        className="relative inline-block max-w-full h-[80px] sm:h-[120px] md:h-[150px] lg:h-[180px]"
      >
        <div className="relative flex items-center justify-center h-full">
          <span
            className="font-teko font-bold uppercase text-5xl sm:text-7xl md:text-8xl lg:text-[10rem]"
            style={{ letterSpacing: '-0.03em', lineHeight: 0.85 }}
          >
            {reliantPart && (
              <span className="text-gray-900 dark:text-white">{reliantPart}</span>
            )}
            {aiPart && <span className="text-orange">{aiPart}</span>}
          </span>
          {/* Blinking cursor — retired once typing settles */}
          {!reducedMotion && !settled && (
            <span
              ref={cursorRef}
              className="text-orange text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-normal ml-1"
              style={{ lineHeight: 0.85 }}
            >
              |
            </span>
          )}
        </div>

        {/* Animated underline */}
        <div
          ref={lineRef}
          className="absolute -bottom-2 left-0 right-0 h-[3px] origin-left"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #ff6e00 20%, #ff6e00 80%, transparent 100%)',
            opacity: 0,
          }}
        />
      </div>

      {/* Static subtitle underneath */}
      <div className="flex items-center gap-3 opacity-70">
        <div className="h-px w-8 bg-orange/50" />
        <span className="font-opensans text-xs sm:text-sm uppercase tracking-[0.25em] text-gray-500 dark:text-white/50">
          Houston Web Design Studio
        </span>
        <div className="h-px w-8 bg-orange/50" />
      </div>
    </div>
  );
};

export default LogoReveal;
