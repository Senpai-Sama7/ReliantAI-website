import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield, Award, Zap, Users, TrendingUp, Clock } from 'lucide-react';
import { Toaster } from 'sonner';
import Navigation from '../components/Navigation';
import VideoHero from '../sections/VideoHero';
import Contact from '../sections/Contact';
import SmoothScrollProvider from '../components/SmoothScrollProvider';
import { useTheme } from '../hooks/useTheme';

gsap.registerPlugin(ScrollTrigger);

// ─── Stats bar ────────────────────────────────────────────────────────────────
const STATS = [
  { value: '100+', label: 'Projects Delivered', icon: Award },
  { value: '98%',  label: 'Client Satisfaction', icon: Users },
  { value: '5×',   label: 'Average Lead Increase', icon: TrendingUp },
  { value: '24h',  label: 'Response Guarantee', icon: Clock },
];

// ─── Capabilities grid ────────────────────────────────────────────────────────
const CAPABILITIES = [
  {
    number: '01',
    title: 'Custom Web Development',
    body: 'Hand-coded in React & TypeScript. Zero templates. Blazing-fast Core Web Vitals.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind'],
  },
  {
    number: '02',
    title: 'Brand Identity Systems',
    body: 'Visual languages built to communicate authority — from logo to full brand guidelines.',
    tags: ['Logo Design', 'Style Guide', 'Color System', 'Typography'],
  },
  {
    number: '03',
    title: 'Conversion Optimization',
    body: 'Data-driven UX that turns visitors into paying customers. Proven across Texas industries.',
    tags: ['CRO', 'A/B Testing', 'Analytics', 'Heatmaps'],
  },
  {
    number: '04',
    title: '3D & Motion Design',
    body: 'WebGL scenes, animated product showcases, and immersive scroll experiences.',
    tags: ['Three.js', 'WebGL', 'GSAP', 'Lottie'],
  },
  {
    number: '05',
    title: 'SEO & Growth Strategy',
    body: 'Rank for the terms that matter in your market. Local authority building included.',
    tags: ['Technical SEO', 'Local SEO', 'Content', 'Link Building'],
  },
  {
    number: '06',
    title: 'Ongoing Partnership',
    body: 'Monthly retainers for continuous improvement. We grow as your business grows.',
    tags: ['Maintenance', 'Analytics Reports', 'Priority Support', 'Roadmap'],
  },
];

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.stat-item');
    gsap.set(items, { y: 20, opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () =>
        gsap.to(items, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }),
    });
    return () => trigger.kill();
  }, []);

  return (
    <div
      ref={ref}
      className="relative z-10 bg-[#0a0a0a] border-y border-white/8"
    >
      {/* Steel texture line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map(({ value, label, icon: Icon }) => (
          <div key={label} className="stat-item flex items-center gap-4 group">
            <div className="w-10 h-10 rounded bg-orange/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange/20 transition-colors duration-300">
              <Icon size={18} className="text-orange" />
            </div>
            <div>
              <div className="font-teko text-3xl font-bold text-white leading-none">{value}</div>
              <div className="font-opensans text-[10px] uppercase tracking-[0.25em] text-white/40 mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Capabilities grid ────────────────────────────────────────────────────────
function CapabilitiesGrid() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = el.querySelectorAll('.cap-card');
    gsap.set(cards, { y: 40, opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () =>
        gsap.to(cards, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'power3.out' }),
    });
    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={ref}
      id="services"
      className="relative bg-[#070707] py-28 lg:py-36"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,110,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,110,0,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <span className="flex items-center gap-3 font-opensans text-orange text-xs uppercase tracking-[0.45em] mb-5">
            <span className="w-8 h-px bg-orange" />
            What We Build
          </span>
          <h2 className="font-teko font-bold leading-[0.88] text-white">
            <span style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }} className="block">
              FULL-STACK
            </span>
            <span style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }} className="block text-orange">
              EXCELLENCE
            </span>
          </h2>
        </div>

        {/* 3-column grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.number}
              className="cap-card group relative bg-[#070707] p-8 lg:p-10 hover:bg-[#0f0f0f] transition-colors duration-300 cursor-default"
            >
              {/* Number watermark */}
              <span className="absolute top-6 right-8 font-teko text-5xl font-bold text-white/[0.04] group-hover:text-orange/10 transition-colors duration-500 select-none">
                {cap.number}
              </span>

              <div className="relative">
                {/* Accent rule */}
                <div className="w-8 h-[2px] bg-orange mb-6 group-hover:w-14 transition-all duration-300" />

                <h3 className="font-teko text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-orange transition-colors duration-300">
                  {cap.title}
                </h3>
                <p className="font-opensans text-white/50 text-sm leading-relaxed mb-6">
                  {cap.body}
                </p>

                {/* Tag pills */}
                <div className="flex flex-wrap gap-2">
                  {cap.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[10px] font-opensans text-white/40 bg-white/[0.04] rounded-full group-hover:bg-orange/10 group-hover:text-orange transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust bar ────────────────────────────────────────────────────────────────
function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.trust-item');
    gsap.set(items, { y: 16, opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () =>
        gsap.to(items, { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: 'power2.out' }),
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={ref} className="bg-[#0a0a0a] border-t border-white/[0.06] py-12">
      <div className="max-w-4xl mx-auto px-8 flex flex-wrap justify-center gap-10">
        {[
          { icon: Shield, label: 'BBB Accredited Business' },
          { icon: Award,  label: 'Clutch Top Agency 2025' },
          { icon: Zap,    label: 'Google Verified Partner' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="trust-item flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors duration-300">
            <Icon size={16} className="text-orange opacity-70" />
            <span className="font-opensans text-xs uppercase tracking-[0.25em]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Brand story interlude ────────────────────────────────────────────────────
function BrandStory() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.story-item');
    gsap.set(items, { x: -30, opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () =>
        gsap.to(items, { x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' }),
    });
    return () => trigger.kill();
  }, []);

  return (
    <section ref={ref} className="relative bg-[#060606] py-28 lg:py-36 overflow-hidden">
      {/* Decorative gear silhouette — right edge */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.04] pointer-events-none select-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'90\' fill=\'none\' stroke=\'white\' stroke-width=\'10\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'55\' fill=\'none\' stroke=\'white\' stroke-width=\'6\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'20\' fill=\'none\' stroke=\'white\' stroke-width=\'4\'/%3E%3C/svg%3E")',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: big pull quote */}
        <div>
          <p className="story-item font-teko font-bold text-white leading-[0.9]" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            "WE BUILD WEBSITES THAT WORK AS HARD AS YOUR CREW."
          </p>
          <div className="story-item mt-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-orange flex items-center justify-center">
              <span className="font-teko text-white font-bold text-lg">R</span>
            </div>
            <div>
              <div className="font-teko text-white text-lg font-semibold leading-none">RELIANT AI</div>
              <div className="font-opensans text-white/40 text-[10px] uppercase tracking-[0.25em] mt-0.5">Houston, Texas</div>
            </div>
          </div>
        </div>

        {/* Right: value proposition paragraphs */}
        <div className="space-y-6">
          <p className="story-item font-opensans text-white/60 leading-relaxed">
            We're a boutique studio serving Houston's most ambitious businesses — metal fabricators, oilfield operators, medical practices, and home-service companies who need a digital presence that matches their real-world excellence.
          </p>
          <p className="story-item font-opensans text-white/60 leading-relaxed">
            Every project is hand-coded from scratch. No page builders. No cutting corners. Your website becomes a precision-machined sales instrument that runs around the clock.
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="story-item group inline-flex items-center gap-2 text-orange font-opensans font-semibold text-sm hover:gap-4 transition-all duration-300"
          >
            Read our story
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function VideoShowcase() {
  const { mounted } = useTheme();

  if (!mounted) {
    return <div className="min-h-screen bg-[#060606]" />;
  }

  return (
    <SmoothScrollProvider>
      <Toaster position="top-right" richColors />

      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[9999] px-4 py-2 bg-orange text-white font-opensans text-sm rounded">
        Skip to main content
      </a>

      <Navigation darkHero />

      <main id="main">
        {/* 1. Full-screen video hero with gear field */}
        <VideoHero />

        {/* 2. Instant-read KPI bar */}
        <StatsBar />

        {/* 3. Brand story pull-quote */}
        <BrandStory />

        {/* 4. Capabilities grid */}
        <CapabilitiesGrid />

        {/* 5. Trust signals */}
        <TrustBar />

        {/* 6. Contact form + footer (reuse existing) */}
        <Contact />
      </main>
    </SmoothScrollProvider>
  );
}
