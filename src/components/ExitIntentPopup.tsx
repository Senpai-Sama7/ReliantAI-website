import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { usePopupTrigger } from '../hooks/usePopupTrigger';
import { submitToWeb3Forms, Web3FormsConfigError } from '../lib/web3forms';

const emailSchema = z.string().email('Please enter a valid email address');

const AUDIT_BENEFITS = [
  '100% free — no credit card required.',
  'A prioritized list of what to fix first.',
  'Includes 3 quick fixes you can do today.',
];

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { canShow, markDismissed } = usePopupTrigger({ popupType: 'exit' });

  useEffect(() => {
    if (!canShow) return;

    // Only real exit intent: the mouse leaving through the top of the
    // viewport. No timers, no scroll-depth auto-open (touch devices never
    // see this popup).
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10) setShow(true);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [canShow]);

  const handleClose = useCallback(() => {
    setShow(false);
    markDismissed();
  }, [markDismissed]);

  // Escape to close + basic focus trap while the dialog is open.
  useEffect(() => {
    if (!show) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'));

    getFocusable()[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [show, handleClose]);

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
    } catch (error) {
      if (error instanceof Web3FormsConfigError) {
        toast.error('Form is temporarily unavailable. Call (832) 947-7028 instead.');
      } else {
        toast.error('Something went wrong. Please try again or call (832) 947-7028.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-popup-title"
        className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-white dark:bg-dark-100 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
      >
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
          <span className="relative z-10 inline-block font-opensans text-white/90 text-xs uppercase tracking-[0.35em] mb-2">
            Free Website Audit
          </span>
          <h3 id="exit-popup-title" className="font-teko text-3xl font-bold text-white relative z-10">
            BEFORE YOU GO...
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
                Thanks — we'll be in touch with your audit results soon. (Check spam if you don't hear from us.)
              </p>
            </div>
          ) : (
            <>
              <h4 className="font-teko text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Get Your Free Website Audit
              </h4>
              <p className="font-opensans text-gray-600 dark:text-white/70 text-sm mb-4">
                We'll review your current site and show you where it's costing you leads — and how to fix it.
              </p>

              <ul className="space-y-2 mb-5">
                {AUDIT_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/70 font-opensans">
                    <span className="w-4 h-px bg-orange flex-shrink-0" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="exit-popup-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="exit-popup-email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    required
                    aria-invalid={emailError ? true : undefined}
                    aria-describedby={emailError ? 'exit-popup-email-error' : undefined}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-black/50 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none transition-colors ${
                      emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10 focus:border-orange'
                    }`}
                  />
                  {emailError && (
                    <p id="exit-popup-email-error" className="mt-1 text-xs text-red-500 font-opensans" role="alert">{emailError}</p>
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

              <button
                onClick={handleClose}
                className="w-full mt-3 font-opensans text-sm text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
              >
                No thanks
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
