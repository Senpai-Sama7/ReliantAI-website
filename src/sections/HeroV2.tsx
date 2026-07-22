import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { lazy, Suspense } from 'react';
import LogoReveal from '../components/LogoReveal';
import CountUp from '../components/CountUp';
import { prefersReducedMotion, isMobileViewport } from '@/lib/motion';
import { scrollToSection } from '@/lib/scroll';

// Lazy load 3D component to reduce initial bundle and TBT
const TorusKnot3D = lazy(() => import('../components/TorusKnot3D'));

gsap.registerPlugin(ScrollTrigger);

interface HeroV2Props {
  introComplete?: boolean;
}

export default function HeroV2({ introComplete = true }: HeroV2Props) {
  const sectionRef = useRef<HTMLElement>(null);
  // Only mount (and download) the Three.js scene on desktop viewports.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const crownRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const orbit1Ref = useRef<HTMLDivElement>(null);
  const orbit2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const setVisible = (element: HTMLElement | null) => {
        if (element) {
          element.style.transform = 'translateY(0)';
          element.style.opacity = '1';
        }
      };
      setVisible(crownRef.current);
      setVisible(bodyRef.current);
      setVisible(headlineRef.current);
      setVisible(subheadRef.current);
      setVisible(ctaRef.current);
      if (statsRef.current) {
        Array.from(statsRef.current.children).forEach((child) => {
          const el = child as HTMLElement;
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
        });
      }
      [orbit1Ref.current, orbit2Ref.current].forEach((orbit) => {
        if (orbit) {
          orbit.style.opacity = '1';
          orbit.style.transform = 'scale(1)';
        }
      });
      return;
    }

    // Start animations if introComplete is true
    if (introComplete) {
      const mobile = isMobileViewport();
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.1 });

        tl.from(
          crownRef.current,
          { y: -24, opacity: 0, duration: 1, ease: 'power3.out' }
        ).from(
          headlineRef.current,
          { y: mobile ? 40 : 80, opacity: 0, duration: mobile ? 0.9 : 1.2, ease: 'power3.out' }
        )
          .from(
            subheadRef.current,
            { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' },
            '-=0.7'
          )
          .from(
            ctaRef.current,
            { y: 30, opacity: 0, scale: 0.98, duration: 0.7, ease: 'power2.out' },
            '-=0.5'
          )
          .from(
            gsap.utils.toArray(statsRef.current?.children || []),
            {
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: 'power2.out',
            },
            '-=0.3'
          )
          .from(
            [orbit1Ref.current, orbit2Ref.current],
            { opacity: 0, scale: 0.8, duration: 1, stagger: 0.2, ease: 'power2.out' },
            '-=0.5'
          );

        gsap.to(orbit1Ref.current, {
          rotation: 360,
          duration: 30,
          ease: 'none',
          repeat: -1,
        });

        gsap.to(orbit2Ref.current, {
          rotation: -360,
          duration: 25,
          ease: 'none',
          repeat: -1,
        });

        // Desktop-only 3D exit scrub — on phones it skews the card and fights Lenis.
        if (!mobile) {
          const exitTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          });

          exitTl
            .to(
              bodyRef.current,
              {
                x: () => -window.innerWidth * 0.22,
                rotateY: -12,
                opacity: 0.35,
                scale: 0.94,
                ease: 'none',
                transformPerspective: 1200,
              },
              0
            )
            .to(
              crownRef.current,
              { y: -40, opacity: 0.15, ease: 'none' },
              0
            )
            .to(
              orbit1Ref.current,
              { x: 80, opacity: 0.2, ease: 'none' },
              0
            )
            .to(
              orbit2Ref.current,
              { x: 120, opacity: 0.15, ease: 'none' },
              0
            );
        }
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [introComplete]);

  const scrollToWorlds = () => {
    scrollToSection('worlds', 0);
  };

  // Keep these aligned with the published claims in index.html meta/FAQ (150+, 98%).
  const stats = [
    { value: 150, prefix: '', suffix: '+', label: 'Projects Delivered' },
    { value: 98, prefix: '', suffix: '%', label: 'Client Satisfaction' },
    { value: 1.5, prefix: '$', suffix: 'M+', label: 'Revenue Generated', decimals: 1 },
  ];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] w-full flex flex-col overflow-hidden bg-[#f7f7f7] dark:bg-[#0a0a0a] transition-colors duration-500"
      style={{ perspective: '1200px' }}
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f7f7f7] dark:to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[55%] h-[85%] bg-gradient-to-l from-orange/10 via-orange/5 to-transparent dark:from-orange/20 dark:via-orange/10 rounded-full blur-3xl" />
      </div>

      {/* 3D TorusKnot - desktop only, lazy loaded to reduce TBT */}
      {isDesktop && (
        <Suspense fallback={<div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60%] h-[80%] hidden lg:block" />}>
          <TorusKnot3D />
        </Suspense>
      )}

      {/* Spinning Double Orbit Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Outer orbit — hidden on the smallest screens, viewport-capped elsewhere */}
        <div 
          ref={orbit1Ref}
          className="hidden sm:block absolute w-[min(600px,90vw)] h-[min(600px,90vw)] lg:w-[800px] lg:h-[800px] opacity-0"
        >
          <div className="absolute inset-0 border border-orange/20 rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange/60 rounded-full blur-sm" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-orange/40 rounded-full blur-sm" />
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-orange/50 rounded-full blur-sm" />
        </div>
        
        {/* Inner orbit */}
        <div 
          ref={orbit2Ref}
          className="absolute w-[min(400px,85vw)] h-[min(400px,85vw)] lg:w-[500px] lg:h-[500px] opacity-0"
        >
          <div className="absolute inset-0 border border-orange/30 rounded-full" />
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange/70 rounded-full blur-sm" />
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange/50 rounded-full blur-sm" />
        </div>
      </div>

      {/* Floating decorative props — toned down on phones */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        <div 
          className="absolute top-[20%] left-[10%] w-24 h-24 border border-orange/20 rounded-full opacity-60"
          style={{ animation: 'heroFloat 8s ease-in-out infinite' }}
        />
        <div 
          className="absolute top-[30%] right-[15%] w-16 h-16 bg-orange/10 rounded-lg rotate-45 opacity-40"
          style={{ animation: 'heroFloat 10s ease-in-out infinite reverse' }}
        />
        <div 
          className="absolute bottom-[35%] left-[20%] w-32 h-1 bg-gradient-to-r from-transparent via-orange/30 to-transparent"
          style={{ animation: 'heroFloat 9s ease-in-out infinite' }}
        />
        <div 
          className="absolute bottom-[25%] right-[10%] w-20 h-20 border border-gray-300 dark:border-white/10 rounded-full opacity-30"
          style={{ animation: 'heroFloat 12s ease-in-out infinite' }}
        />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,110,0,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,110,0,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Crown header — LogoReveal typewriter + style cycle after intro */}
      {introComplete && (
        <header
          ref={crownRef}
          className="relative z-30 w-full pt-24 sm:pt-32 lg:pt-36 pb-2 sm:pb-4 lg:pb-6 text-center px-5 sm:px-6"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8 opacity-80">
            <span className="hidden sm:block w-10 lg:w-16 h-px bg-gradient-to-r from-transparent to-orange/60" />
            <span className="font-opensans text-orange text-[10px] sm:text-xs uppercase tracking-[0.35em] sm:tracking-[0.55em]">
              Boutique Digital Craftsmanship
            </span>
            <span className="hidden sm:block w-10 lg:w-16 h-px bg-gradient-to-l from-transparent to-orange/60" />
          </div>
          <LogoReveal />
        </header>
      )}

      {/* Main hero body — value prop one tier below the crown */}
      <div
        ref={bodyRef}
        className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-6 max-w-5xl mx-auto pb-16 sm:pb-20 lg:pb-24"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <h1 className="sr-only">
          Reliant AI — Luxury Web Design Redefined for Houston Businesses
        </h1>

        {/* Display headline (visual tier 2) */}
        <h2
          ref={headlineRef}
          className="font-teko text-[2.75rem] leading-[0.88] sm:text-6xl sm:leading-[0.85] md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-5 sm:mb-8"
          aria-hidden="true"
        >
          <span className="block text-gray-900 dark:text-white">
            LUXURY WEB
          </span>
          <span className="block text-orange">
            DESIGN
          </span>
          <span className="block text-gray-500 dark:text-white/40 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light mt-1 sm:mt-2">
            REDEFINED
          </span>
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadRef}
          className="font-opensans text-base sm:text-xl text-gray-700 dark:text-white/70 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed"
        >
          We craft conversion-focused digital experiences for Houston's 
          most ambitious businesses. No templates. No compromises.
        </p>

        {/* CTA - subtle hover effects */}
        <div ref={ctaRef}>
          <button
            onClick={scrollToWorlds}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-opensans font-semibold rounded-full overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-orange/10"
          >
            {/* Subtle shine effect on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {/* Glow effect */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-orange/0 via-orange/5 to-orange/0" />
            
            <span className="relative transform group-hover:scale-[1.02] transition-transform duration-300">See Our Work</span>
            <ArrowDown 
              size={18} 
              className="relative transform group-hover:translate-y-0.5 transition-transform duration-300" 
            />
          </button>
        </div>

        {/* Stats — below the first-screen fold on short phones so the hero stays one composition */}
        <div className="mt-12 sm:mt-20 pt-8 sm:pt-12 border-t border-gray-200 dark:border-white/10 w-full max-w-lg sm:max-w-none">
          <div ref={statsRef} className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-16">
            {stats.map((stat, i) => (
              <div key={i} className="text-center min-w-0">
                <div className="font-teko text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-none">
                  <CountUp 
                    end={stat.value} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                    duration={2.5}
                  />
                </div>
                <div className="font-opensans text-[10px] sm:text-xs uppercase tracking-[0.08em] sm:tracking-[0.15em] text-gray-500 dark:text-white/40 mt-1 leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint — desktop / tall viewports only */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-gray-400 dark:text-white/30">
        <span className="font-opensans text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-current to-transparent" />
      </div>

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
      `}</style>
    </section>
  );
}
