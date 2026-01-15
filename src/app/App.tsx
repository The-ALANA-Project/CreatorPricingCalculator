import { useState } from "react";
import { ExpenseInput, type Expense } from "@/app/components/ExpenseInput";
import { IncomeCalculator, type IncomeSettings } from "@/app/components/IncomeCalculator";
import { ServicePricing } from "@/app/components/ServicePricing";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import logo from "figma:asset/72e2173591b6a9d3c1947e527c26a5b7485f43a9.png";

function App() {
  const [currentStep, setCurrentStep] = useState(1);

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
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-secondary/80 border-b border-border/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col gap-4">
            <img src={logo} alt="Stella Achenbach" className="h-12 sm:h-20 w-auto object-contain" />
            <div>
              <h1 className="mb-1 sm:mb-2">Creator Pricing Calculator</h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                Calculate your floor price based on your actual expenses. Never work for free again.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Progress Steps */}
      <div className="sticky top-[140px] sm:top-[156px] z-40 backdrop-blur-xl bg-card/80 border-b border-border/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1 min-w-0">
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className={`flex items-center gap-2 sm:gap-3 min-w-0 ${
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
                  <div className="text-left hidden sm:block min-w-0">
                    <div className="text-sm truncate">{step.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{step.description}</div>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-border/50 mx-2 sm:mx-4 min-w-[20px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl shadow-lg p-4 sm:p-8">
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
              <Button onClick={() => setCurrentStep(currentStep + 1)} className="w-full sm:w-auto">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="border-border w-full sm:w-auto">
                Start Over
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground px-4">
          <p>
            Share this calculator, use it, and adjust as your career grows. 💜
          </p>
          <p className="mt-2">
            Made with love by{' '}
            <a 
              href="https://paragraph.xyz/@stellaachenbach" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @stellaachenbach
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;