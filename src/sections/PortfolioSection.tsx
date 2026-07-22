import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SITES = [
  {
    id: 'plumbing',
    title: 'Copperline Plumbing',
    tagline: 'Water where it belongs.',
    mark: 'Cu',
    previewUrl: '/portfolio/plumbing/',
    color: '#1c1f24',
    accent: '#b87333',
    highlights: ['Tap-to-call emergency bar', 'Asymmetric service index', 'Named Houston service areas'],
  },
  {
    id: 'electrical',
    title: 'Linework Electric',
    tagline: 'Power that passes inspection.',
    mark: 'Lw',
    previewUrl: '/portfolio/electrical/',
    color: '#0c0d10',
    accent: '#f5c518',
    highlights: ['Blueprint industrial identity', 'Numbered capability list', 'TECL license on the page'],
  },
  {
    id: 'hvac',
    title: 'Stillair Comfort',
    tagline: 'Indoor air that stays out of the way.',
    mark: 'St',
    previewUrl: '/portfolio/hvac/',
    color: '#1a2332',
    accent: '#d97706',
    highlights: ['Cool steel identity system', 'Heat / cool editorial split', 'Maintenance plan without gimmicks'],
  },
];

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(SITES[0].id);
  // Coarse pointers (touch) get a tap-to-interact scrim so the iframe doesn't
  // swallow page scrolling. Tracks the unlocked demo id so switching tabs
  // re-arms the scrim automatically.
  const [isCoarsePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );
  const [interactiveId, setInteractiveId] = useState<string | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.port-fade'), {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const active = SITES.find(s => s.id === activeId)!;

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative bg-[#060606] py-20 lg:py-28 overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,110,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,110,0,0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="port-fade mb-12 lg:mb-16">
          <span className="flex items-center gap-3 font-opensans text-orange text-xs uppercase tracking-[0.45em] mb-5">
            <span className="w-8 h-px bg-orange" />
            Proof of Work
          </span>
          <h2 className="font-teko font-bold leading-[0.88] text-white" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            <span className="block">THREE SITES.</span>
            <span className="block text-orange">ZERO TEMPLATES.</span>
          </h2>
          <p className="font-opensans text-white/50 text-sm leading-relaxed mt-5 max-w-2xl">
            Three Houston contractor demos — plumbing, electrical, HVAC — each with a locked
            identity, asymmetric layout, and copy that only fits that trade. Built as T1 editorial
            surfaces, not interchangeable SaaS templates.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="port-fade flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Portfolio demos">
          {SITES.map(site => (
            <button
              key={site.id}
              type="button"
              role="tab"
              aria-selected={activeId === site.id}
              onClick={() => setActiveId(site.id)}
              className={`px-4 sm:px-5 py-3 min-h-11 font-opensans text-sm font-semibold border transition-colors duration-150 ${
                activeId === site.id
                  ? 'bg-orange text-white border-orange'
                  : 'bg-transparent text-white/55 border-white/[0.08] hover:text-white hover:border-white/25'
              }`}
            >
              <span className="mr-2 font-teko tracking-wide opacity-70">{site.mark}</span>
              <span className="sm:hidden">{site.title.split(' ')[0]}</span>
              <span className="hidden sm:inline">{site.title}</span>
            </button>
          ))}
        </div>

        {/* Browser frame preview */}
        <div className="port-fade">
          <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-2xl shadow-black/50 border border-white/[0.08]">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#0f0f0f] border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 text-center min-w-0">
                <span className="block truncate text-[10px] font-opensans text-white/55">reliantai.org{active.previewUrl}</span>
              </div>
              <ExternalLink size={12} className="text-white/20 shrink-0" />
            </div>
            {/* Iframe — container-query scale so phones see a readable desktop layout */}
            <div
              className="relative bg-white overflow-hidden lg:h-[clamp(320px,55vh,650px)]"
            >
              <div className="portfolio-preview-frame relative w-full lg:absolute lg:inset-0 lg:aspect-auto">
                <iframe
                  src={active.previewUrl}
                  className="portfolio-preview-iframe border-0"
                  title={active.title}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
              {/* Touch scrim: keeps page scroll from being trapped by the iframe */}
              {isCoarsePointer && interactiveId !== activeId && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-[2px] px-4">
                  <button
                    type="button"
                    onClick={() => setInteractiveId(activeId)}
                    className="px-6 py-3 min-h-11 bg-orange text-white font-opensans text-sm font-semibold rounded-lg shadow-lg shadow-black/30"
                  >
                    Tap to interact
                  </button>
                  <a
                    href={active.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-target inline-flex items-center gap-1.5 px-4 py-2 text-white/85 font-opensans text-xs font-semibold underline underline-offset-4 decoration-white/40"
                  >
                    Open full site <ArrowUpRight size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Link to the full portfolio page */}
        <div className="port-fade mt-6 flex justify-end">
          <a
            href="/portfolio"
            className="group inline-flex items-center gap-2 px-5 py-3 border border-white/15 text-white/80 font-opensans text-sm font-semibold hover:border-orange hover:text-white transition-colors duration-150"
          >
            See the full portfolio breakdown
            <ArrowUpRight size={14} className="text-orange transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Info cards below preview */}
        <div className="port-fade mt-8 grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.06]">
          {SITES.map(site => (
            <a
              key={site.id}
              href={site.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block bg-[#060606] p-5 transition-colors duration-150 hover:bg-white/[0.03] ${
                activeId === site.id ? 'ring-1 ring-inset ring-orange/40' : ''
              }`}
              onClick={() => setActiveId(site.id)}
            >
              <div className="flex items-start gap-3 mb-4">
                <span
                  className="font-teko text-lg font-bold leading-none pt-0.5"
                  style={{ color: site.accent }}
                  aria-hidden
                >
                  {site.mark}
                </span>
                <div className="min-w-0">
                  <div className="font-teko text-sm font-bold text-white">{site.title}</div>
                  <div className="font-opensans text-[10px] text-white/60 mt-0.5">{site.tagline}</div>
                </div>
                <ArrowUpRight size={14} className="ml-auto text-white/20 group-hover:text-orange transition-colors shrink-0" />
              </div>
              <ul className="space-y-1.5">
                {site.highlights.map(h => (
                  <li key={h} className="font-opensans text-[11px] text-white/60 leading-snug pl-3 border-l border-white/10">
                    {h}
                  </li>
                ))}
              </ul>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
