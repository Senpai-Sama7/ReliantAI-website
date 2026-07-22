import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { hasConsentChoice } from '@/lib/consent';

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
  const [consentReady, setConsentReady] = useState(() =>
    typeof document !== 'undefined' ? hasConsentChoice() : true,
  );

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    const syncConsent = () => setConsentReady(hasConsentChoice());
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('storage', syncConsent);
    const id = window.setInterval(syncConsent, 1500);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', syncConsent);
      window.clearInterval(id);
    };
  }, []);

  if (!visible || !consentReady) return null;

  return (
    <a
      href="tel:+18329477028"
      className="fixed z-50 safe-bottom safe-right flex items-center gap-2 min-h-11 px-5 py-3.5 bg-orange text-white font-opensans font-semibold shadow-lg shadow-orange/30 hover:bg-orange-600 transition-colors duration-150 animate-in slide-in-from-bottom-4 rounded-full sm:rounded-none"
      aria-label="Call for a free consultation"
    >
      <Phone size={18} aria-hidden />
      <span className="hidden sm:inline">Free Consultation</span>
    </a>
  );
};

export default FloatingCTA;
