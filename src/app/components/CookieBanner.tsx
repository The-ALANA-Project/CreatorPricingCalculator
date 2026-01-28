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
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 transition-transform duration-300 ease-out ${
        isAnimatingOut ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="backdrop-blur-2xl bg-card/60 border border-dotted border-primary rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Text Content */}
            <div className="flex-1 pr-0 sm:pr-4">
              <h3 className="font-semibold text-sm sm:text-base mb-1.5">
                We use cookies
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                This site uses Google Analytics to understand how visitors use the app and saves your calculator data locally on your device for convenience. 
                No personal information is collected or transmitted.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
              <Button
                onClick={handleDecline}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial border-border text-xs sm:text-sm"
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex-1 sm:flex-initial text-xs sm:text-sm"
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