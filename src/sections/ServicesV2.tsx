import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { revealFrom } from '@/lib/reveal';
import { scrollToSection } from '@/lib/scroll';
import { useIntroAnimations } from '@/hooks/useIntroAnimations';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: '01',
    title: 'Custom Development',
    outcome:
      'Hand-coded React and TypeScript sites that hold 90+ PageSpeed scores. No page builders, no plugin bloat — every page is built to turn visitors into quote requests.',
    features: ['React/TypeScript', 'Headless CMS', 'API Integration', 'Performance Tuning'],
  },
  {
    number: '02',
    title: 'Brand Identity',
    outcome:
      'A visual system customers recognize on your site, your trucks, and your proposals. Logo refinement, type and color standards, and asset libraries your team can actually use.',
    features: ['Visual Identity', 'Brand Guidelines', 'Asset Libraries', 'Style Systems'],
  },
  {
    number: '03',
    title: 'Growth Strategy',
    outcome:
      'SEO and conversion work measured by one number: qualified leads. Analytics wired up so you can see which pages bring in calls and which need attention.',
    features: ['SEO Optimization', 'Conversion Design', 'Analytics Setup', 'A/B Testing'],
  },
  {
    number: '04',
    title: '3D & Motion',
    outcome:
      'Product configurators and 3D showcases that let buyers inspect your equipment and work before they call. Used where it earns attention, skipped where it would slow the page.',
    features: ['Three.js/WebGL', '3D Configurators', 'Motion Design', 'Interactive Elements'],
  },
];

interface ServicesV2Props {
  introComplete?: boolean;
}

export default function ServicesV2({ introComplete = true }: ServicesV2Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);

  useIntroAnimations(
    introComplete,
    () => {
      ctxRef.current?.revert();
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];

      const ctx = gsap.context(() => {
        const headerTween = revealFrom(headerRef.current, '.reveal-item', {
          y: 40,
          duration: 0.8,
          stagger: 0.1,
          start: 'top 88%',
        });
        if (headerTween) triggersRef.current.push(headerTween);

        const items = gsap.utils.toArray<HTMLElement>('[data-service-item]');
        items.forEach((item) => {
          const elementsTween = revealFrom(item, item.querySelectorAll('.service-reveal'), {
            y: 30,
            duration: 0.5,
            stagger: 0.06,
            start: 'top 88%',
          });
          if (elementsTween) triggersRef.current.push(elementsTween);
        });
      }, sectionRef);

      ctxRef.current = ctx;

      return () => {
        ctx.revert();
        triggersRef.current.forEach((t) => t.kill());
        triggersRef.current = [];
        ctxRef.current = null;
      };
    },
    []
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-40 bg-[#f7f7f7] dark:bg-[#0a0a0a] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 lg:mb-20">
          <span className="reveal-item text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-white/50 font-opensans block mb-4">
            Our Services
          </span>
          <h2 className="reveal-item font-teko text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[0.9]">
            WHAT WE
            <span className="text-orange"> DO</span>
          </h2>
        </div>

        {/* Indexed service rows */}
        <div className="border-t border-gray-200 dark:border-white/10">
          {services.map((service) => (
            <div
              key={service.number}
              data-service-item
              className="group relative grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 py-10 lg:py-14 border-b border-gray-200 dark:border-white/10"
            >
              {/* Index number */}
              <div className="lg:col-span-2">
                <span className="service-reveal block font-teko text-5xl lg:text-6xl font-bold text-gray-300 dark:text-white/15 group-hover:text-orange transition-colors duration-500 leading-none">
                  {service.number}
                </span>
              </div>

              {/* Title + outcome */}
              <div className="lg:col-span-6">
                <h3 className="service-reveal font-teko text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="service-reveal font-opensans text-gray-600 dark:text-white/60 leading-relaxed max-w-xl">
                  {service.outcome}
                </p>
              </div>

              {/* Features + link */}
              <div className="lg:col-span-4 flex flex-col lg:items-end gap-6">
                <div className="service-reveal flex flex-wrap lg:justify-end gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 text-xs font-opensans text-gray-500 dark:text-white/50 bg-gray-100 dark:bg-white/5 rounded-full transition-all duration-300 group-hover:bg-orange/10 group-hover:text-orange"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="service-reveal inline-flex items-center gap-2 text-sm font-opensans font-semibold text-gray-900 dark:text-white transition-colors duration-300 hover:text-orange group-hover:text-orange"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                >
                  <span className="relative">
                    Learn more
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-orange group-hover:w-full transition-all duration-300" />
                  </span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
