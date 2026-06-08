import { useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import IntroOverlay from './components/IntroOverlay';
import CookieConsent from './components/CookieConsent';
import FloatingCTA from './components/FloatingCTA';
import ExitIntentPopup from './components/ExitIntentPopup';
import SocialProofToast from './components/SocialProofToast';
import SmoothScrollProvider from './components/SmoothScrollProvider';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import VideoShowcase from './pages/VideoShowcase';
import NotFound from './pages/NotFound';
import { useTheme } from './hooks/useTheme';
import { applyRouteSeo } from './lib/seo';
import { Toaster } from 'sonner';
import './App.css';

import HeroV2 from './sections/HeroV2';
import ScenePortal from './components/ScenePortal';
import ExperienceZoneTracker from './components/immersive/ExperienceZoneTracker';
import ImmersiveAtmosphere from './components/immersive/ImmersiveAtmosphere';
import ZoneHud from './components/immersive/ZoneHud';
import PinnedStory from './sections/PinnedStory';
import ServicesV2 from './sections/ServicesV2';
import TestimonialsV2 from './sections/TestimonialsV2';
import About from './sections/About';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';

import { caseStudyChapters } from './data/chapters';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useTheme();
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroComplete(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const path = window.location.pathname;
  const isPrivacyPolicy = path === '/privacy-policy';
  const isTermsOfService = path === '/terms-of-service';
  const isShowcase = path === '/showcase';
  const isKnownPath = path === '/' || isPrivacyPolicy || isTermsOfService || isShowcase;
  const isStandalonePage = isPrivacyPolicy || isTermsOfService || isShowcase;

  useEffect(() => {
    applyRouteSeo(window.location.pathname);
  }, []);

  useEffect(() => {
    if (isStandalonePage || !introComplete) return;

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    const t1 = setTimeout(refresh, 500);
    const t2 = setTimeout(refresh, 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
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
      <SocialProofToast />
      <CookieConsent ready={introComplete} />
      <Toaster position="top-right" richColors />

      {introComplete && <ImmersiveAtmosphere />}
      {introComplete && <ZoneHud />}
      <div id="zone-announcer" className="sr-only" aria-live="polite" aria-atomic="true" />
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
