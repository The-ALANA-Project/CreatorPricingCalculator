import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, BookOpen, Upload, Download, FileImage, FileText } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useLanguage } from "@/app/i18n/LanguageContext";

interface FloatingToolbarProps {
  currentStep?: number;
  onStepChange?: (step: number) => void;
  totalSteps?: number;
  onUpload?: (file: File) => void;
  onExportJSON?: () => void;
  onExportPNG?: () => void;
  onExportPDF?: () => void;
  showSteps?: boolean;
}

export function FloatingToolbar({
  currentStep = 1,
  onStepChange,
  totalSteps = 4,
  onUpload,
  onExportJSON,
  onExportPNG,
  onExportPDF,
  showSteps = true,
}: FloatingToolbarProps) {
  const { t } = useLanguage();
  const STEP_LABELS = t.toolbar.stepLabels;
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [stepDropdownOpen, setStepDropdownOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);
  const mobileDownloadRef = useRef<HTMLDivElement>(null);
  const stepDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const isCalculator = location.pathname === "/calculator";

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        downloadRef.current && !downloadRef.current.contains(e.target as Node) &&
        mobileDownloadRef.current && !mobileDownloadRef.current.contains(e.target as Node)
      ) {
        setDownloadOpen(false);
      }
      if (
        !downloadRef.current && mobileDownloadRef.current && !mobileDownloadRef.current.contains(e.target as Node)
      ) {
        setDownloadOpen(false);
      }
      if (
        downloadRef.current && !downloadRef.current.contains(e.target as Node) && !mobileDownloadRef.current
      ) {
        setDownloadOpen(false);
      }
      if (stepDropdownRef.current && !stepDropdownRef.current.contains(e.target as Node)) {
        setStepDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const ToolbarButton = ({
    children,
    onClick,
    active = false,
    label,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-full flex items-center justify-center
        shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)]
        hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]
        hover:scale-105 active:scale-95 ${
        active
          ? "bg-[#FEE6EA] text-[#131718]"
          : "bg-[#131718] text-[#FEE6EA]"
      }`}
      style={{ transition: "all 400ms cubic-bezier(0.175, 0.885, 0.32, 2.2)" }}
      title={label}
    >
      {children}
    </button>
  );

  // Step circle for desktop sidebar
  const StepCircle = ({ step }: { step: number }) => {
    const isActive = currentStep === step;
    return (
      <button
        onClick={() => onStepChange?.(step)}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm
          shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)]
          hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]
          hover:scale-105 active:scale-95 ${
          isActive
            ? "bg-[#FEE6EA] text-[#131718]"
            : "bg-[#131718] text-[#FEE6EA]/60 hover:text-[#FEE6EA]"
        }`}
        style={{ transition: "all 400ms cubic-bezier(0.175, 0.885, 0.32, 2.2)" }}
        title={`${t.toolbar.step} ${step}: ${STEP_LABELS[step - 1]}`}
      >
        {step}
      </button>
    );
  };

  return (
    <>
      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Desktop: Floating left sidebar */}
      <nav className="hidden lg:flex fixed top-40 left-6 z-50 flex-col items-center gap-3">
        {/* Contextual nav: show Resources on calculator, Home on resources */}
        {isCalculator ? (
          <Link to="/resources">
            <ToolbarButton label={t.toolbar.resources}>
              <BookOpen className="w-5 h-5" />
            </ToolbarButton>
          </Link>
        ) : (
          <Link to="/calculator">
            <ToolbarButton label={t.toolbar.home}>
              <Home className="w-5 h-5" />
            </ToolbarButton>
          </Link>
        )}

        {/* Separator */}
        {showSteps && (
          <>
            <div className="w-6 h-px bg-[#FEE6EA]/15 my-1" />

            {/* Step indicators */}
            {Array.from({ length: totalSteps }, (_, i) => (
              <StepCircle key={i + 1} step={i + 1} />
            ))}

            <div className="w-6 h-px bg-[#FEE6EA]/15 my-1" />
          </>
        )}

        {/* Upload */}
        {showSteps && (
          <ToolbarButton
            label={t.toolbar.uploadData}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-5 h-5" />
          </ToolbarButton>
        )}

        {/* Download with dropdown */}
        {showSteps && (
          <div ref={downloadRef} className="relative">
            <ToolbarButton
              label={t.toolbar.download}
              onClick={() => setDownloadOpen(!downloadOpen)}
            >
              <Download className="w-5 h-5" />
            </ToolbarButton>

            <AnimatePresence>
              {downloadOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-14 md:left-14 right-auto md:right-auto top-0 z-30"
                >
                  <div className="bg-[#131718] rounded-2xl shadow-lg min-w-[200px] p-2 space-y-1">
                    <button
                      onClick={() => {
                        onExportJSON?.();
                        setDownloadOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 flex items-center gap-3 rounded-xl"
                      style={{ transition: "all 100ms" }}
                    >
                      <Download className="w-4 h-4" />
                      {t.toolbar.saveJson}
                    </button>
                    <button
                      onClick={() => {
                        onExportPNG?.();
                        setDownloadOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 flex items-center gap-3 rounded-xl"
                      style={{ transition: "all 100ms" }}
                    >
                      <FileImage className="w-4 h-4" />
                      {t.toolbar.exportPng}
                    </button>
                    <button
                      onClick={() => {
                        onExportPDF?.();
                        setDownloadOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 flex items-center gap-3 rounded-xl"
                      style={{ transition: "all 100ms" }}
                    >
                      <FileText className="w-4 h-4" />
                      {t.toolbar.exportPdf}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>

      {/* Mobile: Fixed bottom navigation bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#131718] border-t border-[#FEE6EA]/10 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2">
          {/* Contextual nav: show Resources on calculator, Home on resources */}
          {isCalculator ? (
            <Link to="/resources" className="flex flex-col items-center gap-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#FEE6EA]"
              >
                <BookOpen className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] text-[#FEE6EA]/70">{t.toolbar.resources}</span>
            </Link>
          ) : (
            <Link to="/calculator" className="flex flex-col items-center gap-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#FEE6EA]"
              >
                <Home className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] text-[#FEE6EA]/70">{t.toolbar.home}</span>
            </Link>
          )}

          {/* Upload (only on calculator) */}
          {showSteps && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#FEE6EA]"
              >
                <Upload className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] text-[#FEE6EA]/70">{t.toolbar.import}</span>
            </button>
          )}

          {/* Step Dropdown (only on calculator) */}
          {showSteps && (
            <div ref={stepDropdownRef} className="relative flex flex-col items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setStepDropdownOpen(!stepDropdownOpen)}
                className="w-10 h-10 rounded-full bg-[#FEE6EA] text-[#131718] flex items-center justify-center text-sm"
              >
                {currentStep}
              </motion.button>
              <span className="text-[10px] text-[#FEE6EA]/70">
                {t.toolbar.step} {currentStep}
              </span>

              <AnimatePresence>
                {stepDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-16 bg-[#131718] rounded-lg shadow-lg border border-[#FEE6EA]/10 overflow-hidden min-w-[160px]"
                  >
                    {Array.from({ length: totalSteps }, (_, i) => {
                      const step = i + 1;
                      const isActive = currentStep === step;
                      return (
                        <button
                          key={step}
                          onClick={() => {
                            onStepChange?.(step);
                            setStepDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${
                            isActive
                              ? "bg-[#FEE6EA] text-[#131718]"
                              : "text-[#FEE6EA] hover:bg-[#FEE6EA]/10"
                          }`}
                        >
                          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">
                            {step}
                          </span>
                          {STEP_LABELS[i]}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Download (only on calculator) */}
          {showSteps && (
            <div ref={!showSteps ? undefined : mobileDownloadRef} className="relative flex flex-col items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setDownloadOpen(!downloadOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#FEE6EA]"
              >
                <Download className="w-5 h-5" />
              </motion.button>
              <span className="text-[10px] text-[#FEE6EA]/70">{t.toolbar.export}</span>

              <AnimatePresence>
                {downloadOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-16 right-0 z-30"
                  >
                    <div className="bg-[#131718] rounded-2xl shadow-lg min-w-[200px] p-2 space-y-1">
                      <button
                        onClick={() => {
                          onExportJSON?.();
                          setDownloadOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 flex items-center gap-3 rounded-xl"
                        style={{ transition: "all 100ms" }}
                      >
                        <Download className="w-4 h-4" />
                        {t.toolbar.saveJson}
                      </button>
                      <button
                        onClick={() => {
                          onExportPNG?.();
                          setDownloadOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 flex items-center gap-3 rounded-xl"
                        style={{ transition: "all 100ms" }}
                      >
                        <FileImage className="w-4 h-4" />
                        {t.toolbar.exportPng}
                      </button>
                      <button
                        onClick={() => {
                          onExportPDF?.();
                          setDownloadOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 flex items-center gap-3 rounded-xl"
                        style={{ transition: "all 100ms" }}
                      >
                        <FileText className="w-4 h-4" />
                        {t.toolbar.exportPdf}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}