import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    } else if (cookieConsent === "accepted") {
      // Enable Google Analytics if previously accepted
      enableGoogleAnalytics();
    }
  }, []);

  const enableGoogleAnalytics = () => {
    // Enable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };

  const disableGoogleAnalytics = () => {
    // Disable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
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

  const closeWithAnimation = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimatingOut(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${
        isAnimatingOut ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="backdrop-blur-xl bg-primary border-t border-primary/20 shadow-[0_-4px_16px_0_rgba(0,0,0,0.1)] bg-[#131718]">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Text Content */}
            <div className="flex-1 pr-0 sm:pr-4">
              <p className="text-xs text-[#FEE6EA]/90">
                This site uses Google Analytics and saves your calculator data locally. No personal information is collected.{' '}
                <a 
                  href="https://policies.google.com/technologies/cookies" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-[#FEE6EA] transition-colors"
                >
                  Learn more
                </a>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
              <Button
                onClick={handleDecline}
                variant="ghost"
                size="sm"
                className="flex-1 sm:flex-initial text-[#FEE6EA] hover:bg-[#FEE6EA]/10 text-xs h-8"
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex-1 sm:flex-initial bg-[#FEE6EA] text-[#131718] hover:bg-[#FEE6EA]/90 text-xs h-8"
              >
                Accept
              </Button>
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