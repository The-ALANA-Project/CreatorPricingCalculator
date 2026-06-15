import { useState, useRef, useEffect } from "react";
import { ExpenseInput, type Expense } from "@/app/components/ExpenseInput";
import { IncomeCalculator, type IncomeSettings } from "@/app/components/IncomeCalculator";
import { ServicePricing, type ServicePricingRef } from "@/app/components/ServicePricing";
import { CreatorType, type CreatorTypeData } from "@/app/components/CreatorType";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Link } from "react-router";
import { FloatingToolbar } from "@/app/components/FloatingToolbar";
import { useLanguage, LanguageToggle } from "@/app/i18n/LanguageContext";
import gsap from "gsap";

interface CalculatorData {
  expenses: Expense[];
  incomeSettings: IncomeSettings;
  creatorData: CreatorTypeData;
  customServices: CustomService[];
  markup: number;
  selectedRateTier: 'base' | 'recommended';
  exportDate: string;
  version: string;
}

interface CustomService {
  id: string;
  name: string;
  deliveryHours: number;
  prepHours: number;
}

function makeDefaultExpenses(labels: string[]): Expense[] {
  return labels.map((category) => ({
    id: crypto.randomUUID(),
    category,
    monthlyCost: 0,
  }));
}

const DEFAULT_INCOME_SETTINGS: IncomeSettings = {
  taxRate: 30,
  emergencyBuffer: 20,
  reinvestment: 10,
  weeksPerYear: 48,
  daysPerWeek: 3,
  hoursPerDay: 4,
};

const DEFAULT_CREATOR_DATA: CreatorTypeData = {
  type: "digital",
  experienceLevel: "mid",
  projectTerms: "standard",
};

const STORAGE_KEY = 'creatorPricingData';

export default function Calculator() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [expenses, setExpenses] = useState<Expense[]>(() => makeDefaultExpenses(t.expenses.defaults));
  const [incomeSettings, setIncomeSettings] = useState<IncomeSettings>(DEFAULT_INCOME_SETTINGS);
  const [creatorData, setCreatorData] = useState<CreatorTypeData>(DEFAULT_CREATOR_DATA);
  const [selectedRateTier, setSelectedRateTier] = useState<'base' | 'recommended'>('recommended');
  const [markup, setMarkup] = useState<number>(0);
  const [customServices, setCustomServices] = useState<CustomService[]>([]);
  const servicePricingRef = useRef<ServicePricingRef>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Entrance animation when coming from intro
  useEffect(() => {
    if (sessionStorage.getItem("intro-transitioning") === "true") {
      sessionStorage.removeItem("intro-transitioning");
      if (pageRef.current) {
        gsap.fromTo(
          pageRef.current,
          { opacity: 0, filter: "blur(30px)", scale: 1.04 },
          { opacity: 1, filter: "blur(0px)", scale: 1, duration: 1, ease: "power2.out" }
        );
      }
    }
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.incomeSettings) setIncomeSettings(parsed.incomeSettings);
        if (parsed.creatorData) setCreatorData(parsed.creatorData);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.customServices) setCustomServices(parsed.customServices);
        if (parsed.markup !== undefined) setMarkup(parsed.markup);
        if (parsed.selectedRateTier) setSelectedRateTier(parsed.selectedRateTier);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      expenses,
      incomeSettings,
      creatorData,
      currentStep,
      customServices,
      markup,
      selectedRateTier,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [expenses, incomeSettings, creatorData, currentStep, customServices, markup, selectedRateTier]);

  // Adjust markup when rate tier changes
  useEffect(() => {
    if (selectedRateTier === 'recommended') {
      setMarkup(0);
    } else {
      setMarkup(25);
    }
  }, [selectedRateTier]);

  // Export data as JSON
  const exportData = () => {
    const data: CalculatorData = {
      expenses,
      incomeSettings,
      creatorData,
      customServices,
      markup,
      selectedRateTier,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creator-pricing-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import data from JSON
  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: CalculatorData = JSON.parse(content);
        
        if (!data.expenses || !data.incomeSettings || !data.creatorData) {
          alert(t.calculator.invalidFile);
          return;
        }
        
        setExpenses(data.expenses);
        setIncomeSettings(data.incomeSettings);
        setCreatorData(data.creatorData);
        if (data.customServices) setCustomServices(data.customServices);
        if (data.markup !== undefined) setMarkup(data.markup);
        if (data.selectedRateTier) setSelectedRateTier(data.selectedRateTier);
        alert(t.calculator.importSuccess);
      } catch (error) {
        console.error('Error importing data:', error);
        alert(t.calculator.importError);
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = (file: File) => {
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      importData(file);
    } else {
      alert(t.calculator.uploadWrongType);
    }
  };

  const totalMonthlyExpenses = expenses.reduce(
    (sum, exp) => sum + (exp.monthlyCost || 0),
    0
  );
  const totalAnnualExpenses = totalMonthlyExpenses * 12;

  const taxAmount = totalAnnualExpenses * (incomeSettings.taxRate / 100);
  const bufferAmount = totalAnnualExpenses * (incomeSettings.emergencyBuffer / 100);
  const reinvestmentAmount = totalAnnualExpenses * (incomeSettings.reinvestment / 100);
  const targetIncome = totalAnnualExpenses + taxAmount + bufferAmount + reinvestmentAmount;

  const billableHoursPerYear =
    incomeSettings.weeksPerYear *
    incomeSettings.daysPerWeek *
    incomeSettings.hoursPerDay;

  // Scroll to top when changing steps
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-background text-foreground">
      {/* Floating Toolbar */}
      <FloatingToolbar
        currentStep={currentStep}
        onStepChange={handleStepChange}
        totalSteps={4}
        onUpload={handleUpload}
        onExportJSON={exportData}
        onExportPNG={() => servicePricingRef.current?.downloadAsImage()}
        onExportPDF={() => servicePricingRef.current?.downloadAsPDF()}
        showSteps={true}
      />

      {/* Static Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-primary/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] py-6 sm:py-6">
        <div className="pl-4 pr-4 sm:pl-6 sm:pr-6">
          <div className="flex items-start sm:items-end justify-between">
            <div>
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-primary-foreground">{t.calculator.title}</h1>
              <p className="text-sm sm:text-sm text-[#fee6ea] mt-1">
                {t.calculator.subtitle}
              </p>
            </div>
            <div className="flex-shrink-0">
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 lg:pl-24 pb-24 lg:pb-12">
        <div className="max-w-4xl mx-auto">
        {/* Step 1 */}
        {currentStep === 1 && (
          <Card className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <ExpenseInput expenses={expenses} onExpensesChange={setExpenses} />
              <div className="mt-6 sm:mt-8 flex justify-end">
                <Button onClick={() => handleStepChange(2)}>{t.calculator.nextStep}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <Card className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <IncomeCalculator
                totalAnnualExpenses={totalAnnualExpenses}
                settings={incomeSettings}
                onSettingsChange={setIncomeSettings}
              />
              <div className="mt-6 sm:mt-8 flex justify-between">
                <Button onClick={() => handleStepChange(1)}>{t.calculator.prevStep}</Button>
                <Button onClick={() => handleStepChange(3)}>{t.calculator.nextStep}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <Card className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <CreatorType
                data={creatorData}
                onDataChange={setCreatorData}
                targetIncome={targetIncome}
                billableHours={billableHoursPerYear}
                selectedRateTier={selectedRateTier}
                onSelectedRateTierChange={setSelectedRateTier}
              />
              <div className="mt-6 sm:mt-8 flex justify-between">
                <Button onClick={() => {
                  handleStepChange(2);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}>{t.calculator.prevStep}</Button>
                <Button onClick={() => handleStepChange(4)}>{t.calculator.nextStep}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <Card className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <ServicePricing
                targetIncome={targetIncome}
                billableHours={billableHoursPerYear}
                creatorData={creatorData}
                markup={markup}
                onMarkupChange={setMarkup}
                customServices={customServices}
                onCustomServicesChange={setCustomServices}
                selectedRateTier={selectedRateTier}
                ref={servicePricingRef}
              />
              <div className="mt-6 sm:mt-8 flex justify-between">
                <Button onClick={() => handleStepChange(3)}>{t.calculator.prevStep}</Button>
                <Button onClick={() => handleStepChange(1)}>{t.calculator.startOver}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Reminder for Step 4 */}
        {currentStep === 4 && (
          <>
            <div className="mt-6 bg-[#FEE6EA] border border-[#131718] rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <h3 className="mb-1 text-[20px]">{t.calculator.save.title}</h3>
                    <p className="text-muted-foreground text-[16px]">
                      {t.calculator.save.desc}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={exportData}
                    variant="default"
                    className="w-full sm:flex-1"
                  >
                    {t.calculator.save.saveJson}
                  </Button>
                  <Button
                    onClick={() => servicePricingRef.current?.downloadAsImage()}
                    variant="outline"
                    className="border-border w-full sm:flex-1"
                  >
                    {t.calculator.save.downloadPng}
                  </Button>
                  <Button
                    onClick={() => servicePricingRef.current?.downloadAsPDF()}
                    variant="outline"
                    className="border-border w-full sm:flex-1"
                  >
                    {t.calculator.save.downloadPdf}
                  </Button>
                </div>
              </div>
            </div>

            {/* Resources Promotion Card */}
            <Link to="/resources">
              
            </Link>

            {/* Ko-fi Support Card */}
            <Card className="mt-6 backdrop-blur-2xl bg-gradient-to-br from-[#FEE6EA]/20 to-[#FEE6EA]/10 border border-[#FEE6EA]/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]">
              
            </Card>
          </>
        )}
        </div>
      </main>

      {/* Divider */}
      <div className="border-t border-[#131718]" />

      {/* Footer */}
      <footer className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-muted-foreground px-[16px] pt-[0px] pb-24 lg:pb-[16px]">
        <p>
          {t.calculator.footer.share}{' '}
          <a
            href="https://ko-fi.com/stellaachenbach"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-bold"
          >
            {t.calculator.footer.donating}
          </a>
          {' '}{t.calculator.footer.helpful}
        </p>
        <p className="mt-2">
          {t.calculator.footer.madeWith}{' '}
          <a
            href="https://www.linkedin.com/in/stella-achenbach/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @stellaachenbach
          </a>
        </p>
      </footer>
    </div>
  );
}