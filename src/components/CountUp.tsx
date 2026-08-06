import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  end: number | string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

function formatValue(val: number, decimals: number): string {
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
}

const CountUp = ({
  end,
  prefix = '',
  suffix = '',
  duration = 2,
  className = '',
  decimals = 0,
}: CountUpProps) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  const { numericValue, displayPrefix, displaySuffix } = useMemo(() => {
    let numericValue = 0;
    let displaySuffix = suffix;
    let displayPrefix = prefix;

    if (typeof end === 'string') {
      const match = end.match(/[-+]?[\d.]+/);
      if (match) numericValue = parseFloat(match[0]);
      if (end.startsWith('+')) displayPrefix = '+';
      else if (end.startsWith('-')) displayPrefix = '-';
      else if (end.startsWith('$')) displayPrefix = '$';

      const suffixMatch = end.match(/[^-+\d.\s]+$/);
      if (suffixMatch && !suffix) displaySuffix = suffixMatch[0];
    } else {
      numericValue = end;
    }

    return { numericValue, displayPrefix, displaySuffix };
  }, [end, prefix, suffix]);

  const initialText = `${displayPrefix}${formatValue(0, decimals)}${displaySuffix}`;
  const finalText = `${displayPrefix}${formatValue(numericValue, decimals)}${displaySuffix}`;

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimatedRef.current) return;

    if (prefersReducedMotion()) {
      element.textContent = finalText;
      hasAnimatedRef.current = true;
      return;
    }

    // Avoid forced reflow: no getBoundingClientRect / offsetWidth here.
    // Use content-visibility style to reserve space via ch units instead.
    element.style.display = 'inline-block';
    // Estimate min width to reduce CLS without measuring layout.
    // 1ch ≈ width of "0", so reserve based on final string length.
    element.style.minWidth = `${Math.max(2, finalText.length * 0.58)}ch`;

    const obj = { value: 0 };

    const onEnter = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      // Direct DOM update — avoids React setState per frame (main-thread / TBT killer)
      gsap.to(obj, {
        value: numericValue,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          if (!elementRef.current) return;
          elementRef.current.textContent = `${displayPrefix}${formatValue(
            obj.value,
            decimals
          )}${displaySuffix}`;
        },
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 95%',
      once: true,
      onEnter,
    });

    return () => {
      try {
        trigger.kill();
      } catch {
        // safe to ignore teardown races
      }
    };
  }, [numericValue, displayPrefix, displaySuffix, duration, decimals, finalText]);

  return (
    <span ref={elementRef} className={className} aria-hidden="false">
      {initialText}
    </span>
  );
};

export default CountUp;
