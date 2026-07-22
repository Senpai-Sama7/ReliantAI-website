import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { scrollToSection } from '@/lib/scroll';
import { getLenisInstance } from '@/lib/lenis';
import { onZoneChange } from '@/lib/experienceBus';
import type { ExperienceZoneId } from '@/data/experienceZones';

// 'portfolio' is a home-page section but not an experience zone, so it never
// receives zone-driven active highlighting.
type NavSectionId = ExperienceZoneId | 'portfolio';

const NAV_ITEMS: { label: string; id: NavSectionId }[] = [
  { label: 'Work', id: 'work' },
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'Services', id: 'services' },
  { label: 'About', id: 'about' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Contact', id: 'contact' },
];

// Routes whose hero is always dark, regardless of theme — the unscrolled
// transparent nav needs light-colored links there.
const DARK_HERO_PATHS = ['/portfolio', '/showcase'];

interface NavigationProps {
  /** Force light-on-dark nav colors while unscrolled (dark hero pages). */
  darkHero?: boolean;
}

const Navigation = ({ darkHero }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ExperienceZoneId>('hero');
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const isDarkHeroPage =
    darkHero ??
    (typeof window !== 'undefined' &&
      DARK_HERO_PATHS.includes(window.location.pathname.replace(/\/+$/, '') || '/'));
  // While the mobile menu is open its own light/dark backdrop sits behind the
  // nav, so fall back to theme-driven colors.
  const onDarkSurface = isDarkHeroPage && !isScrolled && !isMobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const unsubZone = onZoneChange((zone) => setActiveSection(zone.id));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubZone();
    };
  }, []);

  // Lock page scroll while the mobile menu is open (body/html overflow + Lenis).
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    const lenis = getLenisInstance();
    lenis?.stop();

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      lenis?.start();
    };
  }, [isMobileMenuOpen]);

  // Keyboard handling while the mobile menu is open: Escape closes, Tab is
  // trapped inside the overlay. Focus moves into the menu on open and back to
  // the toggle button on close.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const menu = mobileMenuRef.current;
    const toggleButton = menuToggleRef.current;
    const getFocusable = () =>
      Array.from(
        menu?.querySelectorAll<HTMLElement>('button, [href]') ?? []
      ).filter((el) => !el.hasAttribute('disabled'));

    getFocusable()[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !menu?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !menu?.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      toggleButton?.focus();
    };
  }, [isMobileMenuOpen]);

  const handleSectionScroll = (sectionId: string, offsetY = 80) => {
    setIsMobileMenuOpen(false);
    // Sections live on the home page; from other routes, navigate there
    // instead of silently doing nothing.
    if (!document.getElementById(sectionId) && window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    scrollToSection(sectionId, offsetY);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 safe-pt ${
          isScrolled
            ? 'bg-white/95 dark:bg-black/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => handleSectionScroll('hero', 0)}
              className="flex items-center gap-2 group"
              aria-label="Reliant AI Logo"
            >
              <div className="w-10 h-10 bg-orange rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange/30">
                <span className="font-teko text-2xl font-bold text-white">R</span>
              </div>
              <span className={`font-teko text-2xl font-semibold tracking-wide hidden sm:block transition-colors duration-300 ${
                onDarkSurface ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                RELIANT AI
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionScroll(item.id)}
                  className={`relative font-opensans text-sm transition-colors duration-300 group ${
                    activeSection === item.id
                      ? 'text-orange'
                      : onDarkSurface
                        ? 'text-white/80 hover:text-white'
                        : 'text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-orange transition-all duration-300 ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              ))}
            </div>

            {/* CTA & Theme Toggle */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => handleSectionScroll('contact')}
                className="group relative px-6 py-2.5 bg-orange text-white font-opensans text-sm font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange/30"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative">Get Started</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleSectionScroll('contact'); }}
                className="touch-target inline-flex items-center justify-center min-h-11 px-4 py-2 bg-orange text-white font-opensans text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-orange/30 transition-all duration-300"
              >
                Get a Quote
              </a>
              <ThemeToggle />
              <button
                ref={menuToggleRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 min-w-11 min-h-11 flex items-center justify-center transition-transform duration-300 hover:scale-110 ${
                  onDarkSurface ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed inset-0 z-[95] bg-white/98 dark:bg-black/98 backdrop-blur-xl transition-all duration-500 lg:hidden overflow-y-auto ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-full gap-8 [@media(max-height:700px)]:gap-4 py-24">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleSectionScroll(item.id)}
              className={`font-teko text-4xl transition-all duration-300 ${
                activeSection === item.id
                  ? 'text-orange'
                  : 'text-gray-900 dark:text-white/80 hover:text-orange'
              }`}
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 0.05}s` : '0s',
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleSectionScroll('contact')}
            className="mt-8 px-8 py-3 bg-orange text-white font-opensans text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange/20 hover:scale-105"
            style={{
              transitionDelay: isMobileMenuOpen ? `${NAV_ITEMS.length * 0.05}s` : '0s',
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
