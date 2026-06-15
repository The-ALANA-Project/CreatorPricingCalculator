import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Download, FileImage, FileText, Plus, Trash2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { CreatorTypeData } from "./CreatorType";
import { createPortal } from "react-dom";
import { useLanguage } from "@/app/i18n/LanguageContext";

interface ServicePricingProps {
  targetIncome: number;
  billableHours: number;
  creatorData: CreatorTypeData;
  markup: number;
  onMarkupChange: (markup: number) => void;
  customServices: CustomService[];
  onCustomServicesChange: (services: CustomService[]) => void;
  selectedRateTier: 'base' | 'recommended';
}

interface ServiceOption {
  id: string;
  name: string;
  hoursOrScope: number;
  description: string;
}

export interface CustomService {
  id: string;
  name: string;
  deliveryHours: number;
  prepHours: number;
}

export interface ServicePricingRef {
  downloadAsImage: () => Promise<void>;
  downloadAsPDF: () => Promise<void>;
}

export const ServicePricing = forwardRef<ServicePricingRef, ServicePricingProps>(
  ({ targetIncome, billableHours, creatorData, markup, onMarkupChange, customServices, onCustomServicesChange, selectedRateTier }, ref) => {
    const { t } = useLanguage();
    const tp = t.pricing;
    // Calculate the raw base hourly rate (true break-even without any markup)
    const rawBaseHourlyRate = billableHours > 0 ? targetIncome / billableHours : 0;
    
    // Apply experience level multiplier for digital creators
    let experienceMultiplier = 1;
    if (creatorData.type === 'digital' && creatorData.experienceLevel) {
      switch (creatorData.experienceLevel) {
        case 'junior':
          experienceMultiplier = 0.85; // -15%
          break;
        case 'mid':
          experienceMultiplier = 1; // No adjustment
          break;
        case 'senior':
          experienceMultiplier = 1.2; // +20%
          break;
      }
    }
    
    // Apply project terms multiplier for digital creators
    let projectTermsMultiplier = 1;
    if (creatorData.type === 'digital' && creatorData.projectTerms) {
      switch (creatorData.projectTerms) {
        case 'standard':
          projectTermsMultiplier = 1; // No adjustment
          break;
        case 'extra_revisions':
          projectTermsMultiplier = 1.15; // +15%
          break;
        case 'rush':
          projectTermsMultiplier = 1.25; // +25%
          break;
        case 'rush_revisions':
          projectTermsMultiplier = 1.4; // +40%
          break;
      }
    }
    
    // Apply audience size multiplier for content creators
    let audienceMultiplier = 1;
    if (creatorData.type === 'content' && creatorData.primaryPlatform) {
      // Get follower/subscriber count based on platform
      let audienceSize = 0;
      if (creatorData.primaryPlatform === 'YouTube') audienceSize = creatorData.subscribers || 0;
      else if (creatorData.primaryPlatform === 'Instagram') audienceSize = creatorData.instagramFollowers || 0;
      else if (creatorData.primaryPlatform === 'TikTok') audienceSize = creatorData.tiktokFollowers || 0;
      else if (creatorData.primaryPlatform === 'Twitter/X') audienceSize = creatorData.twitterFollowers || 0;
      else if (creatorData.primaryPlatform === 'LinkedIn') audienceSize = creatorData.linkedinFollowers || 0;
      else if (creatorData.primaryPlatform === 'Blog/Newsletter') audienceSize = creatorData.blogNewsletterSubscribers || 0;

      // Calculate audience size multiplier
      if (audienceSize >= 1000000) {
        audienceMultiplier = 1.5; // 1M+ (Mega)
      } else if (audienceSize >= 500000) {
        audienceMultiplier = 1.4; // 500K+ (Large)
      } else if (audienceSize >= 100000) {
        audienceMultiplier = 1.3; // 100K+ (Mid)
      } else if (audienceSize >= 50000) {
        audienceMultiplier = 1.2; // 50K+ (Growing)
      } else if (audienceSize >= 10000) {
        audienceMultiplier = 1.1; // 10K+ (Micro)
      } else if (audienceSize >= 5000) {
        audienceMultiplier = 1.05; // 5K+ (Emerging)
      } else if (audienceSize >= 1000) {
        audienceMultiplier = 1.02; // 1K+ (Starting)
      }
    }
    
    // Apply engagement multiplier for content creators
    let engagementMultiplier = 1;
    if (creatorData.type === 'content' && creatorData.primaryPlatform) {
      const engagementRate = creatorData.engagementRate || 0;
      
      if (engagementRate > 0) {
        // Different benchmarks by platform - aligned with tooltip guidance
        
        // YouTube: Good 10-20% | Viral 50%+
        if (creatorData.primaryPlatform === 'YouTube' && engagementRate >= 50) {
          engagementMultiplier = 1.2; // Viral Engagement
        } else if (creatorData.primaryPlatform === 'YouTube' && engagementRate >= 20) {
          engagementMultiplier = 1.15; // High Engagement
        } else if (creatorData.primaryPlatform === 'YouTube' && engagementRate >= 10) {
          engagementMultiplier = 1.08; // Good Engagement
        }
        
        // Instagram: Good 3-5% | Great 7-10% | Exceptional 10%+
        else if (creatorData.primaryPlatform === 'Instagram' && engagementRate >= 10) {
          engagementMultiplier = 1.18; // Exceptional Engagement
        } else if (creatorData.primaryPlatform === 'Instagram' && engagementRate >= 7) {
          engagementMultiplier = 1.15; // Great Engagement
        } else if (creatorData.primaryPlatform === 'Instagram' && engagementRate >= 3) {
          engagementMultiplier = 1.08; // Good Engagement
        }
        
        // TikTok: Good 50-100% | Viral 200%+
        else if (creatorData.primaryPlatform === 'TikTok' && engagementRate >= 200) {
          engagementMultiplier = 1.25; // Viral Engagement
        } else if (creatorData.primaryPlatform === 'TikTok' && engagementRate >= 100) {
          engagementMultiplier = 1.15; // High Engagement
        } else if (creatorData.primaryPlatform === 'TikTok' && engagementRate >= 50) {
          engagementMultiplier = 1.08; // Good Engagement
        }
        
        // Twitter/X: Good 1-3% | Great 5%+
        else if (creatorData.primaryPlatform === 'Twitter/X' && engagementRate >= 5) {
          engagementMultiplier = 1.15; // Great Engagement
        } else if (creatorData.primaryPlatform === 'Twitter/X' && engagementRate >= 1) {
          engagementMultiplier = 1.08; // Good Engagement
        }
        
        // LinkedIn: Good 1-3% | Great 5%+
        else if (creatorData.primaryPlatform === 'LinkedIn' && engagementRate >= 5) {
          engagementMultiplier = 1.15; // Great Engagement
        } else if (creatorData.primaryPlatform === 'LinkedIn' && engagementRate >= 1) {
          engagementMultiplier = 1.08; // Good Engagement
        }
        
        // Blog/Newsletter: Good 1-2% | Great 3-4%+
        else if (creatorData.primaryPlatform === 'Blog/Newsletter' && engagementRate >= 3) {
          engagementMultiplier = 1.15; // Great Engagement
        } else if (creatorData.primaryPlatform === 'Blog/Newsletter' && engagementRate >= 1) {
          engagementMultiplier = 1.08; // Good Engagement
        }
      }
    }
    
    // Calculate the true base hourly rate (break-even with all multipliers applied)
    const trueBaseHourlyRate = rawBaseHourlyRate * experienceMultiplier * projectTermsMultiplier * audienceMultiplier * engagementMultiplier;
    
    // Calculate the markup that was selected in Step 3
    const step3Markup = selectedRateTier === 'recommended' ? 25 : 0;
    
    // For custom services (workshops, consulting), use appropriate multipliers per creator type:
    // - Digital creators: Use experience level only (project terms are for client work, not consulting)
    // - Content creators: Use neither audience nor engagement (those are for content posting only)
    let baseHourlyRateForCustomServices = rawBaseHourlyRate;
    
    if (creatorData.type === 'digital') {
      // Digital creators: Apply experience level only
      baseHourlyRateForCustomServices = rawBaseHourlyRate * experienceMultiplier;
    } else if (creatorData.type === 'content') {
      // Content creators: No audience/engagement adjustments for consulting work
      baseHourlyRateForCustomServices = rawBaseHourlyRate;
    }
    
    const selectedHourlyRate = selectedRateTier === 'recommended' ? baseHourlyRateForCustomServices * 1.25 : baseHourlyRateForCustomServices;
    
    // Calculate total profit margin (Step 3 markup + Step 4 additional markup)
    const totalProfitMargin = step3Markup + markup;

    // Physical creator calculations
    const isPhysicalCreator = creatorData.type === 'physical';
    const hoursPerUnit = creatorData.hoursPerUnit || 0;
    const materialCost = creatorData.avgMaterialCost || 0;
    const shippingCost = creatorData.shippingCost || 0;
    const salesChannel = creatorData.salesChannel || 'retail';
    
    // For physical creators, we need to apply the tier selection markup to their hourly rate
    // This matches Step 3 which uses selectedHourlyRate (base or recommended)
    const physicalCreatorHourlyRate = isPhysicalCreator 
      ? (selectedRateTier === 'recommended' ? rawBaseHourlyRate * 1.25 : rawBaseHourlyRate)
      : 0;
    
    // Calculate cost per unit for physical creators
    const laborCostPerUnit = isPhysicalCreator ? physicalCreatorHourlyRate * hoursPerUnit : trueBaseHourlyRate * hoursPerUnit;
    const totalCostPerUnit = laborCostPerUnit + materialCost;
    const wholesalePrice = totalCostPerUnit * 2; // 2x cost
    const retailPrice = totalCostPerUnit * 3; // 3x cost
    const wholesalePriceWithShipping = wholesalePrice + shippingCost;
    const retailPriceWithShipping = retailPrice + shippingCost;

    const [isDownloading, setIsDownloading] = useState(false);
    const [showCaptureOverlay, setShowCaptureOverlay] = useState(false);
    const downloadRef = useRef<HTMLDivElement>(null);
    
    const addCustomService = () => {
      const newService: CustomService = {
        id: crypto.randomUUID(),
        name: "",
        deliveryHours: 0,
        prepHours: 0,
      };
      onCustomServicesChange([...customServices, newService]);
    };

    const removeCustomService = (id: string) => {
      onCustomServicesChange(customServices.filter(service => service.id !== id));
    };

    const updateCustomService = (id: string, field: keyof CustomService, value: string | number) => {
      onCustomServicesChange(customServices.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      ));
    };
    
    const services: ServiceOption[] = [
      { id: "hourly", name: tp.services.hourly.name, hoursOrScope: 1, description: tp.services.hourly.description },
      { id: "day", name: tp.services.day.name, hoursOrScope: 8, description: tp.services.day.description },
      { id: "small", name: tp.services.small.name, hoursOrScope: 15, description: tp.services.small.description },
      { id: "medium", name: tp.services.medium.name, hoursOrScope: 30, description: tp.services.medium.description },
      { id: "large", name: tp.services.large.name, hoursOrScope: 60, description: tp.services.large.description },
      { id: "retainer", name: tp.services.retainer.name, hoursOrScope: 40, description: tp.services.retainer.description },
    ];

    // For content creators, only show hourly rate - they use custom services for everything else
    const displayServices = !isPhysicalCreator 
      ? services.filter(s => s.id === "hourly")
      : services;
    
    const calculatePrice = (hours: number, serviceId?: string) => {
      // Base price is always the break-even rate
      const basePrice = trueBaseHourlyRate * hours;
      
      // Recommended price includes Step 3 tier selection + Step 4 additional markup
      const recommendedPrice = basePrice * (1 + totalProfitMargin / 100);
      
      // Apply volume/retainer discounts based on service type
      let discount = 1; // No discount by default
      if (serviceId === 'medium') {
        discount = 0.95; // 5% discount
      } else if (serviceId === 'large') {
        discount = 0.90; // 10% discount
      } else if (serviceId === 'retainer') {
        discount = 0.85; // 15% discount
      }
      
      return {
        base: basePrice * discount,
        recommended: recommendedPrice * discount,
      };
    };

    const downloadAsImage = async () => {
      setIsDownloading(true);
      setShowCaptureOverlay(true);
      
      try {
        // Wait for overlay to render
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!downloadRef.current) {
          throw new Error('Download ref is null');
        }
        
        const canvas = await html2canvas(downloadRef.current, {
          backgroundColor: '#FEE6EA',
          scale: 2,
          logging: false,
          allowTaint: true,
          useCORS: false,
          width: 800,
          height: downloadRef.current.scrollHeight,
        });
        
        if (canvas.width === 0 || canvas.height === 0) {
          throw new Error('Canvas has zero dimensions');
        }
        
        const dataUrl = canvas.toDataURL('image/png');
        
        if (!dataUrl || dataUrl === 'data:,') {
          throw new Error('Canvas toDataURL returned empty');
        }
        
        const link = document.createElement('a');
        link.download = `pricing-calculator-${new Date().toISOString().split('T')[0]}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
        alert(`Error creating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setShowCaptureOverlay(false);
        setIsDownloading(false);
      }
    };

    const downloadAsPDF = async () => {
      setIsDownloading(true);
      setShowCaptureOverlay(true);
      
      try {
        // Wait for overlay to render
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!downloadRef.current) {
          throw new Error('Download ref is null');
        }
        
        const canvas = await html2canvas(downloadRef.current, {
          backgroundColor: '#FEE6EA',
          scale: 2,
          logging: false,
          allowTaint: true,
          useCORS: false,
          width: 800,
          height: downloadRef.current.scrollHeight,
        });
        
        if (canvas.width === 0 || canvas.height === 0) {
          throw new Error('Canvas has zero dimensions');
        }
        
        const imgData = canvas.toDataURL('image/png');
        
        if (!imgData || imgData === 'data:,') {
          throw new Error('Canvas toDataURL returned empty');
        }
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`pricing-calculator-${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert(`Error creating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setShowCaptureOverlay(false);
        setIsDownloading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      downloadAsImage,
      downloadAsPDF,
    }));

    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-2">{tp.title}</h2>
          <p className="text-muted-foreground text-[16px]">
            {tp.subtitle} <strong>{tp.currencyNote}</strong>
          </p>
        </div>

        {/* Profit Margin Control */}
        {!isPhysicalCreator && (
          <div className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <Label className="text-base font-semibold">{tp.additionalMargin}</Label>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {tp.marginDesc}
              </p>
            </div>

            {/* Slider + Input */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={markup}
                  onChange={(e) => onMarkupChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer slider-custom"
                  style={{
                    background: `linear-gradient(to right, #131718 0%, #131718 ${markup}%, #e5e7eb ${markup}%, #e5e7eb 100%)`
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={markup}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) onMarkupChange(Math.max(0, Math.min(100, val)));
                  }}
                  className="w-20 px-3 py-2 bg-input-background border border-border rounded-lg text-center text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground min-w-[20px]">%</span>
              </div>

              {/* Recommendations */}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span><strong className="text-foreground">15-25%</strong> {tp.competitive}</span>
                <span>•</span>
                <span><strong className="text-foreground">25-35%</strong> {tp.standard}</span>
                <span>•</span>
                <span><strong className="text-foreground">35-50%</strong> {tp.premium}</span>
                <span>•</span>
                <span><strong className="text-foreground">50%+</strong> {tp.specialized}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Custom Services Section - For Digital Creators */}
        {!isPhysicalCreator && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[18px]">{tp.customServices}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {tp.customServicesDesc.replace('{rate}', selectedHourlyRate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }))}
                </p>
              </div>
              <Button
                onClick={addCustomService}
                size="sm"
                className="flex-shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                {tp.add}
              </Button>
            </div>

            {/* Custom Service Cards */}
            {customServices.length === 0 ? (
              <div className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-8 text-center">
                <p className="text-muted-foreground text-sm">
                  {tp.noCustomServices}
                </p>
              </div>
            ) : (
              customServices.map((service) => {
                const totalHours = service.deliveryHours + service.prepHours;
                const prices = calculatePrice(totalHours);

                return (
                  <div
                    key={service.id}
                    className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-5"
                  >
                    <div className="space-y-4">
                      {/* Input Fields */}
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs mb-1.5 block">{tp.projectName}</Label>
                          <Input
                            type="text"
                            placeholder={tp.projectNamePlaceholder}
                            value={service.name}
                            onChange={(e) => updateCustomService(service.id, 'name', e.target.value)}
                            className="text-sm border border-border"
                          />
                        </div>
                        <div className="flex gap-3 items-end">
                          <div className="flex-1">
                            <Label className="text-xs mb-1.5 block">{tp.deliveryHours}</Label>
                            <Input
                              type="number"
                              placeholder="8"
                              value={service.deliveryHours || ''}
                              onChange={(e) => updateCustomService(service.id, 'deliveryHours', parseFloat(e.target.value) || 0)}
                              className="text-sm border border-border"
                              min="0"
                              step="0.5"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs mb-1.5 block">{tp.prepHours}</Label>
                            <Input
                              type="number"
                              placeholder="5"
                              value={service.prepHours || ''}
                              onChange={(e) => updateCustomService(service.id, 'prepHours', parseFloat(e.target.value) || 0)}
                              className="text-sm border border-border"
                              min="0"
                              step="0.5"
                            />
                          </div>
                          <Button
                            onClick={() => removeCustomService(service.id)}
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-[#131718]" />
                          </Button>
                        </div>
                      </div>

                      {/* Hour Breakdown */}
                      {totalHours > 0 && (
                        <div className="rounded-lg p-3 text-xs text-muted-foreground bg-[#fee6ea]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>{service.deliveryHours}h {tp.delivery}</span>
                            <span>+</span>
                            <span>{service.prepHours}h {tp.prep}</span>
                            <span>=</span>
                            <span className="font-semibold text-foreground">{totalHours}h {tp.total}</span>
                            <span>×</span>
                            <span className="font-semibold text-foreground">{selectedHourlyRate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/hr</span>
                          </div>
                        </div>
                      )}

                      {/* Pricing Display */}
                      <div className="flex gap-4 sm:gap-8">
                        <div className="text-left flex-1 backdrop-blur-xl bg-primary/5 rounded-lg p-3 sm:p-4">
                          <div className="text-xs text-muted-foreground mb-1">{tp.baseRate}</div>
                          <div className="text-base sm:text-lg">
                            {prices.base.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                          <div className="text-xs text-muted-foreground">{tp.breakEven}</div>
                        </div>
                        <div className="text-left flex-1 backdrop-blur-xl bg-[#FEE6EA] border border-[#FEE6EA] rounded-lg p-3 sm:p-4">
                          <div className="text-xs text-[#131718]/70 mb-1">{tp.recommended}</div>
                          <div className="text-base sm:text-lg text-[#131718] font-semibold">
                            {prices.recommended.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                          <div className="text-xs text-[#131718]/60">+{totalProfitMargin}% profit</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Standard Services Header - Only show for digital creators */}
        {!isPhysicalCreator && (
          <div>
            <h3 className="text-lg font-semibold mb-1">{tp.standardServices}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {tp.standardServicesDesc}
            </p>
          </div>
        )}
        
        {/* Service Pricing Cards - Visible on Website */}
        <div className="space-y-3">
          {isPhysicalCreator ? (
            /* Physical Creator Pricing - Per Unit */
            <div className="space-y-6">
              {/* Cost Breakdown */}
              <div className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-5">
                <h3 className="mb-4 text-[18px]">{tp.costBreakdown}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{tp.labor.replace('{hours}', String(hoursPerUnit))}</span>
                    <span className="font-medium">{laborCostPerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{tp.materials}</span>
                    <span className="font-medium">{materialCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-border">
                    <span className="font-semibold">{tp.totalCost}</span>
                    <span className="font-semibold">{totalCostPerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Wholesale Pricing */}
              <div className={`backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-5 ${salesChannel === 'wholesale' ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="mb-0 text-[18px]">{tp.wholesalePrice}</h3>
                  {salesChannel === 'wholesale' && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">{tp.selected}</span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">{tp.withoutShipping}</div>
                      <div className="text-2xl font-semibold">
                        {wholesalePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-muted-foreground">{tp.wholesaleDesc}</div>
                    </div>
                    {shippingCost > 0 && (
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">{tp.withShipping}</div>
                        <div className="text-xl font-semibold text-primary">
                          {wholesalePriceWithShipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">+{shippingCost} shipping</div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                    {tp.wholesaleNote}
                  </p>
                </div>
              </div>

              {/* Retail/Direct Pricing */}
              <div className={`backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-5 ${salesChannel === 'retail' ? 'ring-1 ring-[#131718]' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="mb-0 text-[18px]">{tp.directRetailPrice}</h3>
                  {salesChannel === 'retail' && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">{tp.selected}</span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">{tp.withoutShipping}</div>
                      <div className="text-2xl font-semibold">
                        {retailPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-muted-foreground">{tp.directRetailDesc}</div>
                    </div>
                    {shippingCost > 0 && (
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">{tp.withShipping}</div>
                        <div className="text-xl font-semibold text-primary">
                          {retailPriceWithShipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">+{shippingCost} shipping</div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                    {tp.directRetailNote}
                  </p>
                </div>
              </div>

              {/* Base Hourly Reference */}
              <div className="bg-[#FEE6EA] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-muted-foreground mb-1 text-[#131718] text-[18px]">{tp.selectedHourlyRate}</div>
                    <div className="text-lg font-semibold">
                      {trueBaseHourlyRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/hr
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          ) : (
            /* Digital/Content Creator Pricing - Hourly Services */
            <>
              {displayServices.map((service) => {
                const isRetainer = service.id === "retainer";
                const prices = calculatePrice(service.hoursOrScope, service.id);

                return (
                  <div
                    key={service.id}
                    className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] hover:border-white/30 transition-all duration-300"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex-1">
                        <h3 className="mb-1">{service.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <div className="flex gap-4 sm:gap-8">
                        <div className="text-left flex-1 backdrop-blur-xl bg-primary/5 rounded-lg p-3 sm:p-4">
                          <div className="text-xs text-muted-foreground mb-1">{tp.baseRate}</div>
                          <div className="text-base sm:text-lg">
                            {prices.base.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                          <div className="text-xs text-muted-foreground">{tp.breakEven}</div>
                        </div>
                        <div className="text-left flex-1 backdrop-blur-xl bg-[#FEE6EA] border border-[#FEE6EA] rounded-lg p-3 sm:p-4">
                          <div className="text-xs text-[#131718]/70 mb-1">{tp.recommended}</div>
                          <div className="text-base sm:text-lg text-[#131718] font-semibold">
                            {prices.recommended.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                          <div className="text-xs text-[#131718]/60">+{totalProfitMargin}% profit</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Key Principles - Visible on Website */}
        <div className="backdrop-blur-xl bg-primary border border-primary/20 rounded-lg shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="text-primary-foreground text-[18px]">{tp.principles}</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-primary-foreground/70">
            <li dangerouslySetInnerHTML={{ __html: `• ${tp.principle1}` }} />
            <li dangerouslySetInnerHTML={{ __html: `• ${tp.principle2}` }} />
            <li dangerouslySetInnerHTML={{ __html: `• ${tp.principle3}` }} />
          </ul>
        </div>

        {/* Download Template Overlay - Only for Digital/Content Creators */}
        {!isPhysicalCreator && showCaptureOverlay ? (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div ref={downloadRef} style={{ 
              width: '800px', 
              padding: '48px', 
              backgroundColor: '#FEE6EA',
              fontFamily: 'Work Sans, system-ui, sans-serif'
            }}>
              {/* Header */}
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#131718',
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                  textAlign: 'left'
                }}>
                  {tp.download.creatorPricing}
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(19, 23, 24, 0.6)',
                  marginBottom: '24px',
                  textAlign: 'left'
                }}>
                  {tp.download.generatedOn.replace('{date}', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}
                </p>
              </div>

              {/* Service Cards */}
              <div style={{ marginBottom: '32px' }}>
                {/* Custom Services - Show First */}
                {customServices.map(service => (
                  <div
                    key={service.id}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #131718',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#131718',
                        marginBottom: '4px',
                        textAlign: 'left'
                      }}>
                        {service.name}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: 'rgba(19, 23, 24, 0.6)',
                        margin: 0,
                        textAlign: 'left'
                      }}>
                        {tp.download.customService}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(19, 23, 24, 0.6)',
                          marginBottom: '4px',
                          textAlign: 'left'
                        }}>
                          Base Rate
                        </div>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: '600', 
                          color: '#131718',
                          textAlign: 'left'
                        }}>
                          {calculatePrice(service.deliveryHours + service.prepHours).base.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(19, 23, 24, 0.6)',
                          textAlign: 'left'
                        }}>
                          break-even
                        </div>
                      </div>
                      <div style={{ 
                        flex: 1,
                        backgroundColor: '#FEE6EA',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #131718'
                      }}>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(19, 23, 24, 0.6)',
                          marginBottom: '4px',
                          textAlign: 'left'
                        }}>
                          Recommended
                        </div>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: '700', 
                          color: '#131718',
                          textAlign: 'left'
                        }}>
                          {calculatePrice(service.deliveryHours + service.prepHours).recommended.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(19, 23, 24, 0.6)',
                          textAlign: 'left'
                        }}>
                          +{totalProfitMargin}% profit
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Regular Services */}
                {displayServices.map((service, index) => {
                  const isRetainer = service.id === "retainer";
                  const prices = calculatePrice(service.hoursOrScope, service.id);

                  return (
                    <div
                      key={service.id}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #131718',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: index < displayServices.length - 1 ? '12px' : '0'
                      }}
                    >
                      <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ 
                          fontSize: '18px', 
                          fontWeight: '600', 
                          color: '#131718',
                          marginBottom: '4px',
                          textAlign: 'left'
                        }}>
                          {service.name}
                        </h3>
                        <p style={{ 
                          fontSize: '14px', 
                          color: 'rgba(19, 23, 24, 0.6)',
                          margin: 0,
                          textAlign: 'left'
                        }}>
                          {service.description}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '12px', 
                            color: 'rgba(19, 23, 24, 0.6)',
                            marginBottom: '4px',
                            textAlign: 'left'
                          }}>
                            Base Rate
                          </div>
                          <div style={{ 
                            fontSize: '24px', 
                            fontWeight: '600', 
                            color: '#131718',
                            textAlign: 'left'
                          }}>
                            {prices.base.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: 'rgba(19, 23, 24, 0.6)',
                            textAlign: 'left'
                          }}>
                            break-even
                          </div>
                        </div>
                        <div style={{ 
                          flex: 1,
                          backgroundColor: '#FEE6EA',
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid #131718'
                        }}>
                          <div style={{ 
                            fontSize: '12px', 
                            color: 'rgba(19, 23, 24, 0.6)',
                            marginBottom: '4px',
                            textAlign: 'left'
                          }}>
                            Recommended
                          </div>
                          <div style={{ 
                            fontSize: '24px', 
                            fontWeight: '700', 
                            color: '#131718',
                            textAlign: 'left'
                          }}>
                            {prices.recommended.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: 'rgba(19, 23, 24, 0.6)',
                            textAlign: 'left'
                          }}>
                            +{totalProfitMargin}% profit
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div style={{ 
                borderTop: '1px solid #131718',
                paddingTop: '24px',
                textAlign: 'left',
                marginBottom: 0
              }}>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(19, 23, 24, 0.7)',
                  margin: '0 0 8px 0',
                  textAlign: 'left',
                  lineHeight: '1.4'
                }}>
                  {tp.download.shareText}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(19, 23, 24, 0.6)',
                  margin: 0,
                  textAlign: 'left',
                  lineHeight: '1.4'
                }}>
                  {tp.download.madeWith}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Download Template Overlay - Only for Physical Creators */}
        {isPhysicalCreator && showCaptureOverlay ? (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div ref={downloadRef} style={{ 
              width: '800px', 
              padding: '48px', 
              backgroundColor: '#FEE6EA',
              fontFamily: 'Work Sans, system-ui, sans-serif'
            }}>
              {/* Header */}
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#131718',
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                  textAlign: 'left'
                }}>
                  {tp.download.productPricing}
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(19, 23, 24, 0.6)',
                  marginBottom: '24px',
                  textAlign: 'left'
                }}>
                  {tp.download.generatedOn.replace('{date}', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}
                </p>
              </div>

              {/* Cost Breakdown */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #131718',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#131718',
                  marginBottom: '16px',
                  textAlign: 'left'
                }}>
                  {tp.costBreakdown}
                </h3>
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(19, 23, 24, 0.6)' }}>
                    {tp.labor.replace('{hours}', String(hoursPerUnit))}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#131718' }}>
                    {laborCostPerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(19, 23, 24, 0.6)' }}>{tp.materials}</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#131718' }}>
                    {materialCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid #131718', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#131718' }}>
                    {tp.totalCost}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#131718' }}>
                    {totalCostPerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Wholesale Price */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #131718',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#131718',
                  marginBottom: '16px',
                  textAlign: 'left'
                }}>
                  {tp.wholesalePrice}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(19, 23, 24, 0.6)', marginBottom: '4px' }}>
                      {tp.withoutShipping}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#131718' }}>
                      {wholesalePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(19, 23, 24, 0.6)' }}>{tp.wholesaleDesc}</div>
                  </div>
                  {shippingCost > 0 && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: 'rgba(19, 23, 24, 0.6)', marginBottom: '4px' }}>
                        {tp.withShipping}
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#131718' }}>
                        {wholesalePriceWithShipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(19, 23, 24, 0.6)' }}>+{shippingCost} shipping</div>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(19, 23, 24, 0.6)', borderTop: '1px solid #131718', paddingTop: '8px', margin: 0 }}>
                  {tp.wholesaleNote}
                </p>
              </div>

              {/* Retail Price */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #131718',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '32px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#131718',
                  marginBottom: '16px',
                  textAlign: 'left'
                }}>
                  {tp.directRetailPrice}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(19, 23, 24, 0.6)', marginBottom: '4px' }}>
                      {tp.withoutShipping}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#131718' }}>
                      {retailPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(19, 23, 24, 0.6)' }}>{tp.directRetailDesc}</div>
                  </div>
                  {shippingCost > 0 && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: 'rgba(19, 23, 24, 0.6)', marginBottom: '4px' }}>
                        {tp.withShipping}
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#131718' }}>
                        {retailPriceWithShipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(19, 23, 24, 0.6)' }}>+{shippingCost} shipping</div>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(19, 23, 24, 0.6)', borderTop: '1px solid #131718', paddingTop: '8px', margin: 0 }}>
                  {tp.directRetailNote}
                </p>
              </div>

              {/* Base Hourly Rate */}
              <div style={{
                backgroundColor: '#FEE6EA',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '32px'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#131718', marginBottom: '4px', textAlign: 'left' }}>
                    {tp.selectedHourlyRate}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#131718', textAlign: 'left' }}>
                    {physicalCreatorHourlyRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/hr
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ 
                borderTop: '1px solid #131718',
                paddingTop: '24px',
                textAlign: 'left',
                marginBottom: 0
              }}>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(19, 23, 24, 0.7)',
                  margin: '0 0 8px 0',
                  textAlign: 'left',
                  lineHeight: '1.4'
                }}>
                  {tp.download.productShareText}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(19, 23, 24, 0.6)',
                  margin: 0,
                  textAlign: 'left',
                  lineHeight: '1.4'
                }}>
                  {tp.download.madeWith}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
);

ServicePricing.displayName = 'ServicePricing';