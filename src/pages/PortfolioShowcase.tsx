import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { Toaster } from 'sonner';
import Navigation from '../components/Navigation';
import Contact from '../sections/Contact';
import SmoothScrollProvider from '../components/SmoothScrollProvider';
import { useTheme } from '../hooks/useTheme';

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_ITEMS = [
  {
    id: 'plumbing',
    title: 'Copperline Plumbing',
    tagline: 'Water where it belongs.',
    category: 'Home Services',
    mark: 'Cu',
    color: '#1c1f24',
    accent: '#b87333',
    secondaryAccent: '#f4f5f7',
    previewUrl: '/portfolio/plumbing/',
    description: 'Editorial T1 plumbing site for Houston: copper-on-slate identity, full-bleed hero, asymmetric service index, Heights job proof, and a callback form with named validation errors. Built to convert emergency calls without SaaS-card layout.',
    highlights: ['Tap-to-call sticky bar', 'License M-38421 on page', 'Named service areas', 'No three-card feature grid'],
    stats: { pages: 'Single-page', sections: 7, interactivity: 'Form + reveals' },
  },
  {
    id: 'electrical',
    title: 'Linework Electric',
    tagline: 'Power that passes inspection.',
    category: 'Home Services',
    mark: 'Lw',
    color: '#0c0d10',
    accent: '#f5c518',
    secondaryAccent: '#14161c',
    previewUrl: '/portfolio/electrical/',
    description: 'Blueprint-industrial electrical site: Syne + IBM Plex Mono, signal-yellow restraint, numbered capability index, West U job story, TECL license, estimate request with explicit field errors. Spec-sheet energy without glow spam.',
    highlights: ['Blueprint grid atmosphere', 'Numbered capabilities', 'TECL-28441 visible', 'Emergency tel in chrome'],
    stats: { pages: 'Single-page', sections: 7, interactivity: 'Form + reveals' },
  },
  {
    id: 'hvac',
    title: 'Stillair Comfort',
    tagline: 'Indoor air that stays out of the way.',
    category: 'Home Services',
    mark: 'St',
    color: '#1a2332',
    accent: '#d97706',
    secondaryAccent: '#e8eef2',
    previewUrl: '/portfolio/hvac/',
    description: 'Cool steel HVAC marketing page that refuses the cream/terracotta AI cluster. Archivo + Source Serif 4, heat/cool editorial split, one maintenance offer, TACLA license, schedule form. Quiet brand, specific Houston areas.',
    highlights: ['Cool steel system', 'Heat/cool split rows', 'Amber CTA only', 'No seasonal gimmick widgets'],
    stats: { pages: 'Single-page', sections: 7, interactivity: 'Form + reveals' },
  },
];

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.hero-fade'), { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative min-h-[90vh] bg-[#060606] flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, #ff6e00 0%, transparent 50%), radial-gradient(circle at 75% 50%, #ff6e00 0%, transparent 50%)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-8 lg:px-16 py-32 lg:py-40 w-full">
        <div className="max-w-4xl">
          <span className="hero-fade flex items-center gap-3 font-opensans text-orange text-xs uppercase tracking-[0.45em] mb-5">
            <span className="w-8 h-px bg-orange" />
            Proof of Work
          </span>
          <h1 className="hero-fade font-teko font-bold leading-[0.88] text-white mb-6" style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}>
            <span className="block">THREE SITES.</span>
            <span className="block text-orange">ZERO TEMPLATES.</span>
          </h1>
          <p className="hero-fade font-opensans text-white/50 text-lg max-w-2xl leading-relaxed mb-10">
            Copperline, Linework, and Stillair. Three Houston trades, three locked identities,
            one rule: if you can swap the logo and keep the layout, it failed.
          </p>
          <div className="hero-fade flex flex-wrap gap-3">
            <a
              href="#previews"
              className="inline-flex items-center px-5 py-3 bg-orange text-white font-opensans text-sm font-semibold hover:bg-orange/90 transition-colors"
            >
              Open live demos
            </a>
            <a
              href="#contact"
              className="inline-flex items-center px-5 py-3 border border-white/20 text-white/80 font-opensans text-sm font-semibold hover:border-white/40 hover:text-white transition-colors"
            >
              Talk about a build
            </a>
          </div>
        </div>

        <div className="hero-fade mt-16 lg:mt-20 flex flex-col sm:flex-row sm:flex-wrap gap-px bg-white/[0.08] max-w-3xl" role="tablist" aria-label="Portfolio demos">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              onClick={() => setActiveIndex(i)}
              className={`flex-1 min-w-[9rem] text-left p-4 lg:p-5 transition-colors duration-150 ${
                activeIndex === i ? 'bg-orange/15' : 'bg-[#060606] hover:bg-white/[0.03]'
              }`}
            >
              <span className="font-teko text-lg font-bold" style={{ color: item.accent }}>{item.mark}</span>
              <div className="font-teko text-sm font-bold text-white mt-2">{item.title}</div>
              <div className="text-[10px] font-opensans text-white/35 mt-0.5">{item.tagline}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeviceFrame({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <div className={`relative mx-auto w-full max-w-5xl transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute pointer-events-none'}`}>
      <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-2xl shadow-black/50 border border-white/[0.08]">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0f0f0f] border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] font-opensans text-white/20">reliantai.org/portfolio</span>
          </div>
          <ExternalLink size={12} className="text-white/20" />
        </div>
        <div className="relative bg-white" style={{ height: 'clamp(400px, 60vh, 700px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function PreviewPanel() {
  const ref = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(PORTFOLIO_ITEMS[0].id);
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  const setIframeRef = useCallback((id: string) => (el: HTMLIFrameElement | null) => {
    iframeRefs.current[id] = el;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.panel-fade'), { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    }, el);
    return () => ctx.revert();
  }, []);

  const activeItem = PORTFOLIO_ITEMS.find(i => i.id === activeId)!;

  return (
    <section ref={ref} id="previews" className="relative bg-[#070707] py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,110,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,110,0,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">
        <div className="panel-fade mb-12 lg:mb-16">
          <span className="flex items-center gap-3 font-opensans text-orange text-xs uppercase tracking-[0.45em] mb-5">
            <span className="w-8 h-px bg-orange" />
            Live Previews
          </span>
          <h2 className="font-teko font-bold leading-[0.88] text-white" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            <span className="block">INTERACTIVE</span>
            <span className="block text-orange">PORTFOLIO</span>
          </h2>
        </div>

        <div className="panel-fade flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Demo sites">
          {PORTFOLIO_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeId === item.id}
              onClick={() => setActiveId(item.id)}
              className={`px-5 py-3 font-opensans text-sm font-semibold border transition-colors duration-150 ${
                activeId === item.id
                  ? 'bg-orange text-white border-orange'
                  : 'bg-transparent text-white/50 border-white/[0.08] hover:text-white hover:border-white/25'
              }`}
            >
              <span className="mr-2 font-teko opacity-70">{item.mark}</span>
              {item.title}
            </button>
          ))}
        </div>

        <div className="panel-fade relative">
          {PORTFOLIO_ITEMS.map(item => (
            <div key={item.id} className={activeId === item.id ? 'block' : 'hidden'}>
              <DeviceFrame isActive={activeId === item.id}>
                <iframe
                  ref={setIframeRef(item.id)}
                  src={item.previewUrl}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 'none' }}
                  title={item.title}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </DeviceFrame>
            </div>
          ))}
        </div>

        <div className="panel-fade mt-12 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-px bg-white/[0.06]">
          <div className="bg-[#070707] p-6 lg:p-8">
            <div className="flex items-start gap-3 mb-4">
              <span className="font-teko text-2xl font-bold leading-none" style={{ color: activeItem.accent }}>{activeItem.mark}</span>
              <div>
                <div className="font-teko text-xl font-bold text-white">{activeItem.title}</div>
                <div className="font-opensans text-xs text-white/40 mt-0.5">{activeItem.tagline}</div>
              </div>
            </div>
            <p className="font-opensans text-white/60 text-sm leading-relaxed mb-6">{activeItem.description}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeItem.highlights.map(h => (
                <li key={h} className="font-opensans text-xs text-white/50 pl-3 border-l border-orange/40">
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#070707] p-6 lg:p-8">
            <div className="font-teko text-lg font-bold text-white mb-4">Specs</div>
            <div className="space-y-3">
              {Object.entries(activeItem.stats).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="font-opensans text-xs text-white/40 capitalize">{key}</span>
                  <span className="font-teko text-sm text-white font-semibold">{val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="font-opensans text-xs text-white/40">Stack</span>
                <span className="font-teko text-sm text-orange font-semibold">Vanilla HTML</span>
              </div>
            </div>
            <a
              href={activeItem.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 group inline-flex items-center gap-2 text-orange font-opensans text-sm font-semibold"
            >
              Open full site <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustryInsights() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.insight-fade'), { y: 25, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    }, el);
    return () => ctx.revert();
  }, []);

  const insights = [
    { label: 'License on the page', desc: 'State license and insurance sit in real UI chrome, not a footer footnote. Homeowners look for them before they call.' },
    { label: 'Emergency tap-to-call', desc: 'Phone is sticky above the fold on mobile. After-hours leaks and outages do not wait for a contact form.' },
    { label: 'Named service areas', desc: 'Katy, Heights, Memorial, The Woodlands: neighborhood names beat generic "serving the greater Houston area."' },
    { label: 'Pricing or quote path', desc: 'Show a real range or explain how quoting works. Hidden pricing reads like hidden fees.' },
    { label: 'One accent, two fonts', desc: 'Each trade demo locks a distinct type pairing and accent so the sites fail the logo-swap test.' },
    { label: 'Forms with named errors', desc: 'Empty, invalid, and success states are written. Default browser validation is not a design system.' },
  ];

  return (
    <section ref={ref} className="relative bg-[#060606] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="insight-fade mb-12 lg:mb-16 max-w-3xl">
          <span className="flex items-center gap-3 font-opensans text-orange text-xs uppercase tracking-[0.45em] mb-5">
            <span className="w-8 h-px bg-orange" />
            Trade Requirements
          </span>
          <h2 className="font-teko font-bold leading-[0.88] text-white" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            <span className="block">WHAT THE JOB</span>
            <span className="block text-orange">ACTUALLY NEEDS</span>
          </h2>
          <p className="font-opensans text-white/50 text-sm leading-relaxed mt-6 max-w-2xl">
            These pages are sales instruments for Houston trades. Trust signals and call paths
            come first; decoration does not.
          </p>
        </div>

        <ol className="insight-fade divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {insights.map(({ label, desc }, i) => (
            <li key={label} className={`grid grid-cols-[3rem_1fr] gap-4 py-6 lg:py-7 ${i % 2 === 1 ? 'lg:pl-12' : ''}`}>
              <span className="font-teko text-2xl text-orange/80 leading-none pt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-teko text-xl font-bold text-white mb-1">{label}</h3>
                <p className="font-opensans text-white/50 text-sm leading-relaxed max-w-2xl">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PricingStrategy() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.price-fade'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative bg-[#070707] py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="price-fade mb-12 lg:mb-16 max-w-3xl">
          <span className="flex items-center gap-3 font-opensans text-orange text-xs uppercase tracking-[0.45em] mb-5">
            <span className="w-8 h-px bg-orange" />
            Strategy
          </span>
          <h2 className="font-teko font-bold leading-[0.88] text-white" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            <span className="block">PRICING ON YOUR</span>
            <span className="block text-orange">WEBSITE — PROS & CONS</span>
          </h2>
        </div>

        <div className="price-fade grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-8 lg:p-10">
            <div className="font-teko text-2xl font-bold text-green-400 mb-6">WHY SHOW PRICING</div>
            <ul className="space-y-4">
              {[
                ['Filters tire-kickers', 'Published ranges push budget-mismatched leads out before the phone rings.'],
                ['Reads as honest', 'Hidden pricing often reads as hidden fees. Specific numbers calm the first call.'],
                ['Supports local search', 'Pages that answer "what does it cost" tend to match how Houston homeowners search.'],
                ['Pre-qualifies forms', 'Visitors who submit after seeing a range usually already know the ballpark.'],
                ['Stands out locally', 'Most trade sites hide dollars. Showing yours is a deliberate trust move.'],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-4">
                  <span className="text-green-400 font-teko text-lg leading-none mt-0.5" aria-hidden>+</span>
                  <div>
                    <div className="font-teko text-base font-bold text-white">{title}</div>
                    <div className="font-opensans text-white/50 text-xs leading-relaxed mt-0.5">{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-8 lg:p-10">
            <div className="font-teko text-2xl font-bold text-orange mb-6">WHEN TO HIDE PRICING</div>
            <ul className="space-y-4">
              {[
                ['Job Complexity Varies Widely', 'If every project requires an on-site estimate, published pricing can backfire. Prospects expect the lowest listed rate.'],
                ['Competitors Will Undercut', 'Listed pricing makes it easy for competitors to beat you by $20. If your differentiator is quality, not price, keep it hidden.'],
                ['Service Scope Creep', 'Published base prices can lead to "but your website said" disputes when add-on services are needed.'],
                ['Premium Positioning', 'Luxury contractors often avoid pricing to signal "if you have to ask, you can\'t afford it." Rare in home services, but valid for high-end.'],
                ['Strategic Alternative', 'Instead of full pricing, show "Starting at $X" ranges or "Get a Free Estimate" CTAs. You get the SEO benefit without the commitment.'],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-4">
                  <div className="w-4 h-4 rounded-full border-2 border-orange/50 flex-shrink-0 mt-0.5 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange" />
                  </div>
                  <div>
                    <div className="font-teko text-base font-bold text-white">{title}</div>
                    <div className="font-opensans text-white/50 text-xs leading-relaxed mt-0.5">{desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-5 rounded-lg bg-orange/10 border border-orange/20">
              <div className="font-teko text-sm font-bold text-orange mb-2">RECOMMENDATION</div>
              <p className="font-opensans text-white/60 text-xs leading-relaxed">
                Show tiered starting prices on the website (e.g., "Residential rewiring from $350"). Save detailed 
                quotes for on-site estimates. This gives you the SEO + trust benefits without the commitment risk. 
                The pricing sections on these three demo sites follow this hybrid model.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ColdCallGuide() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.call-fade'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative bg-[#060606] py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="call-fade mb-12 lg:mb-16 max-w-3xl">
          <span className="flex items-center gap-3 font-opensans text-orange text-xs uppercase tracking-[0.45em] mb-5">
            <span className="w-8 h-px bg-orange" />
            Sales Enablement
          </span>
          <h2 className="font-teko font-bold leading-[0.88] text-white" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            <span className="block">COLD CALLING</span>
            <span className="block text-orange">SCRIPTS & STRATEGY</span>
          </h2>
          <p className="font-opensans text-white/50 text-sm leading-relaxed mt-6 max-w-2xl">
            With completed portfolio sites and industry knowledge, here is the cold calling framework 
            for converting contractor prospects into paying clients.
          </p>
        </div>

        <div className="call-fade grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 lg:p-8">
              <div className="font-teko text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-orange flex items-center justify-center text-xs text-white font-bold">1</span>
                The Opener
              </div>
              <p className="font-opensans text-white/50 text-sm leading-relaxed italic mb-4">
                "Hey [Name], this is [Your Name] with Reliant AI. I built a website for [similar contractor type] 
                that's bringing in [X] calls a month — wanted to see if you're running into the same problem 
                with leads dropping off?"
              </p>
              <div className="text-xs font-opensans text-white/30">Key: Lead with their pain, not your product.</div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 lg:p-8">
              <div className="font-teko text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-orange flex items-center justify-center text-xs text-white font-bold">2</span>
                The Industry Bridge
              </div>
              <p className="font-opensans text-white/50 text-sm leading-relaxed italic mb-4">
                "Think of your website like your work van. If it broke down on the job, you'd fix it immediately 
                because it's how you get to work. Your website is the same — when it's not converting, 
                you're leaving money on the table. I specialize in making sure your digital work van is 
                running at full speed."
              </p>
              <div className="text-xs font-opensans text-white/30">Key: Speak in their metaphors. Vans, tools, crews, jobs.</div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 lg:p-8">
              <div className="font-teko text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-orange flex items-center justify-center text-xs text-white font-bold">3</span>
                The Close
              </div>
              <p className="font-opensans text-white/50 text-sm leading-relaxed italic mb-4">
                "I've got a slot open Tuesday or Thursday to walk through what I built for [similar business]. 
                No sales pitch — I'll show you the actual site and you can tell me if something like this 
                would work for your business. Which day works better?"
              </p>
              <div className="text-xs font-opensans text-white/30">Key: Assumptive close. Two options, both yes.</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 lg:p-8">
              <div className="font-teko text-lg font-bold text-white mb-4">Objection Handling</div>
              <div className="space-y-4">
                {[
                  ['"I already have a website"', '"Most contractors I talk to say the same thing. Quick question — when was the last time it brought in a new customer? If you\'re not sure, that\'s exactly what I fix."'],
                  ['"How much does it cost?"', '"Depends on what you need. Some contractors just want a landing page that ranks for emergency service. Others want a full site. I\'ll show you options — the free estimate takes 15 minutes."'],
                  ['"I don\'t have time"', '"That\'s exactly why you need this. I handle everything — content, design, SEO. You spend 30 minutes answering questions about your business, and I deliver a site that works 24/7."'],
                  ['"Can you show me examples?"', '"Absolutely — I\'ve got three sites I can pull up right now for plumbing, electrical, and HVAC. Let me share my screen, takes 60 seconds."'],
                ].map(([q, a]) => (
                  <div key={q}>
                    <div className="font-teko text-sm font-bold text-orange mb-1">{q}</div>
                    <div className="font-opensans text-white/50 text-xs leading-relaxed">{a}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 lg:p-8">
              <div className="font-teko text-lg font-bold text-white mb-4">Pro Tips</div>
              <ul className="space-y-3">
                {[
                  'Call between 7:00-8:30 AM or 5:30-7:00 PM — contractors are in the truck, not on a job.',
                  'Reference the specific trade: "I noticed you specialize in commercial electric" shows you did homework.',
                  'Use "we" language: "When we build sites for HVAC contractors, we always include seasonal service promos. Does that apply to you?"',
                  'Send a loom video walkthrough of their specific industry site after the call. Visual proof > promises.',
                  'Follow up exactly 3 days later. Day 1 is forgotten. Day 3 is "following up as promised."',
                ].map(tip => (
                  <li key={tip} className="flex gap-3 text-white/60 text-xs font-opensans leading-relaxed">
                    <div className="w-1 h-1 rounded-full bg-orange flex-shrink-0 mt-1.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.proof-fade'), { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="bg-[#0a0a0a] border-y border-white/[0.06] py-14">
      <div className="proof-fade max-w-3xl mx-auto px-8 lg:px-16">
        <p className="font-teko text-2xl lg:text-3xl text-white leading-tight tracking-wide">
          &ldquo;The license number and the Heights job note are what made the plumbing demo feel real.
          My guys kept asking who built it.&rdquo;
        </p>
        <p className="mt-5 font-opensans text-sm text-white/45">
          Ray M. <span className="text-white/25">·</span> Houston home-services contractor
        </p>
      </div>
    </div>
  );
}

export default function PortfolioShowcase() {
  const { mounted } = useTheme();

  if (!mounted) {
    return <div className="min-h-screen bg-[#060606]" />;
  }

  return (
    <SmoothScrollProvider>
      <Toaster position="top-right" richColors />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[9999] px-4 py-2 bg-orange text-white font-opensans text-sm rounded">
        Skip to main content
      </a>
      <Navigation />
      <main id="main">
        <HeroSection />
        <ProofStrip />
        <PreviewPanel />
        <IndustryInsights />
        <PricingStrategy />
        <ColdCallGuide />
        <Contact />
      </main>
    </SmoothScrollProvider>
  );
}
