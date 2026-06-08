import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMobileViewport, prefersReducedMotion } from '@/lib/motion';
import { telegraphScrollStory } from '@/lib/telemetry';
import { safeGsapContext } from '@/lib/recovery';
import { onScrollLayoutReady } from '@/lib/scrollLayout';

gsap.registerPlugin(ScrollTrigger);

export type HandoffKind = 'transit-to-proof' | 'proof-to-capabilities' | 'capabilities-to-signal';

interface SectorHandoffProps {
  id: string;
  kind: HandoffKind;
  fromSector: string;
  toSector: string;
  fromLabel: string;
  toLabel: string;
  tagline: string;
}

const HANDOFF_COPY: Record<HandoffKind, { verb: string; detail: string }> = {
  'transit-to-proof': {
    verb: 'DECOMPRESS',
    detail: 'Corridor resolves into documented outcomes',
  },
  'proof-to-capabilities': {
    verb: 'MANIFEST',
    detail: 'Evidence crystallizes into build systems',
  },
  'capabilities-to-signal': {
    verb: 'AMPLIFY',
    detail: 'Capabilities resonate through client outcomes',
  },
};

export default function SectorHandoff({
  id,
  kind,
  fromSector,
  toSector,
  fromLabel,
  toLabel,
  tagline,
}: SectorHandoffProps) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const copy = HANDOFF_COPY[kind];

  useEffect(() => {
    let disposed = false;
    let ctx: ReturnType<typeof safeGsapContext> | null = null;

    const setup = () => {
      if (disposed) return;
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
      ctx?.revert();

      const root = rootRef.current;
      const pin = pinRef.current;
      if (!root || !pin) return;

      const reduced = prefersReducedMotion();
      const mobile = isMobileViewport();

      ctx = safeGsapContext(
      root,
      () => {
        if (reduced) {
          telegraphScrollStory(`handoff:${kind}`, 'static-fallback');
          return;
        }

        gsap.set([titleRef.current, lineRef.current, gridRef.current], {
          opacity: 0,
          y: 40,
        });

        const st = ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: () => `+=${window.innerHeight * (mobile ? 0.75 : 1)}`,
          pin,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => telegraphScrollStory(`handoff:${kind}`, 'enter', { fromSector, toSector }),
          onUpdate: (self) => {
            const p = self.progress;
            const title = titleRef.current;
            const line = lineRef.current;
            const grid = gridRef.current;

            if (title) {
              gsap.set(title, {
                opacity: p < 0.15 ? p / 0.15 : p > 0.85 ? (1 - p) / 0.15 : 1,
                y: 60 - p * 60,
                scale: 0.92 + p * 0.08,
                filter: `blur(${Math.abs(p - 0.5) * 6}px)`,
              });
            }
            if (line) {
              gsap.set(line, {
                opacity: Math.min(1, p * 2),
                scaleX: p,
              });
            }
            if (grid) {
              const cells = grid.querySelectorAll<HTMLElement>('.handoff-cell');
              cells.forEach((cell, i) => {
                const cellP = gsap.utils.clamp(0, 1, (p - 0.25 - i * 0.08) / 0.45);
                gsap.set(cell, {
                  opacity: cellP,
                  y: (1 - cellP) * 32,
                  rotateX: (1 - cellP) * (kind === 'proof-to-capabilities' ? -18 : 14),
                  transformPerspective: 900,
                });
              });
            }
          },
          onLeave: () => telegraphScrollStory(`handoff:${kind}`, 'complete'),
        });
        triggersRef.current.push(st);
      },
      `handoff:${kind}`
      );
    };

    const unsub = onScrollLayoutReady(setup);

    return () => {
      disposed = true;
      unsub();
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
      ctx?.revert();
    };
  }, [kind, fromSector, toSector]);

  return (
    <section
      id={id}
      ref={rootRef}
      className="sector-handoff relative bg-[#030303] text-white overflow-hidden"
      aria-label={`Sector transition from ${fromLabel} to ${toLabel}`}
      aria-roledescription="scroll story interlude"
    >
      <div ref={pinRef} className="relative h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(255,110,0,0.12),transparent)]" />
          {kind === 'transit-to-proof' && (
            <div className="handoff-tunnel absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_48px,rgba(255,110,0,0.15)_48px,rgba(255,110,0,0.15)_49px)]" />
          )}
          {kind === 'proof-to-capabilities' && (
            <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,110,0,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,110,0,0.5)_1px,transparent_1px)] bg-[size:48px_48px]" />
          )}
          {kind === 'capabilities-to-signal' && (
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_50%_50%,rgba(255,110,0,0.15),transparent_55%)]" />
          )}
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center">
          <p className="font-opensans text-[10px] uppercase tracking-[0.55em] text-white/40 mb-6">
            {fromSector} {fromLabel} → {toSector} {toLabel}
          </p>

          <h2
            ref={titleRef}
            className="font-teko text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] mb-4"
          >
            <span className="text-orange">{copy.verb}</span>
            <span className="block text-white/90 text-3xl sm:text-4xl lg:text-5xl mt-3 font-light tracking-wide">
              {toLabel}
            </span>
          </h2>

          <p className="font-opensans text-sm text-white/45 tracking-[0.2em] uppercase mb-10">
            {tagline}
          </p>

          <div
            ref={lineRef}
            className="mx-auto h-px w-full max-w-md bg-gradient-to-r from-transparent via-orange to-transparent origin-center mb-12"
          />

          <p className="font-opensans text-xs text-white/35 mb-8">{copy.detail}</p>

          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
            aria-hidden="true"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="handoff-cell h-16 sm:h-20 rounded-lg border border-orange/20 bg-orange/[0.06] backdrop-blur-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
