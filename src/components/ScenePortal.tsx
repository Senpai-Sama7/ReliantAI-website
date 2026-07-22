import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portalWorlds } from '@/data/worlds';
import { isMobileViewport, onMotionPreferenceChange, prefersReducedMotion } from '@/lib/motion';
import { useIntroAnimations } from '@/hooks/useIntroAnimations';

gsap.registerPlugin(ScrollTrigger);

interface ScenePortalProps {
  id?: string;
  introComplete?: boolean;
}

export default function ScenePortal({ id = 'worlds', introComplete = true }: ScenePortalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const beatIndexRef = useRef<HTMLParagraphElement>(null);
  const beatTitleRef = useRef<HTMLParagraphElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const gsapCtxRef = useRef<ReturnType<typeof gsap.context> | null>(null);
  const [isMobile, setIsMobile] = useState(() => isMobileViewport());
  const [isReducedMotion, setIsReducedMotion] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const sync = () => {
      setIsMobile(isMobileViewport());
      setIsReducedMotion(prefersReducedMotion());
    };
    sync();
    window.addEventListener('resize', sync, { passive: true });
    const removeMotion = onMotionPreferenceChange(sync);
    return () => {
      window.removeEventListener('resize', sync);
      removeMotion();
    };
  }, []);

  useIntroAnimations(
    introComplete,
    () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
      gsapCtxRef.current?.revert();
      gsapCtxRef.current = null;

      // Mobile + reduced-motion use the static stacked layout — no pin scrub.
      if (isMobile || isReducedMotion) return;

      const root = rootRef.current;
      const pin = pinRef.current;
      const stage = stageRef.current;
      if (!root || !pin || !stage) return;

      const beatCount = portalWorlds.length;
      const segVh = 1.1;

      const ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>('.story-beat', stage);
        if (panels.length === 0) return;

        gsap.set(panels, { opacity: 0, scale: 1, x: 0, filter: 'none', clipPath: 'inset(0%)' });
        gsap.set(panels[0], { opacity: 1 });

        const pinTrigger = ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: () => `+=${window.innerHeight * segVh * beatCount}`,
          pin,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const scaled = self.progress * beatCount;
            const index = Math.min(beatCount - 1, Math.max(0, Math.floor(scaled)));
            const local = scaled - index;

            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
            if (beatIndexRef.current) {
              beatIndexRef.current.textContent = `${String(index + 1).padStart(2, '0')} / ${String(beatCount).padStart(2, '0')}`;
            }
            if (beatTitleRef.current) {
              beatTitleRef.current.textContent = portalWorlds[index]?.title ?? '';
            }

            panels.forEach((panel, i) => {
              let opacity = 0;
              if (i === index) opacity = 1 - local * 0.85;
              else if (i === index + 1) opacity = local * 0.85;
              gsap.set(panel, {
                opacity: Math.max(0, Math.min(1, opacity)),
                scale: 1,
                pointerEvents: i === index ? 'auto' : 'none',
              });
            });
          },
        });
        triggersRef.current.push(pinTrigger);
      }, root);

      gsapCtxRef.current = ctx;

      return () => {
        triggersRef.current.forEach((t) => t.kill());
        triggersRef.current = [];
        ctx.revert();
        gsapCtxRef.current = null;
      };
    },
    [isMobile, isReducedMotion]
  );

  if (isReducedMotion || isMobile) {
    return (
      <section
        id={id}
        ref={rootRef}
        className="scene-portal relative bg-[#050505]"
        aria-label="Industries we serve"
      >
        {portalWorlds.map((world) => (
          <article
            key={world.id}
            className="story-beat-static relative min-h-[70dvh] sm:min-h-screen flex flex-col justify-end sm:justify-center px-6 sm:px-14 lg:px-24 py-16 sm:py-0 border-b border-white/10"
          >
            <img
              src={world.image}
              alt={world.imageAlt}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
            <div className="relative z-10 max-w-3xl">
              <p className="font-opensans text-orange text-xs uppercase tracking-[0.45em] mb-4">
                {world.eyebrow}
              </p>
              <h2 className="font-teko text-4xl sm:text-6xl font-bold text-white leading-none">
                {world.title}{' '}
                <span className="text-orange">{world.accent}</span>
              </h2>
              <p className="font-opensans text-sm text-white/50 mt-4 tracking-widest uppercase">
                {world.coords}
              </p>
            </div>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={rootRef}
      className="scene-portal relative bg-[#050505]"
      aria-label="Industries we serve"
      aria-roledescription="scroll story"
    >
      <div ref={pinRef} className="relative h-screen-dvh overflow-hidden">
        <div className="scene-portal-ambient absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_120%,rgba(255,110,0,0.18),transparent_65%)]" />
        </div>

        <div className="absolute top-24 left-6 lg:left-12 z-30 pointer-events-none">
          <p className="font-opensans text-[10px] uppercase tracking-[0.45em] text-white/60 mb-1">
            Industries we serve
          </p>
          <p className="font-teko text-xl sm:text-2xl lg:text-3xl text-white/80 tracking-wide leading-none">
            BUILT FOR<span className="text-orange"> HOUSTON</span>
          </p>
        </div>

        {/* Decorative progress readout — kept out of the accessibility tree */}
        <div className="absolute top-24 right-6 lg:right-12 z-30 pointer-events-none text-right" aria-hidden="true">
          <p ref={beatIndexRef} className="font-opensans text-[10px] uppercase tracking-[0.4em] text-white/60">
            01 / 04
          </p>
          <p ref={beatTitleRef} className="font-teko text-xl text-orange">
            {portalWorlds[0]?.title}
          </p>
        </div>

        <div ref={stageRef} className="absolute inset-0">
          {portalWorlds.map((world, index) => (
            <article
              key={world.id}
              className="story-beat absolute inset-0 overflow-hidden"
            >
              <img
                src={world.image}
                alt={world.imageAlt}
                className="story-beat-image absolute inset-0 w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

              <div className="story-beat-content relative z-10 h-full flex flex-col justify-end pb-24 pt-36 sm:justify-center sm:pb-0 sm:pt-0 px-8 sm:px-14 lg:px-24">
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                  <span className="w-12 h-px bg-orange" />
                  <span className="font-opensans text-orange text-[10px] sm:text-xs uppercase tracking-[0.45em]">
                    {world.eyebrow}
                  </span>
                </div>

                <h2 className="font-teko font-bold leading-[0.85] tracking-tight mb-4">
                  <span className="block text-white text-5xl sm:text-7xl md:text-8xl lg:text-[7rem]">
                    {world.title}
                  </span>
                  <span className="block text-orange text-4xl sm:text-6xl md:text-7xl lg:text-[6rem]">
                    {world.accent}
                  </span>
                </h2>

                <p className="font-opensans text-sm text-white/45 tracking-[0.25em] uppercase">
                  {world.coords}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute bottom-10 left-6 lg:left-12 z-30 pointer-events-none">
          <p className="font-opensans text-[10px] uppercase tracking-[0.4em] text-white/60 mb-3">
            Scroll to explore · Houston metro
          </p>
          <div className="h-px bg-white/10 overflow-hidden rounded-full max-w-xs">
            <div ref={progressRef} className="story-beat-progress h-full bg-orange w-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
