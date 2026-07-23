import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import IntroOverlay from './components/IntroOverlay';
import CookieConsent from './components/CookieConsent';
import FloatingCTA from './components/FloatingCTA';
import ExitIntentPopup from './components/ExitIntentPopup';
import SmoothScrollProvider from './components/SmoothScrollProvider';
import { useTheme } from './hooks/useTheme';
import { applyRouteSeo } from './lib/seo';
import { markScrollLayoutReady } from './lib/scrollLayout';
import { scrollToSection } from './lib/scroll';
import { INTRO_LAYOUT_SETTLE_MS } from './hooks/useIntroAnimations';
import { Toaster } from 'sonner';
import './App.css';

import HeroV2 from './sections/HeroV2';
import ScenePortal from './components/ScenePortal';
import ExperienceZoneTracker from './components/immersive/ExperienceZoneTracker';
import ImmersiveAtmosphere from './components/immersive/ImmersiveAtmosphere';
import ZoneHud from './components/immersive/ZoneHud';
import PinnedStory from './sections/PinnedStory';
import PortfolioSection from './sections/PortfolioSection';
import ServicesV2 from './sections/ServicesV2';
import TestimonialsV2 from './sections/TestimonialsV2';
import About from './sections/About';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';

import { caseStudyChapters } from './data/chapters';

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const VideoShowcase = lazy(() => import('./pages/VideoShowcase'));
const PortfolioShowcase = lazy(() => import('./pages/PortfolioShowcase'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Strips trailing slashes so paths like /portfolio/ match /portfolio. */
function normalizePathname(pathname: string): string {
  const stripped = pathname.replace(/\/+$/, '');
  return stripped === '' ? '/' : stripped;
}

function RouteFallback() {
  return (
    <div
      className="min-h-screen bg-[#f7f7f7] dark:bg-[#0a0a0a] flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <span className="font-opensans text-sm text-gray-500 dark:text-white/50 tracking-widest uppercase">
        Loading…
      </span>
    </div>
  );
}

function App() {
  useTheme();
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  const path = normalizePathname(window.location.pathname);
  const isPrivacyPolicy = path === '/privacy-policy';
  const isTermsOfService = path === '/terms-of-service';
  const isShowcase = path === '/showcase';
  const isPortfolio = path === '/portfolio';
  const isKnownPath = path === '/' || isPrivacyPolicy || isTermsOfService || isShowcase || isPortfolio;
  const isStandalonePage = isPrivacyPolicy || isTermsOfService || isShowcase || isPortfolio;

  useEffect(() => {
    applyRouteSeo(path);
  }, [path]);

  useEffect(() => {
    if (isStandalonePage || !introComplete) return;

    const layoutTimer = window.setTimeout(() => {
      markScrollLayoutReady();
    }, INTRO_LAYOUT_SETTLE_MS + 400);

    return () => window.clearTimeout(layoutTimer);
  }, [isStandalonePage, introComplete]);

  // Honor /#section deep links after intro + layout settle (nav from other routes uses this).
  useEffect(() => {
    if (isStandalonePage || !introComplete) return;

    const raw = window.location.hash.replace(/^#/, '').trim();
    if (!raw) return;

    const timer = window.setTimeout(() => {
      scrollToSection(raw, raw === 'hero' ? 0 : 80);
    }, INTRO_LAYOUT_SETTLE_MS + 550);

    return () => window.clearTimeout(timer);
  }, [isStandalonePage, introComplete]);

  if (isPrivacyPolicy) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <PrivacyPolicy />
      </Suspense>
    );
  }

  if (isTermsOfService) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <TermsOfService />
      </Suspense>
    );
  }

  if (isShowcase) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <VideoShowcase />
      </Suspense>
    );
  }

  if (isPortfolio) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <PortfolioShowcase />
      </Suspense>
    );
  }

  if (!isKnownPath) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <NotFound />
      </Suspense>
    );
  }

  return (
    <SmoothScrollProvider>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      {!introComplete && <IntroOverlay onComplete={handleIntroComplete} />}
      <FloatingCTA />
      <ExitIntentPopup />
      <CookieConsent ready={introComplete} />
      <Toaster position="bottom-center" richColors offset="calc(1.5rem + env(safe-area-inset-bottom, 0px))" />

      {introComplete && <ImmersiveAtmosphere />}
      {introComplete && <ZoneHud />}
      <ExperienceZoneTracker enabled={introComplete} />

      <div className="relative min-h-screen bg-[#f7f7f7] dark:bg-[#0a0a0a] text-gray-900 dark:text-white overflow-x-hidden">
        <Navigation />

        <ErrorBoundary fallbackLabel="Scroll story modules will reload safely.">
          <main id="main" role="main" aria-label="Primary content">
            <HeroV2 introComplete={introComplete} />
            <ScenePortal id="worlds" introComplete={introComplete} />

            <section id="work" aria-label="Case studies overview">
              <PinnedStory chapters={caseStudyChapters} introComplete={introComplete} />
            </section>

            <PortfolioSection />

            <ServicesV2 introComplete={introComplete} />
            <TestimonialsV2 introComplete={introComplete} />
            <About introComplete={introComplete} />
            <FAQ introComplete={introComplete} />
            <Contact introComplete={introComplete} />
          </main>
        </ErrorBoundary>
      </div>
      <Analytics />
    </SmoothScrollProvider>
  );
}

export default App;
