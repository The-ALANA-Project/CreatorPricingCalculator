import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

export function CookieBanner() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setTimeout(() => setIsVisible(true), 2500);
    } else if (cookieConsent === "accepted") {
      enableGoogleAnalytics();
    }
  }, []);

  const enableGoogleAnalytics = () => {
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const disableGoogleAnalytics = () => {
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    enableGoogleAnalytics();
    closeWithAnimation();
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    disableGoogleAnalytics();
    closeWithAnimation();
  };

  const handleClose = () => {
    closeWithAnimation();
  };

  const closeWithAnimation = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimatingOut(false);
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 ${
        isAnimatingOut
          ? "translate-y-full transition-transform duration-[400ms] ease-in"
          : "translate-y-0 transition-transform duration-500 ease-out"
      }`}
      style={{
        /* start off-screen, CSS transition brings it in */
      }}
    >
      <div
        className="bg-[#131718] border-t border-[#FEE6EA] backdrop-blur-xl"
        style={{
          boxShadow:
            "0 -8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(254, 230, 234, 0.08)",
        }}
      >
        <div
          className="max-w-6xl mx-auto py-4 px-6"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
            {/* Text block + mobile X wrapper */}
            <div className="flex items-start justify-between gap-3 md:contents">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#FEE6EA] mb-1">
                  {t.cookie.title}
                </p>
                <p className="text-xs leading-relaxed text-[#FEE6EA]/70">
                  {t.cookie.desc}{" "}
                  <a
                    href="https://policies.google.com/technologies/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#FEE6EA] transition-colors"
                  >
                    {t.cookie.learnMore}
                  </a>
                </p>
              </div>

              {/* Mobile X button */}
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full text-[#FEE6EA] hover:bg-white/10 transition-colors shrink-0 md:hidden"
                aria-label="Close cookie banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Button group */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleDecline}
                className="flex-1 md:flex-none py-2 px-5 text-xs font-medium rounded-lg border border-[#FEE6EA] bg-[#131718] text-[#FEE6EA] hover:bg-[#FEE6EA] hover:text-[#131718] transition-all whitespace-nowrap"
              >
                {t.cookie.decline}
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none py-2 px-5 text-xs font-medium rounded-lg border border-[#FEE6EA] bg-[#FEE6EA] text-[#131718] hover:bg-[#131718] hover:text-[#FEE6EA] transition-all whitespace-nowrap"
              >
                {t.cookie.accept}
              </button>

              {/* Desktop X button */}
              <button
                onClick={handleClose}
                className="hidden md:block p-2 rounded-full text-[#FEE6EA] hover:bg-white/10 transition-colors ml-2"
                aria-label="Close cookie banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}