import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export interface IncomeSettings {
  taxRate: number;
  emergencyBuffer: number;
  reinvestment: number;
  weeksPerYear: number;
  daysPerWeek: number;
  hoursPerDay: number;
}

interface IncomeCalculatorProps {
  totalAnnualExpenses: number;
  settings: IncomeSettings;
  onSettingsChange: (settings: IncomeSettings) => void;
}

export function IncomeCalculator({
  totalAnnualExpenses,
  settings,
  onSettingsChange,
}: IncomeCalculatorProps) {
  const updateSetting = (field: keyof IncomeSettings, value: number) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const taxAmount = totalAnnualExpenses * (settings.taxRate / 100);
  const bufferAmount = totalAnnualExpenses * (settings.emergencyBuffer / 100);
  const reinvestmentAmount = totalAnnualExpenses * (settings.reinvestment / 100);
  const targetIncome = totalAnnualExpenses + taxAmount + bufferAmount + reinvestmentAmount;

  const billableHoursPerYear =
    settings.weeksPerYear * settings.daysPerWeek * settings.hoursPerDay;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Income Calculator</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Adjust these settings to match your work schedule and financial goals.
        </p>
      </div>

      <div className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax-rate" className="text-sm">
              Tax Rate (%)
            </Label>
            <Input
              id="tax-rate"
              type="number"
              inputMode="decimal"
              value={settings.taxRate}
              onChange={(e) => updateSetting("taxRate", parseFloat(e.target.value) || 0)}
              className="bg-input-background border border-border"
            />
            <p className="text-xs text-muted-foreground">
              US: 25-30% for self-employment
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency-buffer" className="text-sm">
              Emergency Buffer (%)
            </Label>
            <Input
              id="emergency-buffer"
              type="number"
              inputMode="decimal"
              value={settings.emergencyBuffer}
              onChange={(e) => updateSetting("emergencyBuffer", parseFloat(e.target.value) || 0)}
              className="bg-input-background border border-border"
            />
            <p className="text-xs text-muted-foreground">Recommended: 20-30%</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reinvestment" className="text-sm">
              Reinvestment (%)
            </Label>
            <Input
              id="reinvestment"
              type="number"
              inputMode="decimal"
              value={settings.reinvestment}
              onChange={(e) => updateSetting("reinvestment", parseFloat(e.target.value) || 0)}
              className="bg-input-background border border-border"
            />
            <p className="text-xs text-muted-foreground">
              For tools, learning, growth
            </p>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-4 sm:p-6 space-y-4">
        <h3 className="mb-4">Billable Time</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weeks-per-year" className="text-sm">
              Weeks Per Year
            </Label>
            <Input
              id="weeks-per-year"
              type="number"
              inputMode="decimal"
              value={settings.weeksPerYear}
              onChange={(e) => updateSetting("weeksPerYear", parseFloat(e.target.value) || 0)}
              className="bg-input-background border border-border"
            />
            <p className="text-xs text-muted-foreground">
              48 assumes 4 weeks off
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="days-per-week" className="text-sm">
              Days Per Week
            </Label>
            <Input
              id="days-per-week"
              type="number"
              inputMode="decimal"
              value={settings.daysPerWeek}
              onChange={(e) => updateSetting("daysPerWeek", parseFloat(e.target.value) || 0)}
              className="bg-input-background border border-border"
            />
            <p className="text-xs text-muted-foreground">
              3 is realistic for creators
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours-per-day" className="text-sm">
              Hours Per Day
            </Label>
            <Input
              id="hours-per-day"
              type="number"
              inputMode="decimal"
              value={settings.hoursPerDay}
              onChange={(e) => updateSetting("hoursPerDay", parseFloat(e.target.value) || 0)}
              className="bg-input-background border border-border"
            />
            <p className="text-xs text-muted-foreground">
              4 hours of deep work
            </p>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-2xl bg-primary text-primary-foreground rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] p-4 sm:p-6 space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-primary-foreground/20">
          <span className="text-xs sm:text-sm opacity-90">Annual Expenses</span>
          <span className="text-sm sm:text-base">{totalAnnualExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm opacity-90">+ Taxes ({settings.taxRate}%)</span>
          <span className="text-sm sm:text-base">{taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm opacity-90">+ Emergency Buffer ({settings.emergencyBuffer}%)</span>
          <span className="text-sm sm:text-base">{bufferAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center pb-3">
          <span className="text-xs sm:text-sm opacity-90">+ Reinvestment ({settings.reinvestment}%)</span>
          <span className="text-sm sm:text-base">{reinvestmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-primary-foreground/20">
          <span className="text-sm sm:text-base">Target Annual Income</span>
          <span className="text-lg sm:text-xl">{targetIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-xs sm:text-sm opacity-90">
          <span>Billable Hours Per Year</span>
          <span>{billableHoursPerYear} hours</span>
        </div>
      </div>
    </div>
  );
}