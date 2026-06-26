import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, BadgeCheck } from 'lucide-react';
import CountUp from '../components/CountUp';
import { revealFrom } from '@/lib/reveal';
import { isMobileViewport, prefersReducedMotion } from '@/lib/motion';
import { useIntroAnimations } from '@/hooks/useIntroAnimations';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    quote: "Reliant AI transformed our online presence completely. Within three months of launching our new website, we saw a 340% increase in quote requests. Their understanding of the metal fabrication industry is unmatched.",
    author: 'Michael Torres',
    role: 'CEO',
    company: 'Richardson Metal Works',
    industry: 'Metal Fabrication',
    rating: 5,
    verified: true,
    metric: '+340%',
    metricLabel: 'Lead increase',
  },
  {
    id: 2,
    quote: "Working with Reliant AI was a game-changer. They understood our HIPAA requirements and built a patient-friendly website that has significantly reduced our front-desk call volume by 40%. Online booking is now 60% of our appointments.",
    author: 'Sarah Chen',
    role: 'Practice Manager',
    company: 'Westside Medical Group',
    industry: 'Healthcare',
    rating: 5,
    verified: true,
    metric: '-40%',
    metricLabel: 'Call volume',
  },
  {
    id: 3,
    quote: "The team at Reliant AI delivered beyond our expectations. Our new website not only looks professional but actually brings in qualified leads. The monthly retainer keeps everything running smoothly—we've never had a single technical issue.",
    author: 'David Martinez',
    role: 'Operations Director',
    company: 'Martinez HVAC Services',
    industry: 'Home Services',
    rating: 5,
    verified: true,
    metric: '60%',
    metricLabel: 'Online bookings',
  },
];

const clientLogos = [
  'Richardson Metal',
  'Westside Medical',
  'Martinez HVAC',
  'Houston Oil Airs',
  'Texas Fabrication',
  'Premier Services',
];

interface TestimonialsV2Props {
  introComplete?: boolean;
}

export default function TestimonialsV2({ introComplete = true }: TestimonialsV2Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);

  useIntroAnimations(
    introComplete,
    () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
      ctxRef.current?.revert();
      ctxRef.current = null;

      const section = sectionRef.current;
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!section || !pin || !track) return;

      const reduced = prefersReducedMotion();
      const mobile = isMobileViewport();

      ctxRef.current = gsap.context(() => {
        const headerTween = revealFrom(headerRef.current, '.reveal-item', {
          y: 40,
          duration: 0.8,
          stagger: 0.1,
          start: 'top 88%',
        });
        if (headerTween) triggersRef.current.push(headerTween);

        const cards = gsap.utils.toArray<HTMLElement>('.testi-card', track);
        if (cards.length === 0) return;

        if (reduced || mobile) {
          gsap.set(track, { x: 0, clearProps: 'transform' });
          cards.forEach((card) => gsap.set(card, { opacity: 1, rotateY: 0, scale: 1, clearProps: 'transform' }));
        } else {
          const scrollAmount = Math.max(0, track.scrollWidth - window.innerWidth);

          const pinTrigger = ScrollTrigger.create({
            trigger: pin,
            start: 'top top',
            end: () => `+=${scrollAmount}`,
            pin: pin,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const x = -scrollAmount * self.progress;
              gsap.set(track, { x });

              const viewportCenter = window.innerWidth * 0.5;
              cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const dist = (rect.left + rect.width * 0.5 - viewportCenter) / window.innerWidth;
                const abs = Math.abs(dist);
                gsap.set(card, {
                  rotateY: dist * -18,
                  scale: 1 - abs * 0.06,
                  opacity: 1 - abs * 0.15,
                  transformPerspective: 1000,
                });

                const quote = card.querySelector('.parallax-quote') as HTMLElement | null;
                const metric = card.querySelector('.parallax-metric') as HTMLElement | null;
                if (quote) gsap.set(quote, { y: -24 * self.progress });
                if (metric) gsap.set(metric, { y: 16 * self.progress });
              });
            },
          });
          triggersRef.current.push(pinTrigger);
        }

        const logosTween = revealFrom(logosRef.current, '.logo-item', {
          y: 20,
          duration: 0.5,
          stagger: 0.08,
          start: 'top 92%',
        });
        if (logosTween) triggersRef.current.push(logosTween);
      }, section);

      return () => {
        triggersRef.current.forEach((t) => t.kill());
        triggersRef.current = [];
        ctxRef.current?.revert();
        ctxRef.current = null;
      };
    },
    []
  );

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative bg-[#0a0a0a] text-white overflow-hidden"
      aria-label="Client testimonials"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/5 rounded-full blur-3xl" />
      </div>

      <div ref={pinRef} className="relative z-10 h-screen flex flex-col justify-center">
        <div ref={headerRef} className="text-center mb-12 px-6 pt-16">
          <span className="reveal-item text-xs uppercase tracking-[0.3em] text-white/40 font-opensans block mb-4">
            Client Results
          </span>
          <h2 className="reveal-item font-teko text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9]">
            PROVEN
            <span className="text-orange"> RESULTS</span>
          </h2>
        </div>

        <div
          ref={trackRef}
          className="flex items-center gap-8 px-[10vw] will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="testi-card flex-shrink-0 w-[85vw] sm:w-[70vw] lg:w-[55vw] bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12 relative"
            >
              <div className="parallax-quote absolute -top-6 left-8 lg:left-12">
                <div className="w-12 h-12 bg-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange/30">
                  <Quote size={24} className="text-white" />
                </div>
              </div>

              <div className="pt-4">
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-orange fill-orange" />
                  ))}
                </div>

                <blockquote className="font-opensans text-xl lg:text-2xl text-white/90 leading-relaxed mb-8">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange to-orange-600 rounded-full flex items-center justify-center font-teko text-2xl font-bold">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-teko text-xl font-bold">{t.author}</span>
                        {t.verified && <BadgeCheck size={18} className="text-blue-400" />}
                      </div>
                      <div className="text-sm text-white/50">
                        {t.role}, {t.company}
                      </div>
                      <div className="text-xs text-orange mt-1">{t.industry}</div>
                    </div>
                  </div>

                  <div className="parallax-metric inline-flex flex-col items-start sm:items-end gap-1 px-4 py-3 bg-orange/10 border border-orange/30 rounded-xl min-w-[100px]">
                    <span className="text-2xl font-teko font-bold text-orange">
                      <CountUp end={t.metric} duration={1.5} />
                    </span>
                    <span className="text-xs font-opensans text-white/50 text-right">{t.metricLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div ref={logosRef} className="relative z-10 pb-24 px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-white/30 font-opensans mb-8">
          Trusted by Industry Leaders
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
          {clientLogos.map((logo, i) => (
            <div
              key={i}
              className="logo-item font-teko text-xl lg:text-2xl text-white/20 transition-all duration-300 hover:text-white/50 cursor-default"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
