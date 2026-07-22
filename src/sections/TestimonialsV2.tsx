import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';
import CountUp from '../components/CountUp';
import { revealFrom } from '@/lib/reveal';
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
    metric: '60%',
    metricLabel: 'Online bookings',
  },
];

interface TestimonialsV2Props {
  introComplete?: boolean;
}

export default function TestimonialsV2({ introComplete = true }: TestimonialsV2Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
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
      if (!section) return;

      ctxRef.current = gsap.context(() => {
        const headerTween = revealFrom(headerRef.current, '.reveal-item', {
          y: 40,
          duration: 0.8,
          stagger: 0.1,
          start: 'top 88%',
        });
        if (headerTween) triggersRef.current.push(headerTween);

        const cards = gsap.utils.toArray<HTMLElement>('.testi-card', listRef.current ?? section);
        cards.forEach((card) => {
          const cardTween = revealFrom(card, card, {
            y: 40,
            duration: 0.7,
            start: 'top 88%',
          });
          if (cardTween) triggersRef.current.push(cardTween);
        });
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
      className="relative bg-[#0a0a0a] text-white overflow-hidden py-24 lg:py-32"
      aria-label="Client testimonials"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        <div ref={headerRef} className="text-center mb-16 lg:mb-20">
          <span className="reveal-item text-xs uppercase tracking-[0.3em] text-white/50 font-opensans block mb-4">
            Client Results
          </span>
          <h2 className="reveal-item font-teko text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9]">
            PROVEN
            <span className="text-orange"> RESULTS</span>
          </h2>
        </div>

        <div ref={listRef} className="space-y-12 lg:space-y-16">
          {testimonials.map((t, i) => (
            <article
              key={t.id}
              className="testi-card relative border-t border-white/10 pt-10 lg:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-teko text-3xl text-orange/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Quote size={18} className="text-orange" aria-hidden="true" />
                  <span className="font-opensans text-xs uppercase tracking-[0.2em] text-white/50">
                    {t.industry}
                  </span>
                </div>

                <blockquote className="font-opensans text-xl lg:text-2xl text-white/90 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange to-orange-600 rounded-full flex items-center justify-center font-teko text-xl font-bold">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-teko text-xl font-bold">{t.author}</div>
                    <div className="text-sm text-white/60">
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end items-start">
                <div className="inline-flex flex-col gap-1 px-5 py-4 bg-orange/10 border border-orange/30 rounded-xl min-w-[120px]">
                  <span className="text-3xl font-teko font-bold text-orange">
                    <CountUp end={t.metric} duration={1.5} />
                  </span>
                  <span className="text-xs font-opensans text-white/60">{t.metricLabel}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
