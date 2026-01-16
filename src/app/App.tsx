import { useState, useRef } from "react";
import { ExpenseInput, type Expense } from "@/app/components/ExpenseInput";
import { IncomeCalculator, type IncomeSettings } from "@/app/components/IncomeCalculator";
import { ServicePricing, type ServicePricingRef } from "@/app/components/ServicePricing";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, ArrowLeft, FileImage, FileText, Upload, Download } from "lucide-react";

interface CalculatorData {
  expenses: Expense[];
  incomeSettings: IncomeSettings;
  exportDate: string;
  version: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const servicePricingRef = useRef<ServicePricingRef>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: crypto.randomUUID(), category: "Rent", monthlyCost: 1500 },
    { id: crypto.randomUUID(), category: "Groceries", monthlyCost: 400 },
    { id: crypto.randomUUID(), category: "Health Insurance", monthlyCost: 300 },
  ]);

  const [incomeSettings, setIncomeSettings] = useState<IncomeSettings>({
    taxRate: 30,
    emergencyBuffer: 20,
    reinvestment: 10,
    weeksPerYear: 48,
    daysPerWeek: 3,
    hoursPerDay: 4,
  });

  // Export data as JSON
  const exportData = () => {
    const data: CalculatorData = {
      expenses,
      incomeSettings,
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
        if (!data.expenses || !data.incomeSettings) {
          alert('Invalid file format. Please upload a valid Creator Pricing data file.');
          return;
        }
        
        // Restore data
        setExpenses(data.expenses);
        setIncomeSettings(data.incomeSettings);
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
  const targetIncome =
    totalAnnualExpenses + taxAmount + bufferAmount + reinvestmentAmount;

  const billableHoursPerYear =
    incomeSettings.weeksPerYear *
    incomeSettings.daysPerWeek *
    incomeSettings.hoursPerDay;

  const steps = [
    { number: 1, title: "Monthly Expenses", description: "Add your costs" },
    { number: 2, title: "Income Calculator", description: "Set your parameters" },
    { number: 3, title: "Service Pricing", description: "See your rates" },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Unified Sticky Header with Progress Steps - Enhanced Liquid Glass */}
      <header className="sticky top-0 z-50 backdrop-blur-3xl bg-secondary/70 border-b border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col gap-6 w-full">
            {/* Title Section */}
            <div className="w-full text-left pl-2 sm:pl-2">
              <h1 className="mb-1 sm:mb-2 text-left text-[30px] font-bold">Creator Pricing Calculator</h1>
              <p className="text-xs sm:text-sm text-muted-foreground text-left max-w-2xl text-[16px]">
                Calculate your floor price based on your actual expenses and know what you NEED to charge your clients.
              </p>
            </div>
            
            {/* Progress Steps */}
            <nav className="flex items-center w-full border-t border-white/10 pl-2 sm:pl-2" aria-label="Progress steps">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <button
                    onClick={() => {
                      setCurrentStep(step.number);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-2 sm:gap-3 ${
                      currentStep === step.number ? "opacity-100" : "opacity-50"
                    } hover:opacity-100 transition-opacity`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0 ${
                        currentStep === step.number
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {step.number}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-sm whitespace-nowrap">{step.title}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{step.description}</div>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-border/50 mx-2 sm:mx-4" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Import Data Card - Only visible on Step 1 */}
        {currentStep === 1 && (
          <div className="mb-6">
            <div
              className={`backdrop-blur-2xl bg-card/60 border border-dotted border-primary rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-6 sm:p-8 text-center transition-all duration-300 ${
                isDragging 
                  ? 'bg-primary/10 scale-[1.02]' 
                  : 'hover:bg-primary/5'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="mb-2 text-lg sm:text-xl">Load Previous Data</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                Drag and drop your JSON file here, or click to browse
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="border-border" asChild>
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
            </div>
          </div>
        )}

        <div className="backdrop-blur-2xl bg-card/50 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] p-4 sm:p-8">
          {currentStep === 1 && (
            <ExpenseInput expenses={expenses} onExpensesChange={setExpenses} />
          )}

          {currentStep === 2 && (
            <IncomeCalculator
              totalAnnualExpenses={totalAnnualExpenses}
              settings={incomeSettings}
              onSettingsChange={setIncomeSettings}
            />
          )}

          {currentStep === 3 && (
            <ServicePricing
              targetIncome={targetIncome}
              billableHours={billableHoursPerYear}
              ref={servicePricingRef}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 sm:mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="border-border w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button onClick={() => {
                setCurrentStep(currentStep + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} className="w-full sm:w-auto">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button variant="outline" onClick={() => {
                setCurrentStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} className="border-border w-full sm:w-auto">
                Start Over
              </Button>
            )}
          </div>

          {/* Save Reminder for Step 3 */}
          {currentStep === 3 && (
            <div className="mt-6 backdrop-blur-2xl bg-primary/5 border border-primary/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <h3 className="mb-1">Don't forget to save your calculations!</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Download your pricing to track your rates over time and reference them when quoting clients.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={exportData}
                    variant="default"
                    className="w-full sm:flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save Data (JSON)
                  </Button>
                  <Button
                    onClick={() => servicePricingRef.current?.downloadAsImage()}
                    variant="outline"
                    className="border-border w-full sm:flex-1"
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    Download as PNG
                  </Button>
                  <Button
                    onClick={() => servicePricingRef.current?.downloadAsPDF()}
                    variant="outline"
                    className="border-border w-full sm:flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download as PDF
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground px-4">
          <p>
            Share this calculator, use it, and adjust as your career grows.
          </p>
          <p className="mt-2">
            Made with 💜 by{' '}
            <a 
              href="https://paragraph.xyz/@stellaachenbach" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @stellaachenbach
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;