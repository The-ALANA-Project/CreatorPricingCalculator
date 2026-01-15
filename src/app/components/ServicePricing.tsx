import { useState, useRef } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Download, FileImage, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface ServicePricingProps {
  targetIncome: number;
  billableHours: number;
}

interface ServiceOption {
  id: string;
  name: string;
  hoursOrScope: number;
  description: string;
}

export function ServicePricing({ targetIncome, billableHours }: ServicePricingProps) {
  const baseHourlyRate = billableHours > 0 ? targetIncome / billableHours : 0;
  const recommendedHourlyRate = baseHourlyRate * 1.25;

  const [markup, setMarkup] = useState(25);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  const services: ServiceOption[] = [
    { id: "hourly", name: "Hourly Rate", hoursOrScope: 1, description: "Per hour of work" },
    { id: "small", name: "Small Project", hoursOrScope: 15, description: "15 hours" },
    { id: "medium", name: "Medium Project", hoursOrScope: 30, description: "30 hours" },
    { id: "large", name: "Large Project", hoursOrScope: 60, description: "60 hours" },
    { id: "day", name: "Day Rate", hoursOrScope: 8, description: "Full day (8 hours)" },
    { id: "retainer", name: "Monthly Retainer", hoursOrScope: 40, description: "40 hours/month" },
  ];

  const calculatePrice = (hours: number, isRetainer: boolean = false) => {
    const basePrice = baseHourlyRate * hours;
    const recommendedPrice = basePrice * (1 + markup / 100);
    const retainerDiscount = isRetainer ? 0.9 : 1; // 10% discount for retainers
    return {
      base: basePrice,
      recommended: recommendedPrice * retainerDiscount,
    };
  };

  const downloadAsImage = async () => {
    if (!downloadRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(downloadRef.current, {
        backgroundColor: '#FEE6EA',
        scale: 2,
        logging: true,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Remove all external stylesheets that contain oklch
          const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style');
          stylesheets.forEach((sheet) => {
            const element = sheet as HTMLElement;
            if (element.textContent?.includes('oklch') || element.textContent?.includes('oklab')) {
              element.remove();
            }
          });
          
          // Add inline styles with safe colors
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              --background: #FEE6EA !important;
              --foreground: #131718 !important;
              --card: #ffffff !important;
              --muted: #f5d3d8 !important;
              --muted-foreground: #4a4a4a !important;
              --primary: #131718 !important;
              --border: rgba(19, 23, 24, 0.1) !important;
            }
            .bg-background { background: #FEE6EA !important; }
            .bg-card { background: #ffffff !important; }
            .bg-muted { background: #f5d3d8 !important; }
            .text-foreground { color: #131718 !important; }
            .text-primary { color: #131718 !important; }
            .text-muted-foreground { color: #4a4a4a !important; }
            .border-border { border-color: rgba(19, 23, 24, 0.1) !important; }
          `;
          clonedDoc.head.appendChild(style);
        },
      });
      
      const link = document.createElement('a');
      link.download = `pricing-calculator-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error creating image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsPDF = async () => {
    if (!downloadRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(downloadRef.current, {
        backgroundColor: '#FEE6EA',
        scale: 2,
        logging: true,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Remove all external stylesheets that contain oklch
          const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style');
          stylesheets.forEach((sheet) => {
            const element = sheet as HTMLElement;
            if (element.textContent?.includes('oklch') || element.textContent?.includes('oklab')) {
              element.remove();
            }
          });
          
          // Add inline styles with safe colors
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              --background: #FEE6EA !important;
              --foreground: #131718 !important;
              --card: #ffffff !important;
              --muted: #f5d3d8 !important;
              --muted-foreground: #4a4a4a !important;
              --primary: #131718 !important;
              --border: rgba(19, 23, 24, 0.1) !important;
            }
            .bg-background { background: #FEE6EA !important; }
            .bg-card { background: #ffffff !important; }
            .bg-muted { background: #f5d3d8 !important; }
            .text-foreground { color: #131718 !important; }
            .text-primary { color: #131718 !important; }
            .text-muted-foreground { color: #4a4a4a !important; }
            .border-border { border-color: rgba(19, 23, 24, 0.1) !important; }
          `;
          clonedDoc.head.appendChild(style);
        },
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`pricing-calculator-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error creating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Service Pricing</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Your minimum rates to cover all costs, and recommended rates with profit margin.
        </p>
      </div>

      {/* Download Buttons */}
      <div className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h3 className="mb-1">Save Your Calculations</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Download your pricing to compare over time
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={downloadAsImage}
              disabled={isDownloading}
              variant="outline"
              className="flex-1 sm:flex-none border-border"
            >
              <FileImage className="h-4 w-4 mr-2" />
              PNG
            </Button>
            <Button
              onClick={downloadAsPDF}
              disabled={isDownloading}
              className="flex-1 sm:flex-none"
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Downloadable Content */}
      <div ref={downloadRef} className="space-y-4 p-6 bg-background rounded-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl mb-2">My Creator Pricing</h2>
          <p className="text-sm text-muted-foreground">
            Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-xl shadow-sm p-4 sm:p-6">
          <div className="space-y-3">
            <Label htmlFor="markup" className="text-sm">
              Markup Percentage
            </Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Input
                id="markup"
                type="number"
                value={markup}
                onChange={(e) => setMarkup(parseFloat(e.target.value) || 25)}
                className="bg-input-background border border-border w-full sm:w-32"
              />
              <span className="text-xs sm:text-sm text-muted-foreground">
                25% is standard, use 50%+ for rush jobs or specialized work
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service) => {
            const isRetainer = service.id === "retainer";
            const prices = calculatePrice(service.hoursOrScope, isRetainer);

            return (
              <div
                key={service.id}
                className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-xl shadow-sm p-4 sm:p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <h3 className="mb-1">{service.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{service.description}</p>
                    {isRetainer && (
                      <p className="text-xs text-muted-foreground mt-1">
                        10% discount applied for recurring work
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4 sm:gap-8">
                    <div className="text-left flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Base Rate</div>
                      <div className="text-base sm:text-lg">
                        ${prices.base.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-muted-foreground">break-even</div>
                    </div>
                    <div className="text-left flex-1 backdrop-blur-xl bg-primary/5 px-3 sm:px-4 py-2 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Recommended</div>
                      <div className="text-base sm:text-lg text-primary">
                        ${prices.recommended.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-muted-foreground">+{markup}% profit</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="backdrop-blur-xl bg-muted/50 border border-border/50 rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
          <h3>Key Principles 💜</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li>• <strong>Never price below Base Rate</strong> — that's working for free</li>
            <li>• <strong>Recommended Rate is your starting point</strong> — you can charge more based on experience, reputation, and demand</li>
            <li>• <strong>Use higher markup for rush jobs</strong> — 50%+ for tight deadlines or high-visibility work</li>
            <li>• <strong>Retainers get discounts</strong> — recurring revenue is worth 10-15% off</li>
            <li>• <strong>Review quarterly</strong> — update as your expenses and skills grow</li>
          </ul>
        </div>
      </div>
    </div>
  );
}