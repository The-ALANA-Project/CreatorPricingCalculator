import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";
import { Info } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

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
  const { t } = useLanguage();
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
        <h2 className="mb-2">{t.income.title}</h2>
        <p className="text-muted-foreground text-[16px]">
          {t.income.subtitle}
        </p>
      </div>

      <div className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax-rate" className="text-sm">
              {t.income.taxRate}
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
              {t.income.taxHint}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency-buffer" className="text-sm">
              {t.income.emergencyBuffer}
            </Label>
            <Input
              id="emergency-buffer"
              type="number"
              inputMode="decimal"
              value={settings.emergencyBuffer}
              onChange={(e) => updateSetting("emergencyBuffer", parseFloat(e.target.value) || 0)}
              className="bg-input-background border border-border"
            />
            <p className="text-xs text-muted-foreground">{t.income.emergencyHint}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="reinvestment" className="text-sm">
                {t.income.reinvestment}
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex">
                    <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t.income.reinvestmentTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="reinvestment"
              type="number"
              inputMode="decimal"
              value={settings.reinvestment}
              onChange={(e) => updateSetting("reinvestment", parseFloat(e.target.value) || 0)}
              className="bg-input-background border border-border"
            />
            <p className="text-xs text-muted-foreground">{t.income.reinvestmentHint}</p>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-4 sm:p-6 space-y-4">
        <h3 className="mb-4">{t.income.billableTime}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weeks-per-year" className="text-sm">
              {t.income.weeksPerYear}
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
              {t.income.weeksHint}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="days-per-week" className="text-sm">
              {t.income.daysPerWeek}
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
              {t.income.daysHint}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours-per-day" className="text-sm">
              {t.income.hoursPerDay}
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
              {t.income.hoursHint}
            </p>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-2xl bg-primary text-primary-foreground rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] p-4 sm:p-6 space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-primary-foreground/20">
          <span className="text-xs sm:text-sm opacity-90">{t.income.annualExpenses}</span>
          <span className="text-sm sm:text-base">{totalAnnualExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm opacity-90">{t.income.taxes.replace('{rate}', String(settings.taxRate))}</span>
          <span className="text-sm sm:text-base">{taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm opacity-90">{t.income.emergencyBufferLabel.replace('{rate}', String(settings.emergencyBuffer))}</span>
          <span className="text-sm sm:text-base">{bufferAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm opacity-90">{t.income.reinvestmentLabel.replace('{rate}', String(settings.reinvestment))}</span>
          <span className="text-sm sm:text-base">{reinvestmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-primary-foreground/20">
          <span className="text-sm sm:text-base">{t.income.targetIncome}</span>
          <span className="text-lg sm:text-xl">{targetIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-xs sm:text-sm opacity-90">
          <span>{t.income.billableHours}</span>
          <span>{billableHoursPerYear} {t.income.hours}</span>
        </div>
      </div>
    </div>
  );
}