import { useState, useRef, useEffect } from "react";
import { ExpenseInput, type Expense } from "@/app/components/ExpenseInput";
import { IncomeCalculator, type IncomeSettings } from "@/app/components/IncomeCalculator";
import { ServicePricing, type ServicePricingRef } from "@/app/components/ServicePricing";
import { CreatorType, type CreatorTypeData } from "@/app/components/CreatorType";
import { Button } from "@/app/components/ui/button";
import { FileImage, FileText, Upload, Download, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Link } from "react-router";

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

const DEFAULT_EXPENSES: Expense[] = [
  { id: crypto.randomUUID(), category: "Housing", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Food", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Transport", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Health", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Internet", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Software", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "AI Tooling", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Equipment", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Subscriptions", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Professional", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Leisure", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Misc", monthlyCost: 0 },
];

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
  experienceLevel: "mid", // Default to mid-level
  projectTerms: "standard", // Default to standard terms
};

const STORAGE_KEY = 'creatorPricingData';

export default function Calculator() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [expenses, setExpenses] = useState<Expense[]>(DEFAULT_EXPENSES);
  const [incomeSettings, setIncomeSettings] = useState<IncomeSettings>(DEFAULT_INCOME_SETTINGS);
  const [creatorData, setCreatorData] = useState<CreatorTypeData>(DEFAULT_CREATOR_DATA);
  const [selectedRateTier, setSelectedRateTier] = useState<'base' | 'recommended'>('recommended'); // Track rate tier selection
  const [markup, setMarkup] = useState<number>(0); // Universal markup percentage - starts at 0 for recommended rate
  const [customServices, setCustomServices] = useState<CustomService[]>([]); // Custom services state
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadDataExpanded, setIsLoadDataExpanded] = useState(false);
  const servicePricingRef = useRef<ServicePricingRef>(null);

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

  // Scroll detection for sticky header
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Adjust markup when rate tier changes
  useEffect(() => {
    if (selectedRateTier === 'recommended') {
      setMarkup(0); // Recommended rate already includes profit, start at 0
    } else {
      setMarkup(25); // Base rate needs profit, suggest 25%
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
        
        // Validate structure
        if (!data.expenses || !data.incomeSettings || !data.creatorData) {
          alert('Invalid file format. Please upload a valid Creator Pricing data file.');
          return;
        }
        
        // Restore data
        setExpenses(data.expenses);
        setIncomeSettings(data.incomeSettings);
        setCreatorData(data.creatorData);
        if (data.customServices) setCustomServices(data.customServices);
        if (data.markup !== undefined) setMarkup(data.markup);
        if (data.selectedRateTier) setSelectedRateTier(data.selectedRateTier);
        alert('Data imported successfully! 🎉');
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error reading file. Please ensure it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      importData(file);
    } else {
      alert('Please upload a JSON file.');
    }
  };

  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
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

  const steps = [
    { number: 1, title: "Monthly Expenses", description: "Add your costs" },
    { number: 2, title: "Your Foundation", description: "Set your parameters" },
    { number: 3, title: "Creator Type", description: "Choose your type" },
    { number: 4, title: "Service Pricing", description: "See your rates" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header 
        className={`backdrop-blur-2xl bg-primary border-b border-primary/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-all duration-500 ease-out ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 py-3 sm:py-4' : 'py-8 sm:py-12'} bg-[#131718]`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`
            transition-all duration-500 ease-out
            ${isScrolled ? 'opacity-0 max-h-0 overflow-hidden mb-0' : 'opacity-100 max-h-96 mb-6 sm:mb-8'}
          `}>
            <h1 className="mb-3 sm:mb-4 text-primary-foreground text-[30px]">Creator Pricing Calculator</h1>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
              <p className="text-[#FEE6EA]/90 max-w-2xl text-[16px] mx-[0px] mt-[-10px] mb-[0px]">
                Calculate your sustainable creator rates based on real expenses, taxes, and business needs.
                Built with the financial wisdom every creative professional deserves.
              </p>
              <Link to="/resources">
                <Button 
                  variant="ghost" 
                  className="bg-[#FEE6EA] text-[#131718] hover:bg-[#131718] hover:text-[#FEE6EA] hover:shadow-[0_0_0_1px_#FEE6EA] border border-[#FEE6EA] whitespace-nowrap self-start sm:self-auto transition-all duration-300 mx-[0px] mt-[-10px] mb-[0px]"
                >
                  Resources →
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1 min-w-0">
                <button
                  onClick={() => handleStepChange(step.number)}
                  className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 flex-shrink-0 ${
                    currentStep === step.number 
                      ? 'opacity-100' 
                      : 'opacity-50 hover:opacity-75'
                  }`}
                >
                  <div className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium
                    transition-colors duration-300 flex-shrink-0
                    ${currentStep === step.number 
                      ? 'bg-[#FEE6EA] text-primary' 
                      : 'bg-[#FEE6EA]/20 text-[#FEE6EA]'
                    }
                  `}>
                    {step.number}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-primary-foreground whitespace-nowrap">{step.title}</div>
                    <div className="text-xs text-[#FEE6EA]/70 whitespace-nowrap">{step.description}</div>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block flex-1 h-px bg-[#FEE6EA]/20 mx-2 sm:mx-3 md:mx-4 min-w-[20px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Add padding top when header is sticky to prevent content jump */}
      <div className={`transition-all duration-500 ease-out ${isScrolled ? 'pt-20 sm:pt-24' : ''}`}>
        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
          {/* Step 1 */}
          {currentStep === 1 && (
            <>
              {/* Load Data Section - Shows First */}
              <div className="mb-6 backdrop-blur-2xl bg-primary/5 border border-[#131718] rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] overflow-hidden">
                {/* Accordion Header */}
                <button
                  onClick={() => setIsLoadDataExpanded(!isLoadDataExpanded)}
                  className="w-full p-4 sm:p-6 flex items-center justify-between gap-4 bg-[#FEE6EA]"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-semibold mb-0.5 text-[20px]">Load Saved Data</h3>
                      <p className="text-muted-foreground text-[16px]">
                        Import your previously saved JSON file
                      </p>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                      isLoadDataExpanded ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Accordion Content */}
                <div 
                  className={`
                    transition-all duration-300 ease-in-out
                    ${isLoadDataExpanded 
                      ? 'max-h-[500px] opacity-100' 
                      : 'max-h-0 opacity-0 overflow-hidden'
                    }
                  `}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 bg-[#FEE6EA]">
                    
                    
                    {/* Drag and Drop Zone */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      className={`
                        border border-dotted border-[#131718] rounded-lg p-6 sm:p-8 text-center
                        transition-all duration-300
                        ${isDragging 
                          ? 'bg-primary/10 scale-[1.02]' 
                          : 'hover:bg-primary/5'
                        }
                      `}
                    >
                      
                      <p className="text-sm mb-2">
                        {isDragging ? 'Drop your file here' : 'Drag and drop your JSON file here'}
                      </p>
                      <p className="text-muted-foreground mb-4 text-[14px]">or</p>
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="bg-[#131718] text-[#FEE6EA] border-[#131718] hover:bg-[#FEE6EA] hover:text-[#131718] hover:border-[#131718] cursor-pointer" asChild>
                          <span>
                            
                            Choose File
                          </span>
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".json"
                          onChange={handleFileInput}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <ExpenseInput expenses={expenses} onExpensesChange={setExpenses} />
                  <div className="mt-6 sm:mt-8 flex justify-end">
                    <Button onClick={() => handleStepChange(2)}>Next Step</Button>
                  </div>
                </CardContent>
              </Card>
            </>
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
                  <Button onClick={() => handleStepChange(1)}>Previous Step</Button>
                  <Button onClick={() => handleStepChange(3)}>Next Step</Button>
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
                  }}>Previous Step</Button>
                  <Button onClick={() => handleStepChange(4)}>Next Step</Button>
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
                  <Button onClick={() => handleStepChange(3)}>Previous Step</Button>
                  <Button onClick={() => handleStepChange(1)}>Start Over</Button>
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
                      <h3 className="mb-1 text-[20px]">Don't forget to save your calculations!</h3>
                      <p className="text-muted-foreground text-[16px]">
                        Save your data as JSON to quickly re-import and update your rates next time. Or download as PNG/PDF to share with clients.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={exportData}
                      variant="default"
                      className="w-full sm:flex-1"
                    >
                      
                      Save Data (JSON)
                    </Button>
                    <Button
                      onClick={() => servicePricingRef.current?.downloadAsImage()}
                      variant="outline"
                      className="border-border w-full sm:flex-1"
                    >
                      
                      Download as PNG
                    </Button>
                    <Button
                      onClick={() => servicePricingRef.current?.downloadAsPDF()}
                      variant="outline"
                      className="border-border w-full sm:flex-1"
                    >
                      
                      Download as PDF
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
        </main>

        {/* Divider */}
        <div className="border-t border-[#131718]" />

        {/* Footer */}
        <footer className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-muted-foreground px-[16px] pt-[0px] pb-[16px]">
          <p>
            Share this calculator, use it, and consider{' '}
            <a 
              href="https://ko-fi.com/stellaachenbach" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-bold"
            >
              donating
            </a>
            {' '}if you found it helpful.
          </p>
          <p className="mt-2">
            Made with 💜 by{' '}
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
    </div>
  );
}