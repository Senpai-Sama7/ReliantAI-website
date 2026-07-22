import { useEffect, useState, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import IntroOverlay from './components/IntroOverlay';
import CookieConsent from './components/CookieConsent';
import FloatingCTA from './components/FloatingCTA';
import ExitIntentPopup from './components/ExitIntentPopup';
import SmoothScrollProvider from './components/SmoothScrollProvider';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import VideoShowcase from './pages/VideoShowcase';
import PortfolioShowcase from './pages/PortfolioShowcase';
import NotFound from './pages/NotFound';
import { useTheme } from './hooks/useTheme';
import { applyRouteSeo } from './lib/seo';
import { markScrollLayoutReady } from './lib/scrollLayout';
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

/** Strips trailing slashes so paths like /portfolio/ match /portfolio. */
function normalizePathname(pathname: string): string {
  const stripped = pathname.replace(/\/+$/, '');
  return stripped === '' ? '/' : stripped;
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

  if (isPrivacyPolicy) {
    return <PrivacyPolicy />;
  }

  if (isTermsOfService) {
    return <TermsOfService />;
  }

  if (isShowcase) {
    return <VideoShowcase />;
  }

  if (isPortfolio) {
    return <PortfolioShowcase />;
  }

  if (!isKnownPath) {
    return <NotFound />;
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
    </SmoothScrollProvider>
  );
}

export default App;
