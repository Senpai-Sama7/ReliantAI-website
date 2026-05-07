import { useEffect, useRef, useState, useCallback, memo } from 'react';
import gsap from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';

// ─── Act definitions ───────────────────────────────────────────────────────────
// To add real videos, fill in the `video` field with a path like '/videos/gears.mp4'
// or any direct MP4/WebM URL. Leave blank to use the poster-image fallback.
interface Act {
  id: string;
  video: string;
  poster: string;
  eyebrow: string;
  headline: string;
  accent: string;
  body: string;
}

const ACTS: Act[] = [
  {
    id: 'precision',
    video: '',
    poster: '/project-metalforge.webp',
    eyebrow: 'Industrial Precision',
    headline: 'CRAFTED',
    accent: 'IN STEEL',
    body: 'Every gear. Every tolerance. Every line of code — built to last.',
  },
  {
    id: 'texture',
    video: '',
    poster: '/project-oilfield.webp',
    eyebrow: 'Material Excellence',
    headline: 'MACHINED',
    accent: 'TO PERFECTION',
    body: 'Where light meets metal. Where texture becomes brand identity.',
  },
  {
    id: 'brand',
    video: '',
    poster: '/project-homeservices.webp',
    eyebrow: 'Digital Craftsmanship',
    headline: 'YOUR BRAND',
    accent: 'REIMAGINED',
    body: 'Built for businesses that refuse to compromise on excellence.',
  },
];

const ACT_DURATION = 6000; // ms each act is displayed

// ─── Gear geometry ────────────────────────────────────────────────────────────
function buildGearPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  teeth: number,
): string {
  const step = (Math.PI * 2) / teeth;
  const half = step * 0.28;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const base = i * step - Math.PI / 2;
    pts.push(
      `${cx + innerR * Math.cos(base - half)},${cy + innerR * Math.sin(base - half)}`,
      `${cx + outerR * Math.cos(base - half * 0.35)},${cy + outerR * Math.sin(base - half * 0.35)}`,
      `${cx + outerR * Math.cos(base + half * 0.35)},${cy + outerR * Math.sin(base + half * 0.35)}`,
      `${cx + innerR * Math.cos(base + half)},${cy + innerR * Math.sin(base + half)}`,
    );
  }
  return `M ${pts.join(' L ')} Z`;
}

interface GearDef {
  cx: number; cy: number; outerR: number; innerR: number;
  teeth: number; duration: number; reverse: boolean; spokes: number;
}

// Positions biased toward the right half so text stays readable on the left
const GEARS: GearDef[] = [
  { cx: 820, cy: 200, outerR: 115, innerR: 88,  teeth: 24, duration: 14,   reverse: false, spokes: 6 },
  { cx: 657, cy: 258, outerR: 70,  innerR: 54,  teeth: 15, duration: 8.75, reverse: true,  spokes: 5 },
  { cx: 558, cy: 194, outerR: 46,  innerR: 36,  teeth: 10, duration: 5.83, reverse: false, spokes: 4 },
  { cx: 955, cy: 110, outerR: 80,  innerR: 61,  teeth: 17, duration: 9.41, reverse: true,  spokes: 5 },
  { cx: 1060, cy: 270, outerR: 54, innerR: 42,  teeth: 12, duration: 6.38, reverse: false, spokes: 4 },
  { cx: 730,  cy: 48,  outerR: 40, innerR: 31,  teeth: 9,  duration: 4.44, reverse: true,  spokes: 3 },
  { cx: 1140, cy: 155, outerR: 90, innerR: 69,  teeth: 20, duration: 12,   reverse: false, spokes: 6 },
  { cx: 490,  cy: 310, outerR: 58, innerR: 44,  teeth: 13, duration: 7.24, reverse: true,  spokes: 4 },
  { cx: 1000, cy: 350, outerR: 48, innerR: 37,  teeth: 10, duration: 5.33, reverse: false, spokes: 3 },
  { cx: 620,  cy: 370, outerR: 35, innerR: 27,  teeth: 8,  duration: 3.89, reverse: true,  spokes: 3 },
];

// ─── Single gear SVG group ────────────────────────────────────────────────────
const Gear = memo(({ g }: { g: GearDef }) => {
  const spokeAngles = Array.from({ length: g.spokes }, (_, i) => (i / g.spokes) * Math.PI * 2);
  return (
    <g
      style={{
        transformOrigin: `${g.cx}px ${g.cy}px`,
        animation: `vhGearSpin ${g.duration}s linear infinite${g.reverse ? ' reverse' : ''}`,
      }}
    >
      {/* Gear teeth + body */}
      <path
        d={buildGearPath(g.cx, g.cy, g.outerR, g.innerR, g.teeth)}
        fill="url(#vhSteelBody)"
        stroke="url(#vhSteelEdge)"
        strokeWidth="0.7"
      />
      {/* Web (disc between hub and rim) */}
      <circle cx={g.cx} cy={g.cy} r={g.innerR * 0.85} fill="url(#vhWebGrad)" />
      {/* Spokes */}
      {spokeAngles.map((a) => (
        <line
          key={a}
          x1={g.cx + g.innerR * 0.45 * Math.cos(a)}
          y1={g.cy + g.innerR * 0.45 * Math.sin(a)}
          x2={g.cx + g.innerR * 0.8 * Math.cos(a)}
          y2={g.cy + g.innerR * 0.8 * Math.sin(a)}
          stroke="#2a2a2a"
          strokeWidth={Math.max(1.8, g.outerR * 0.045)}
          strokeLinecap="round"
        />
      ))}
      {/* Hub outer ring */}
      <circle cx={g.cx} cy={g.cy} r={g.innerR * 0.42} fill="url(#vhHubGrad)" stroke="#3d3d3d" strokeWidth="1" />
      {/* Center bore */}
      <circle cx={g.cx} cy={g.cy} r={g.innerR * 0.15} fill="#050505" stroke="#555" strokeWidth="0.8" />
      {/* Axle highlight (orange brand dot) */}
      <circle cx={g.cx} cy={g.cy} r={g.innerR * 0.07} fill="#ff6e00" opacity="0.65" />
    </g>
  );
});
Gear.displayName = 'Gear';

// ─── Full gear field ──────────────────────────────────────────────────────────
const GearField = memo(() => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 1280 440"
    preserveAspectRatio="xMaxYMid slice"
    aria-hidden="true"
  >
    <defs>
      {/* Steel body gradient — dark brushed look */}
      <linearGradient id="vhSteelBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#4a4a4a" />
        <stop offset="45%"  stopColor="#2c2c2c" />
        <stop offset="100%" stopColor="#181818" />
      </linearGradient>
      {/* Edge highlight — lighter at top-left */}
      <linearGradient id="vhSteelEdge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#707070" />
        <stop offset="100%" stopColor="#1e1e1e" />
      </linearGradient>
      {/* Web / disc area */}
      <radialGradient id="vhWebGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#262626" />
        <stop offset="100%" stopColor="#141414" />
      </radialGradient>
      {/* Hub face — machined look */}
      <radialGradient id="vhHubGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%"   stopColor="#3e3e3e" />
        <stop offset="100%" stopColor="#111" />
      </radialGradient>
    </defs>

    {GEARS.map((g, i) => <Gear key={i} g={g} />)}
  </svg>
));
GearField.displayName = 'GearField';

// ─── VideoHero ────────────────────────────────────────────────────────────────
export default function VideoHero() {
  const [actIndex, setActIndex]   = useState(0);
  const [loaded, setLoaded]       = useState<boolean[]>(ACTS.map(() => false));
  const textRef                   = useRef<HTMLDivElement>(null);
  const progressRef               = useRef<HTMLDivElement>(null);
  const progressTweenRef          = useRef<gsap.core.Tween | null>(null);
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs                 = useRef<(HTMLVideoElement | null)[]>([]);
  const reducedMotion             = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  // ── Switch act ──
  const goToAct = useCallback((next: number) => {
    if (reducedMotion.current || !textRef.current) {
      setActIndex(next);
      return;
    }
    gsap.to(Array.from(textRef.current.children), {
      y: -28, opacity: 0,
      duration: 0.32, stagger: 0.04,
      ease: 'power2.in',
      onComplete: () => setActIndex(next),
    });
  }, []);

  // ── Auto-advance timer ──
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => goToAct((actIndex + 1) % ACTS.length),
      ACT_DURATION,
    );
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [actIndex, goToAct]);

  // ── Text entrance animation ──
  useEffect(() => {
    if (!textRef.current || reducedMotion.current) return;
    gsap.fromTo(
      Array.from(textRef.current.children),
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out', delay: 0.05 },
    );
  }, [actIndex]);

  // ── Progress bar ──
  useEffect(() => {
    if (!progressRef.current) return;
    progressTweenRef.current?.kill();
    gsap.set(progressRef.current, { scaleX: 0 });
    progressTweenRef.current = gsap.to(progressRef.current, {
      scaleX: 1,
      duration: ACT_DURATION / 1000,
      ease: 'none',
    });
    return () => { progressTweenRef.current?.kill(); };
  }, [actIndex]);

  // ── Pause background videos that are not visible ──
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === actIndex) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [actIndex]);

  const act = ACTS[actIndex];

  const scrollDown = () => {
    const next =
      document.getElementById('work') ??
      (document.querySelector('main')?.children[1] as HTMLElement | null);
    next?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full h-screen min-h-[580px] overflow-hidden bg-[#060606]"
      aria-label="Showcase hero"
    >
      {/* ── Animated gear field ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 opacity-[0.28] pointer-events-none select-none">
        <GearField />
      </div>

      {/* ── Video / poster layers ────────────────────────────────────────────── */}
      {ACTS.map((a, i) => (
        <div
          key={a.id}
          className="absolute inset-0 z-[1] transition-opacity duration-1000 pointer-events-none"
          style={{ opacity: i === actIndex ? 1 : 0 }}
        >
          {a.video ? (
            <video
              ref={(el) => { videoRefs.current[i] = el; }}
              className="w-full h-full object-cover"
              src={a.video}
              poster={a.poster}
              autoPlay
              muted
              loop
              playsInline
              preload={i === 0 ? 'auto' : 'none'}
              onCanPlayThrough={() =>
                setLoaded((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                })
              }
            />
          ) : (
            /* Poster-image fallback (dark-tinted) */
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${a.poster})`,
                filter: 'brightness(0.22) saturate(0.35)',
              }}
            />
          )}
        </div>
      ))}

      {/* ── Cinematic overlay stack ──────────────────────────────────────────── */}
      {/* Left vignette keeps text readable */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/92 via-black/65 to-transparent pointer-events-none" />
      {/* Top + bottom vignette */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />
      {/* Horizontal scan-line texture — film grain feel */}
      <div
        className="absolute inset-0 z-[3] opacity-[0.032] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)',
        }}
      />
      {/* Brand-orange glow — top-right accent light */}
      <div
        className="absolute top-0 right-0 w-1/2 h-1/2 z-[3] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 100% 0%, rgba(255,110,0,0.09) 0%, transparent 70%)',
        }}
      />
      {/* Steel-cold glow — bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-1/3 h-1/3 z-[3] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 0% 100%, rgba(100,140,180,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── Main text content ────────────────────────────────────────────────── */}
      <div className="relative z-[10] h-full flex flex-col justify-center px-8 sm:px-14 md:px-20 lg:px-28">
        <div ref={textRef} className="max-w-3xl xl:max-w-4xl">

          {/* Eyebrow line */}
          <div className="flex items-center gap-4 mb-6">
            <span className="flex-shrink-0 w-10 h-px bg-orange" />
            <span className="font-opensans text-orange text-[10px] sm:text-xs uppercase tracking-[0.5em]">
              {act.eyebrow}
            </span>
          </div>

          {/* Giant headline */}
          <h1 className="font-teko font-bold leading-[0.82] tracking-tight mb-5">
            <span
              className="block text-white"
              style={{
                fontSize: 'clamp(4rem, 13vw, 10.5rem)',
                textShadow: '0 4px 40px rgba(0,0,0,0.9)',
              }}
            >
              {act.headline}
            </span>
            <span
              className="block text-orange"
              style={{
                fontSize: 'clamp(4rem, 13vw, 10.5rem)',
                textShadow: '0 4px 40px rgba(255,110,0,0.25)',
              }}
            >
              {act.accent}
            </span>
          </h1>

          {/* Tagline */}
          <p className="font-opensans text-white/50 text-base sm:text-lg md:text-xl mb-10 max-w-md leading-relaxed">
            {act.body}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Primary — filled, wipe hover */}
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-orange text-white font-opensans font-semibold text-sm tracking-wide overflow-hidden"
              aria-label="Start your project"
            >
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-150">
                Start Your Project
              </span>
              <ArrowRight
                size={15}
                className="relative z-10 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300"
              />
            </button>

            {/* Secondary — ghost */}
            <button
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/25 text-white/75 font-opensans font-semibold text-sm tracking-wide hover:border-orange hover:text-orange transition-all duration-300"
              aria-label="View our work"
            >
              Explore Work
            </button>
          </div>
        </div>
      </div>

      {/* ── Act indicators + progress ─────────────────────────────────────────── */}
      <div className="absolute bottom-14 left-8 sm:left-14 md:left-20 lg:left-28 z-[10] flex items-center gap-5">
        {ACTS.map((a, i) => (
          <button
            key={a.id}
            onClick={() => goToAct(i)}
            aria-label={`Scene ${i + 1}: ${a.eyebrow}`}
            className={`rounded-full transition-all duration-300 ${
              i === actIndex
                ? 'w-7 h-[3px] bg-orange'
                : 'w-[6px] h-[6px] bg-white/25 hover:bg-white/55'
            }`}
          />
        ))}
        {/* Progress bar */}
        <div className="relative w-20 h-px bg-white/15 overflow-hidden ml-1">
          <div
            ref={progressRef}
            className="absolute inset-0 bg-orange origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>

      {/* ── Scene counter ─────────────────────────────────────────────────────── */}
      <div className="absolute bottom-14 right-8 sm:right-14 z-[10] select-none" aria-hidden="true">
        <span className="font-teko text-orange text-2xl">
          {String(actIndex + 1).padStart(2, '0')}
        </span>
        <span className="font-teko text-white/20 text-2xl"> / </span>
        <span className="font-teko text-white/20 text-2xl">
          {String(ACTS.length).padStart(2, '0')}
        </span>
      </div>

      {/* ── Loaded indicator (visible only when at least one video is playing) ── */}
      {loaded.some(Boolean) && (
        <div
          className="absolute top-6 right-8 z-[10] flex items-center gap-2 opacity-50"
          aria-hidden="true"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
          <span className="font-opensans text-[9px] uppercase tracking-[0.35em] text-white/50">
            Live
          </span>
        </div>
      )}

      {/* ── Scroll cue ────────────────────────────────────────────────────────── */}
      <button
        onClick={scrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-1.5 text-white/30 hover:text-white/70 transition-colors duration-300"
        aria-label="Scroll to content"
      >
        <span className="font-opensans text-[9px] uppercase tracking-[0.4em]">Scroll</span>
        <ChevronDown size={14} className="animate-bounce" />
      </button>

      {/* ── Gear spin keyframes ────────────────────────────────────────────────── */}
      <style>{`
        @keyframes vhGearSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
