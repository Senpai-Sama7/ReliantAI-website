import { useState, useEffect } from 'react';
import { X, Gift, Check, Shield, Clock, Zap, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { usePopupTrigger } from '../hooks/usePopupTrigger';
import { submitToWeb3Forms } from '../lib/web3forms';

const emailSchema = z.string().email('Please enter a valid email address');

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { canShow, markDismissed } = usePopupTrigger({ popupType: 'exit' });

  useEffect(() => {
    if (!canShow) return;

    // Exit intent (mouse leaves viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10) setShow(true);
    };

    // 10s timer
    const timer = setTimeout(() => setShow(true), 10000);

    // Scroll past halfway of case studies section
    const handleScroll = () => {
      const stories = document.querySelector('[aria-label="Pinned case studies"]');
      if (!stories) return;
      const rect = stories.getBoundingClientRect();
      const halfway = rect.top + rect.height / 2;
      if (halfway < 0) {
        setShow(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [canShow]);

  const handleClose = () => {
    setShow(false);
    markDismissed();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      return;
    }
    setEmailError('');
    setIsSubmitting(true);
    try {
      await submitToWeb3Forms({
        subject: 'Exit Intent - Free Website Audit Request',
        email,
      });
      setSubmitted(true);
      markDismissed();
      setTimeout(() => setShow(false), 2000);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-white dark:bg-dark-100 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute top-2 right-2 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-orange to-orange-600 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <Gift className="w-12 h-12 text-white mx-auto mb-3 relative z-10" />
          <h3 className="font-teko text-3xl font-bold text-white relative z-10">
            WAIT! BEFORE YOU GO...
          </h3>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-white" />
              </div>
              <h4 className="font-teko text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Check Your Email!
              </h4>
              <p className="font-opensans text-gray-600 dark:text-white/70">
                Your free audit report is on its way. (Check spam if you don't see it in 5 minutes)
              </p>
            </div>
          ) : (
            <>
              <h4 className="font-teko text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Get Your Free Website Audit
              </h4>
              <p className="font-opensans text-gray-600 dark:text-white/70 text-sm mb-4">
                We'll analyze your current site and show you exactly how many leads you're losing—and how to fix it.
              </p>

              {/* Risk Reversal Stack */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                  <Shield size={16} className="text-green-500 flex-shrink-0" />
                  <span>100% Free. No credit card required.</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                  <Clock size={16} className="text-green-500 flex-shrink-0" />
                  <span>Results delivered in 24 hours.</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                  <Zap size={16} className="text-green-500 flex-shrink-0" />
                  <span>Includes 3 quick fixes you can do today.</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    required
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-black/50 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none transition-colors ${
                      emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10 focus:border-orange'
                    }`}
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-500 font-opensans">{emailError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-orange text-white font-opensans font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" />Sending...</>
                  ) : (
                    'Yes, Audit My Website'
                  )}
                </button>
              </form>

              {/* Secondary CTA with Loss Aversion */}
              <button
                onClick={handleClose}
                className="w-full mt-3 font-opensans text-sm text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
              >
                No thanks, I'll keep losing leads
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
