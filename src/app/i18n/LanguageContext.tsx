import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type Language, type Translations } from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "creatorPricingLanguage";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === "en" || saved === "es") ? saved : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className={`flex items-center gap-1 rounded-full border border-primary-foreground/30 overflow-hidden ${className ?? ""}`}>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 text-xs font-medium transition-all ${
          language === "en"
            ? "bg-primary-foreground text-primary"
            : "text-primary-foreground/60 hover:text-primary-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("es")}
        className={`px-2 py-1 text-xs font-medium transition-all ${
          language === "es"
            ? "bg-primary-foreground text-primary"
            : "text-primary-foreground/60 hover:text-primary-foreground"
        }`}
      >
        ES
      </button>
    </div>
  );
}
