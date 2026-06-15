import { useState, useRef, useEffect } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent } from "@/app/components/ui/card";
import { Palette, Package, Video, Lightbulb } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

export type CreatorTypeValue = "digital" | "physical" | "content";

export interface CreatorTypeData {
  type: CreatorTypeValue;
  // Digital creator fields
  experienceLevel: "junior" | "mid" | "senior"; // Required for digital creators
  projectTerms?: "standard" | "extra_revisions" | "rush" | "rush_revisions"; // Project terms multiplier
  // Physical creator fields
  hoursPerUnit?: number; // How long it takes to make one unit
  avgMaterialCost?: number; // Average material cost per unit
  salesChannel?: "wholesale" | "retail"; // Wholesale (2x) or Direct-to-Consumer/Retail (3x)
  shippingCost?: number; // Average shipping/handling cost
  // Content creator fields
  primaryPlatform?: "YouTube" | "TikTok" | "Instagram" | "Twitter/X" | "LinkedIn" | "Blog/Newsletter";
  hoursPerContent?: number; // Estimated hours per post/video/content piece
  subscribers?: number; // YouTube
  avgViews?: number; // YouTube
  avgWatchTimePercent?: number; // YouTube
  engagementRate?: number; // YouTube
  instagramFollowers?: number; // Instagram
  instagramAvgLikes?: number; // Instagram
  instagramAvgComments?: number; // Instagram
  tiktokFollowers?: number; // TikTok
  tiktokAvgViews?: number; // TikTok
  tiktokAvgLikes?: number; // TikTok
  tiktokAvgComments?: number; // TikTok
  twitterFollowers?: number; // Twitter/X
  twitterAvgImpressions?: number; // Twitter/X
  twitterAvgEngagements?: number; // Twitter/X
  linkedinFollowers?: number; // LinkedIn
  linkedinAvgImpressions?: number; // LinkedIn
  linkedinAvgEngagements?: number; // LinkedIn
  blogNewsletterSubscribers?: number; // Blog/Newsletter
  blogNewsletterOpenRate?: number; // Blog/Newsletter - percentage
  blogNewsletterCTR?: number; // Blog/Newsletter - click-through rate percentage
  contentType?: "sponsored_post" | "video" | "short" | "story" | "series" | "blog_post" | "newsletter_issue" | "article_series" | "sponsored_article" | "guest_post"; // Content type
  usageRights?: "organic" | "paid_ad" | "exclusive"; // Usage rights
  markup?: number; // Markup percentage
}

interface CreatorTypeProps {
  data: CreatorTypeData;
  onDataChange: (data: CreatorTypeData) => void;
  targetIncome: number;
  billableHours: number;
  selectedRateTier: 'base' | 'recommended';
  onSelectedRateTierChange: (tier: 'base' | 'recommended') => void;
}

export function CreatorType({ data, onDataChange, targetIncome, billableHours, selectedRateTier, onSelectedRateTierChange }: CreatorTypeProps) {
  const { t } = useLanguage();
  const tc = t.creator;
  const updateData = (updates: Partial<CreatorTypeData>) => {
    onDataChange({ ...data, ...updates });
  };

  // Refs for scrolling to each card
  const digitalCardRef = useRef<HTMLDivElement>(null);
  const physicalCardRef = useRef<HTMLDivElement>(null);
  const contentCardRef = useRef<HTMLDivElement>(null);

  // Scroll to the selected card when user clicks (not on mount/navigation)
  const scrollToCard = (cardRef: React.RefObject<HTMLDivElement>) => {
    if (cardRef.current) {
      const yOffset = -100; // Scroll 100px above the card
      const y = cardRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Calculate base rates from Step 2 (without any creator-specific adjustments)
  const baseHourlyRate = billableHours > 0 ? targetIncome / billableHours : 0;
  const recommendedHourlyRate = baseHourlyRate * 1.25; // +25% markup
  
  // The selected hourly rate based on user's choice
  const selectedHourlyRate = selectedRateTier === 'recommended' ? recommendedHourlyRate : baseHourlyRate;

  const creatorTypes = [
    {
      value: "digital" as CreatorTypeValue,
      icon: Palette,
      title: tc.types.digital.title,
      description: tc.types.digital.desc,
    },
    {
      value: "physical" as CreatorTypeValue,
      icon: Package,
      title: tc.types.physical.title,
      description: tc.types.physical.desc,
    },
    {
      value: "content" as CreatorTypeValue,
      icon: Video,
      title: tc.types.content.title,
      description: tc.types.content.desc,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">{tc.title}</h2>
        <p className="text-muted-foreground text-[16px]">
          {tc.subtitle}
        </p>
      </div>

      {/* Rate Summary Card - Your Foundation from Step 2 */}
      <div className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-semibold mb-1">{tc.baseRates}</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {tc.baseRatesSubtitle}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onSelectedRateTierChange('base')}
            className={`backdrop-blur-xl rounded-lg p-4 text-left transition-all ${
              selectedRateTier === 'base'
                ? 'bg-primary/5 border border-[#131718]'
                : 'bg-primary/5 hover:bg-primary/10 border border-transparent hover:border-primary/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-muted-foreground text-xs">{tc.baseHourlyRate}</div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedRateTier === 'base' ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {selectedRateTier === 'base' && (
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                )}
              </div>
            </div>
            <div className="text-foreground text-2xl sm:text-3xl">
              {baseHourlyRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-base font-normal">/hr</span>
            </div>
            <div className="text-muted-foreground text-xs mt-1">{tc.baseRateHint}</div>
          </button>
          <button
            onClick={() => onSelectedRateTierChange('recommended')}
            className={`backdrop-blur-xl rounded-lg p-4 text-left transition-all ${
              selectedRateTier === 'recommended'
                ? 'bg-[#FEE6EA] border border-[#131718]'
                : 'bg-[#FEE6EA] border border-[#FEE6EA] hover:border-[#131718]/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-[#131718]/70 text-xs">{tc.recommendedRate}</div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedRateTier === 'recommended' ? 'border-[#131718] bg-[#131718]' : 'border-[#131718]/30'
              }`}>
                {selectedRateTier === 'recommended' && (
                  <div className="w-2 h-2 bg-[#FEE6EA] rounded-full" />
                )}
              </div>
            </div>
            <div className="text-[#131718] text-2xl sm:text-3xl">
              {recommendedHourlyRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-base font-normal">/hr</span>
            </div>
            <div className="text-[#131718]/60 text-xs mt-1">{tc.recommendedRateHint}</div>
          </button>
        </div>
        
      </div>

      {/* Creator Type Selection with Dropdown Fields */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {creatorTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = data.type === type.value;
          
          // Get the appropriate ref for this card
          const cardRef = type.value === 'digital' ? digitalCardRef 
                        : type.value === 'physical' ? physicalCardRef 
                        : contentCardRef;
          
          return (
            <div 
              key={type.value}
              ref={cardRef}
              className={`
                backdrop-blur-2xl bg-card/60 
                border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]
                transition-all duration-300
                ${isSelected 
                  ? 'ring-1 ring-primary shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] border-primary/30' 
                  : 'hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:border-white/30'
                }
              `}
            >
              {/* Creator Type Button */}
              <button
                onClick={() => {
                  // Only select, never deselect - keeps the accordion open when selected
                  if (!isSelected) {
                    updateData({ type: type.value });
                    // Scroll to the card after selection
                    setTimeout(() => scrollToCard(cardRef), 100);
                  }
                }}
                className="w-full text-left p-4 sm:p-5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold mb-1">{type.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{type.description}</p>
                  </div>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Content - Digital Creator */}
              {isSelected && type.value === "digital" && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-6">
                  <div className="border-t border-border/50 pt-4 space-y-4">
                    <h3 className="font-semibold text-[16px]">{tc.experienceLevel}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { level: "junior", ...tc.experience.junior },
                        { level: "mid", ...tc.experience.mid },
                        { level: "senior", ...tc.experience.senior },
                      ].map((item) => (
                        <div key={item.level} className="flex flex-col gap-2">
                          <button
                            onClick={() => updateData({ experienceLevel: item.level as any })}
                            className={`
                              px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border
                              ${data.experienceLevel === item.level
                                ? 'bg-primary text-primary-foreground shadow-md border-primary'
                                : 'bg-[#FEE6EA] text-[#131718] border-transparent hover:border-[#131718]'
                              }
                            `}
                          >
                            {item.label}
                          </button>
                          <p className="text-xs text-muted-foreground text-left -mt-2.5 mx-[0px] mt-[-6px] mb-[0px]">
                            <span className="font-medium">{item.years}</span> • {item.adjustment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Terms */}
                  <div className="border-t border-border/50 pt-4 space-y-4">
                    <h3 className="font-semibold text-[16px]">{tc.projectTerms}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { term: "standard", ...tc.terms.standard },
                        { term: "extra_revisions", ...tc.terms.extra_revisions },
                        { term: "rush", ...tc.terms.rush },
                        { term: "rush_revisions", ...tc.terms.rush_revisions },
                      ].map((item) => (
                        <div key={item.term} className="flex flex-col gap-2">
                          <button
                            onClick={() => updateData({ projectTerms: item.term as any })}
                            className={`
                              px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border
                              ${data.projectTerms === item.term
                                ? 'bg-primary text-primary-foreground shadow-md border-primary'
                                : 'bg-[#FEE6EA] text-[#131718] border-transparent hover:border-[#131718]'
                              }
                            `}
                          >
                            {item.label}
                          </button>
                          <p className="text-xs text-muted-foreground text-left -mt-2.5 mx-[0px] mt-[-6px] mb-[0px]">
                            <span className="font-medium">{item.desc}</span> • {item.adjustment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Your Adjusted Rates Preview - Digital Creator */}
                  {data.experienceLevel && (
                    <div className="bg-[#FEE6EA] border border-[#FEE6EA] rounded-lg shadow-md p-4">
                      <h3 className="font-semibold mb-3 text-[#131718] text-[16px]">{tc.adjustedRates}</h3>
                      <div className="space-y-3">
                        {(() => {
                          // Experience level multipliers
                          const expMultiplier = data.experienceLevel === 'junior' ? 0.85 :
                                              data.experienceLevel === 'senior' ? 1.20 : 1.0;
                          
                          // Project terms multipliers
                          const termsMultiplier = data.projectTerms === 'extra_revisions' ? 1.15 :
                                                 data.projectTerms === 'rush' ? 1.25 :
                                                 data.projectTerms === 'rush_revisions' ? 1.40 : 1.0;
                          
                          const adjustedRate = selectedHourlyRate * expMultiplier * termsMultiplier;

                          return (
                            <>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#131718]/70">{tc.startingRate} ({selectedRateTier === 'recommended' ? tc.recommendedRate.split(' ')[0] : tc.baseHourlyRate.split(' ')[0]})</span>
                                <span className="font-medium text-[#131718]">{selectedHourlyRate.toFixed(2)}/hr</span>
                              </div>
                              {expMultiplier !== 1.0 && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[#131718]/70">{tc.experienceLabel} ({data.experienceLevel})</span>
                                  <span className="font-medium text-[#131718]">{expMultiplier < 1 ? '' : '+'}{((expMultiplier - 1) * 100).toFixed(0)}%</span>
                                </div>
                              )}
                              {data.projectTerms && termsMultiplier !== 1.0 && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[#131718]/70">{data.projectTerms === 'extra_revisions' ? tc.extraRevisions : data.projectTerms === 'rush' ? tc.rushDelivery : tc.rushRevisions}</span>
                                  <span className="font-medium text-[#131718]">+{((termsMultiplier - 1) * 100).toFixed(0)}%</span>
                                </div>
                              )}
                              <div className="pt-2 mt-2 border-t border-[#131718] flex items-center justify-between">
                                <span className="font-semibold text-[#131718] text-[16px]">{tc.projectRate}</span>
                                <span className="text-base font-bold text-[#131718]">{adjustedRate.toFixed(2)}/hr</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Why This Matters for Digital Creators */}
                  <div className="backdrop-blur-xl bg-primary/5 rounded-lg shadow-sm p-4 mt-4">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="font-semibold text-[16px]">{tc.whyMatters}</h3>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <p dangerouslySetInnerHTML={{ __html: tc.digitalWhy1 }} />
                      <p className="mt-2">{tc.digitalWhy2}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded Content - Physical Creator */}
              {isSelected && type.value === "physical" && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-6">
                  <div className="border-t border-border/50 pt-4 space-y-4">
                    <h3 className="font-semibold text-[16px]">{tc.physicalProductCosts}</h3>

                    <div className="space-y-3">
                      <Label htmlFor="materialCost" className="text-sm">
                        {tc.materialCostPerUnit}
                      </Label>
                      <Input
                        id="materialCost"
                        type="number"
                        inputMode="decimal"
                        placeholder={tc.materialPlaceholder}
                        value={data.avgMaterialCost || ""}
                        onChange={(e) => updateData({ avgMaterialCost: parseFloat(e.target.value) || 0 })}
                        className="bg-input-background border border-border"
                      />
                      <p className="text-xs text-muted-foreground -mt-2.5">
                        {tc.materialHint}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="hoursPerUnit" className="text-sm">
                        {tc.hoursPerUnit}
                      </Label>
                      <Input
                        id="hoursPerUnit"
                        type="number"
                        inputMode="decimal"
                        step="0.5"
                        placeholder={tc.hoursPerUnitPlaceholder}
                        value={data.hoursPerUnit || ""}
                        onChange={(e) => updateData({ hoursPerUnit: parseFloat(e.target.value) || 0 })}
                        className="bg-input-background border border-border"
                      />
                      <p className="text-xs text-muted-foreground -mt-2.5">
                        {tc.hoursPerUnitHint}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[16px]">{tc.salesChannel}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateData({ salesChannel: "wholesale" })}
                          className={`
                            px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border
                            ${data.salesChannel === "wholesale"
                              ? 'bg-primary text-primary-foreground shadow-md border-primary'
                              : 'bg-[#FEE6EA] text-[#131718] border-transparent hover:border-[#131718]'
                            }
                          `}
                        >
                          <div className="font-semibold">{tc.wholesale}</div>
                          <div className="text-xs opacity-80">{tc.wholesaleDesc}</div>
                        </button>
                        <button
                          onClick={() => updateData({ salesChannel: "retail" })}
                          className={`
                            px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border
                            ${data.salesChannel === "retail"
                              ? 'bg-primary text-primary-foreground shadow-md border-primary'
                              : 'bg-[#FEE6EA] text-[#131718] border-transparent hover:border-[#131718]'
                            }
                          `}
                        >
                          <div className="font-semibold">{tc.directRetail}</div>
                          <div className="text-xs opacity-80">{tc.directRetailDesc}</div>
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground -mt-2.5">
                        {tc.salesChannelHint}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="shippingCost" className="text-[16px]">
                        {tc.shippingCost}
                      </Label>
                      <Input
                        id="shippingCost"
                        type="number"
                        inputMode="decimal"
                        placeholder={tc.shippingPlaceholder}
                        value={data.shippingCost || ""}
                        onChange={(e) => updateData({ shippingCost: parseFloat(e.target.value) || 0 })}
                        className="bg-input-background border border-border"
                      />
                      <p className="text-xs text-muted-foreground -mt-2.5">
                        {tc.shippingHint}
                      </p>
                    </div>
                  </div>

                  {/* Your Product Pricing Preview - Physical Creator */}
                  {data.avgMaterialCost && data.hoursPerUnit && data.salesChannel && (
                    <div className="bg-[#FEE6EA] border border-[#FEE6EA] rounded-lg shadow-md p-4">
                      <h3 className="font-semibold mb-3 text-[#131718] text-[16px]">{tc.productPricing}</h3>
                      <div className="space-y-3">
                        {(() => {
                          const laborCost = selectedHourlyRate * (data.hoursPerUnit || 0);
                          const totalCost = (data.avgMaterialCost || 0) + laborCost;
                          const channelMultiplier = data.salesChannel === 'wholesale' ? 2 : 3;
                          const basePrice = totalCost * channelMultiplier;
                          const finalPrice = basePrice + (data.shippingCost || 0);

                          return (
                            <>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#131718]/70">{tc.materials}</span>
                                <span className="font-medium text-[#131718]">{(data.avgMaterialCost || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#131718]/70">{tc.labor} ({data.hoursPerUnit}hrs × {selectedHourlyRate.toFixed(2)}/hr)</span>
                                <span className="font-medium text-[#131718]">{laborCost.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#131718]/70">{data.salesChannel === 'wholesale' ? tc.wholesalePrice : tc.retailPrice} (×{channelMultiplier})</span>
                                <span className="font-medium text-[#131718]">{basePrice.toFixed(2)}</span>
                              </div>
                              {data.shippingCost && data.shippingCost > 0 && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[#131718]/70">+ Shipping</span>
                                  <span className="font-medium text-[#131718]">{data.shippingCost.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="pt-2 mt-2 border-t border-[#131718] flex items-center justify-between">
                                <span className="font-semibold text-[#131718] text-[16px]">{tc.finalPricePerUnit}</span>
                                <span className="text-base font-bold text-[#131718]">{finalPrice.toFixed(2)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Why This Matters for Physical Creators */}
                  <div className="backdrop-blur-xl bg-primary/5 rounded-lg shadow-sm p-4 mt-4">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="font-semibold text-[16px]">{tc.whyMatters}</h3>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <p dangerouslySetInnerHTML={{ __html: tc.physicalWhy1 }} />
                      <p className="mt-2">{tc.physicalWhy2}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded Content - Content Creator */}
              {isSelected && type.value === "content" && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-6">
                  <div className="border-t border-border/50 pt-4 space-y-4">
                    <div className="space-y-3">
                      <Label className="text-[16px]">{tc.primaryPlatform}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["YouTube", "TikTok", "Instagram", "Twitter/X", "LinkedIn", "Blog/Newsletter"].map((platform) => {
                          const isPlatformSelected = data.primaryPlatform === platform;
                          return (
                            <button
                              key={platform}
                              onClick={() => updateData({ primaryPlatform: isPlatformSelected ? undefined : platform as any })}
                              className={`
                                px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border
                                ${isPlatformSelected
                                  ? 'bg-primary text-primary-foreground shadow-md border-primary'
                                  : 'bg-[#FEE6EA] text-[#131718] border-transparent hover:border-[#131718]'
                                }
                              `}
                            >
                              {platform}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hours Per Content Input */}
                    <div className="space-y-3">
                      <Label htmlFor="hoursPerContent" className="text-[16px]">
                        {tc.hoursPerContent}
                      </Label>
                      <Input
                        id="hoursPerContent"
                        type="number"
                        inputMode="decimal"
                        step="0.5"
                        placeholder={tc.hoursPerContentPlaceholder}
                        value={data.hoursPerContent || ""}
                        onChange={(e) => updateData({ hoursPerContent: parseFloat(e.target.value) || 0 })}
                        className="bg-input-background border border-border"
                      />
                      <p className="text-xs text-muted-foreground -mt-2.5">
                        {tc.hoursPerContentHint}
                      </p>
                    </div>

                    {/* YouTube specific fields */}
                    {data.primaryPlatform === "YouTube" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="subscribers" className="text-[16px]">
                            {tc.subscribers}
                          </Label>
                          <Input
                            id="subscribers"
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g., 50000"
                            value={data.subscribers || ""}
                            onChange={(e) => updateData({ subscribers: parseInt(e.target.value) || 0 })}
                            className="bg-input-background border border-border"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[16px]">{tc.videoPerformance}</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">{tc.avgViews}</label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 25000"
                                value={data.avgViews || ""}
                                onChange={(e) => {
                                  const views = parseInt(e.target.value) || 0;
                                  const subscribers = data.subscribers || 0;
                                  const rate = subscribers ? (views / subscribers) * 100 : 0;
                                  updateData({ 
                                    avgViews: views,
                                    engagementRate: parseFloat(rate.toFixed(2))
                                  });
                                }}
                                className="bg-input-background border border-border"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">{tc.avgWatchTime}</label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 45"
                                value={data.avgWatchTimePercent || ""}
                                onChange={(e) => updateData({ avgWatchTimePercent: parseInt(e.target.value) || 0 })}
                                className="bg-input-background border border-border"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEE6EA]">
                          <span className="text-muted-foreground text-[16px] text-[#131718] font-bold">{tc.viewToSubscriber}</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">{tc.youtubeBenchmark}</p>
                      </div>
                    )}

                    {/* Instagram specific fields */}
                    {data.primaryPlatform === "Instagram" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="instagramFollowers" className="text-[16px]">
                            {tc.followers}
                          </Label>
                          <Input
                            id="instagramFollowers"
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g., 50000"
                            value={data.instagramFollowers || ""}
                            onChange={(e) => updateData({ instagramFollowers: parseInt(e.target.value) || 0 })}
                            className="bg-input-background border border-border"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[16px]">{tc.postEngagement}</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">{tc.avgLikes}</label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 2500"
                                value={data.instagramAvgLikes || ""}
                                onChange={(e) => {
                                  const likes = parseInt(e.target.value) || 0;
                                  const comments = data.instagramAvgComments || 0;
                                  const followers = data.instagramFollowers || 0;
                                  const totalEngagement = likes + comments;
                                  const rate = followers ? (totalEngagement / followers) * 100 : 0;
                                  updateData({
                                    instagramAvgLikes: likes,
                                    engagementRate: parseFloat(rate.toFixed(2))
                                  });
                                }}
                                className="bg-input-background border border-border"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">{tc.avgComments}</label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 150"
                                value={data.instagramAvgComments || ""}
                                onChange={(e) => {
                                  const comments = parseInt(e.target.value) || 0;
                                  const likes = data.instagramAvgLikes || 0;
                                  const followers = data.instagramFollowers || 0;
                                  const totalEngagement = likes + comments;
                                  const rate = followers ? (totalEngagement / followers) * 100 : 0;
                                  updateData({ 
                                    instagramAvgComments: comments,
                                    engagementRate: parseFloat(rate.toFixed(2))
                                  });
                                }}
                                className="bg-input-background border border-border"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEE6EA]">
                          <span className="text-muted-foreground text-[#131718] text-[16px] font-bold">{tc.engagementRate}</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">{tc.instagramBenchmark}</p>
                      </div>
                    )}

                    {/* TikTok specific fields */}
                    {data.primaryPlatform === "TikTok" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="tiktokFollowers" className="text-[16px]">
                            {tc.followers}
                          </Label>
                          <Input
                            id="tiktokFollowers"
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g., 50000"
                            value={data.tiktokFollowers || ""}
                            onChange={(e) => updateData({ tiktokFollowers: parseInt(e.target.value) || 0 })}
                            className="bg-input-background border border-border"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[16px]">{tc.videoPerformance}</Label>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">{tc.avgViews}</label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 100000"
                                value={data.tiktokAvgViews || ""}
                                onChange={(e) => {
                                  const views = parseInt(e.target.value) || 0;
                                  const followers = data.tiktokFollowers || 0;
                                  const rate = followers ? (views / followers) * 100 : 0;
                                  updateData({ 
                                    tiktokAvgViews: views,
                                    engagementRate: parseFloat(rate.toFixed(2))
                                  });
                                }}
                                className="bg-input-background border border-border"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">{tc.avgLikes}</label>
                                <Input
                                  type="number"
                                  inputMode="numeric"
                                  placeholder="e.g., 8000"
                                  value={data.tiktokAvgLikes || ""}
                                  onChange={(e) => updateData({ tiktokAvgLikes: parseInt(e.target.value) || 0 })}
                                  className="bg-input-background border border-border"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">{tc.avgComments}</label>
                                <Input
                                  type="number"
                                  inputMode="numeric"
                                  placeholder="e.g., 400"
                                  value={data.tiktokAvgComments || ""}
                                  onChange={(e) => updateData({ tiktokAvgComments: parseInt(e.target.value) || 0 })}
                                  className="bg-input-background border border-border"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEE6EA]">
                          <span className="text-muted-foreground text-[16px] text-[#131718] font-bold">{tc.viewToFollower}</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">{tc.tiktokBenchmark}</p>
                      </div>
                    )}

                    {/* Twitter/X specific fields */}
                    {data.primaryPlatform === "Twitter/X" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="twitterFollowers" className="text-[16px]">
                            {tc.followers}
                          </Label>
                          <Input
                            id="twitterFollowers"
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g., 50000"
                            value={data.twitterFollowers || ""}
                            onChange={(e) => updateData({ twitterFollowers: parseInt(e.target.value) || 0 })}
                            className="bg-input-background border border-border"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[16px]">{tc.postPerformance}</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">{tc.avgImpressions}</label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 10000"
                                value={data.twitterAvgImpressions || ""}
                                onChange={(e) => updateData({ twitterAvgImpressions: parseInt(e.target.value) || 0 })}
                                className="bg-input-background border border-border"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">{tc.avgEngagements}</label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 500"
                                value={data.twitterAvgEngagements || ""}
                                onChange={(e) => {
                                  const engagements = parseInt(e.target.value) || 0;
                                  const impressions = data.twitterAvgImpressions || 0;
                                  const rate = impressions ? (engagements / impressions) * 100 : 0;
                                  updateData({
                                    twitterAvgEngagements: engagements,
                                    engagementRate: parseFloat(rate.toFixed(2))
                                  });
                                }}
                                className="bg-input-background border border-border"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEE6EA]">
                          <span className="text-muted-foreground text-[16px] text-[#131718] font-bold">{tc.engagementRate}</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">{tc.twitterBenchmark}</p>
                      </div>
                    )}

                    {/* LinkedIn specific fields */}
                    {data.primaryPlatform === "LinkedIn" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="linkedinFollowers" className="text-[16px]">
                            {tc.followers}
                          </Label>
                          <Input
                            id="linkedinFollowers"
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g., 50000"
                            value={data.linkedinFollowers || ""}
                            onChange={(e) => updateData({ linkedinFollowers: parseInt(e.target.value) || 0 })}
                            className="bg-input-background border border-border"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[16px]">{tc.postPerformance}</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">{tc.avgImpressions}</label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 10000"
                                value={data.linkedinAvgImpressions || ""}
                                onChange={(e) => updateData({ linkedinAvgImpressions: parseInt(e.target.value) || 0 })}
                                className="bg-input-background border border-border"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">{tc.avgEngagements}</label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 500"
                                value={data.linkedinAvgEngagements || ""}
                                onChange={(e) => {
                                  const engagements = parseInt(e.target.value) || 0;
                                  const impressions = data.linkedinAvgImpressions || 0;
                                  const rate = impressions ? (engagements / impressions) * 100 : 0;
                                  updateData({
                                    linkedinAvgEngagements: engagements,
                                    engagementRate: parseFloat(rate.toFixed(2))
                                  });
                                }}
                                className="bg-input-background border border-border"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEE6EA]">
                          <span className="text-muted-foreground text-[16px] font-bold text-[#131718]">{tc.engagementRate}</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">{tc.linkedinBenchmark}</p>
                      </div>
                    )}

                    {/* Blog/Newsletter specific fields */}
                    {data.primaryPlatform === "Blog/Newsletter" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="blogNewsletterSubscribers" className="text-[16px]">
                            {tc.subscribers}
                          </Label>
                          <Input
                            id="blogNewsletterSubscribers"
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g., 50000"
                            value={data.blogNewsletterSubscribers || ""}
                            onChange={(e) => updateData({ blogNewsletterSubscribers: parseInt(e.target.value) || 0 })}
                            className="bg-input-background border border-border"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[16px]">{tc.openRate}</Label>
                          <Input
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g., 20"
                            value={data.blogNewsletterOpenRate || ""}
                            onChange={(e) => {
                              const openRate = parseFloat(e.target.value) || 0;
                              const ctr = data.blogNewsletterCTR || 0;
                              // Calculate overall engagement: (open rate × CTR)
                              const effectiveEngagement = (openRate / 100) * (ctr / 100) * 100;
                              updateData({ 
                                blogNewsletterOpenRate: openRate,
                                engagementRate: parseFloat(effectiveEngagement.toFixed(2))
                              });
                            }}
                            className="bg-input-background border border-border"
                          />
                          <p className="text-xs text-muted-foreground -mt-2.5">{tc.openRateHint}</p>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[16px]">{tc.ctr}</Label>
                          <Input
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g., 5"
                            value={data.blogNewsletterCTR || ""}
                            onChange={(e) => {
                              const ctr = parseFloat(e.target.value) || 0;
                              const openRate = data.blogNewsletterOpenRate || 0;
                              // Calculate overall engagement: (open rate × CTR) 
                              const effectiveEngagement = (openRate / 100) * (ctr / 100) * 100;
                              updateData({ 
                                blogNewsletterCTR: ctr,
                                engagementRate: parseFloat(effectiveEngagement.toFixed(2))
                              });
                            }}
                            className="bg-input-background border border-border"
                          />
                          <p className="text-xs text-muted-foreground -mt-2.5">{tc.ctrHint}</p>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEE6EA]">
                          <span className="text-muted-foreground text-[16px] font-bold text-[#131718]">{tc.overallEngagement}</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">{tc.blogBenchmark}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label htmlFor="contentType" className="text-[16px]">
                        {tc.contentType}
                      </Label>
                      <select
                        id="contentType"
                        value={data.contentType || ""}
                        onChange={(e) => updateData({ contentType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-border"
                      >
                        <option value="">{tc.selectType}</option>
                        {data.primaryPlatform === "Blog/Newsletter" ? (
                          <>
                            <option value="blog_post">{tc.contentTypes.blog_post}</option>
                            <option value="newsletter_issue">{tc.contentTypes.newsletter_issue}</option>
                            <option value="article_series">{tc.contentTypes.article_series}</option>
                            <option value="sponsored_article">{tc.contentTypes.sponsored_article}</option>
                            <option value="guest_post">{tc.contentTypes.guest_post}</option>
                          </>
                        ) : (
                          <>
                            <option value="sponsored_post">{tc.contentTypes.sponsored_post}</option>
                            <option value="video">{tc.contentTypes.video}</option>
                            <option value="short">{tc.contentTypes.short}</option>
                            <option value="story">{tc.contentTypes.story}</option>
                            <option value="series">{tc.contentTypes.series}</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[16px]">{tc.usageRights}</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { value: "organic", label: tc.rights.organic.label, desc: tc.rights.organic.desc },
                          { value: "paid_ad", label: tc.rights.paid_ad.label, desc: tc.rights.paid_ad.desc },
                          { value: "exclusive", label: tc.rights.exclusive.label, desc: tc.rights.exclusive.desc },
                        ].map((right) => (
                          <button
                            key={right.value}
                            onClick={() => updateData({ usageRights: right.value as any })}
                            className={`
                              px-4 py-3 rounded-lg text-left transition-all duration-200 border
                              ${data.usageRights === right.value
                                ? 'bg-primary text-primary-foreground shadow-md border-primary'
                                : 'bg-[#FEE6EA] text-[#131718] border-transparent hover:border-[#131718]'
                              }
                            `}
                          >
                            <div className="text-sm font-medium">{right.label}</div>
                            <div className={`text-xs ${data.usageRights === right.value ? 'text-primary-foreground/80' : 'text-[#131718]/70'}`}>
                              {right.desc}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Consolidated Content Pricing Card - Content Creator */}
                  {data.primaryPlatform && data.hoursPerContent && data.usageRights && (() => {
                    // Get follower/subscriber count based on platform
                    let audienceSize = 0;
                    if (data.primaryPlatform === 'YouTube') audienceSize = data.subscribers || 0;
                    else if (data.primaryPlatform === 'Instagram') audienceSize = data.instagramFollowers || 0;
                    else if (data.primaryPlatform === 'TikTok') audienceSize = data.tiktokFollowers || 0;
                    else if (data.primaryPlatform === 'Twitter/X') audienceSize = data.twitterFollowers || 0;
                    else if (data.primaryPlatform === 'LinkedIn') audienceSize = data.linkedinFollowers || 0;
                    else if (data.primaryPlatform === 'Blog/Newsletter') audienceSize = data.blogNewsletterSubscribers || 0;

                    // Only show if we have audience size
                    if (audienceSize === 0) return null;

                    // Calculate audience size multiplier
                    let audienceMultiplier = 1.0;
                    let audienceLabel = tc.audienceLabels.under1k;
                    if (audienceSize >= 1000000) {
                      audienceMultiplier = 1.5;
                      audienceLabel = tc.audienceLabels.mega;
                    } else if (audienceSize >= 500000) {
                      audienceMultiplier = 1.4;
                      audienceLabel = tc.audienceLabels.large;
                    } else if (audienceSize >= 100000) {
                      audienceMultiplier = 1.3;
                      audienceLabel = tc.audienceLabels.mid;
                    } else if (audienceSize >= 50000) {
                      audienceMultiplier = 1.2;
                      audienceLabel = tc.audienceLabels.growing;
                    } else if (audienceSize >= 10000) {
                      audienceMultiplier = 1.1;
                      audienceLabel = tc.audienceLabels.micro;
                    } else if (audienceSize >= 5000) {
                      audienceMultiplier = 1.05;
                      audienceLabel = tc.audienceLabels.emerging;
                    } else if (audienceSize >= 1000) {
                      audienceMultiplier = 1.02;
                      audienceLabel = tc.audienceLabels.starting;
                    }

                    // Calculate engagement multiplier
                    let engagementMultiplier = 1.0;
                    let engagementLabel = "";
                    const engagementRate = data.engagementRate || 0;
                    
                    if (engagementRate > 0) {
                      // Different benchmarks by platform - aligned with tooltip guidance
                      
                      // YouTube: Good 10-20% | Viral 50%+
                      if (data.primaryPlatform === 'YouTube' && engagementRate >= 50) {
                        engagementMultiplier = 1.2;
                        engagementLabel = tc.engagementLabels.viralEngagement;
                      } else if (data.primaryPlatform === 'YouTube' && engagementRate >= 20) {
                        engagementMultiplier = 1.15;
                        engagementLabel = tc.engagementLabels.highEngagement;
                      } else if (data.primaryPlatform === 'YouTube' && engagementRate >= 10) {
                        engagementMultiplier = 1.08;
                        engagementLabel = tc.engagementLabels.goodEngagement;
                      }
                      else if (data.primaryPlatform === 'Instagram' && engagementRate >= 10) {
                        engagementMultiplier = 1.18;
                        engagementLabel = tc.engagementLabels.exceptionalEngagement;
                      } else if (data.primaryPlatform === 'Instagram' && engagementRate >= 7) {
                        engagementMultiplier = 1.15;
                        engagementLabel = tc.engagementLabels.greatEngagement;
                      } else if (data.primaryPlatform === 'Instagram' && engagementRate >= 3) {
                        engagementMultiplier = 1.08;
                        engagementLabel = tc.engagementLabels.goodEngagement;
                      }
                      else if (data.primaryPlatform === 'TikTok' && engagementRate >= 200) {
                        engagementMultiplier = 1.25;
                        engagementLabel = tc.engagementLabels.viralEngagement;
                      } else if (data.primaryPlatform === 'TikTok' && engagementRate >= 100) {
                        engagementMultiplier = 1.15;
                        engagementLabel = tc.engagementLabels.highEngagement;
                      } else if (data.primaryPlatform === 'TikTok' && engagementRate >= 50) {
                        engagementMultiplier = 1.08;
                        engagementLabel = tc.engagementLabels.goodEngagement;
                      }
                      else if (data.primaryPlatform === 'Twitter/X' && engagementRate >= 5) {
                        engagementMultiplier = 1.15;
                        engagementLabel = tc.engagementLabels.greatEngagement;
                      } else if (data.primaryPlatform === 'Twitter/X' && engagementRate >= 1) {
                        engagementMultiplier = 1.08;
                        engagementLabel = tc.engagementLabels.goodEngagement;
                      }
                      else if (data.primaryPlatform === 'LinkedIn' && engagementRate >= 5) {
                        engagementMultiplier = 1.15;
                        engagementLabel = tc.engagementLabels.greatEngagement;
                      } else if (data.primaryPlatform === 'LinkedIn' && engagementRate >= 1) {
                        engagementMultiplier = 1.08;
                        engagementLabel = tc.engagementLabels.goodEngagement;
                      }
                      else if (data.primaryPlatform === 'Blog/Newsletter' && engagementRate >= 3) {
                        engagementMultiplier = 1.15;
                        engagementLabel = tc.engagementLabels.greatEngagement;
                      } else if (data.primaryPlatform === 'Blog/Newsletter' && engagementRate >= 1) {
                        engagementMultiplier = 1.08;
                        engagementLabel = tc.engagementLabels.goodEngagement;
                      }
                    }

                    const adjustedHourlyRate = selectedHourlyRate * audienceMultiplier * engagementMultiplier;
                    
                    // Calculate content pricing
                    const baseContentCost = adjustedHourlyRate * (data.hoursPerContent || 0);
                    const rightsMultiplier = data.usageRights === 'organic' ? 1.0 :
                                            data.usageRights === 'paid_ad' ? 2.5 :
                                            data.usageRights === 'exclusive' ? 5.0 : 1.0;
                    const finalPrice = baseContentCost * rightsMultiplier;

                    return (
                      <div className="bg-[#FEE6EA] border border-[#FEE6EA] rounded-lg shadow-md p-4">
                        <h3 className="font-semibold mb-3 text-[#131718] text-[16px]">{tc.contentPricing}</h3>
                        <div className="space-y-3">
                          {/* Hourly Rate Breakdown */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#131718]/70">{tc.startingRate} ({selectedRateTier === 'recommended' ? tc.recommendedRate.split(' ')[0] : tc.baseHourlyRate.split(' ')[0]})</span>
                              <span className="font-medium text-[#131718]">{selectedHourlyRate.toFixed(2)}/hr</span>
                            </div>
                            {audienceMultiplier > 1.0 && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#131718]/70">{tc.audienceSize} ({audienceLabel})</span>
                                <span className="font-medium text-[#131718]">+{((audienceMultiplier - 1) * 100).toFixed(0)}%</span>
                              </div>
                            )}
                            {engagementMultiplier > 1.0 && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#131718]/70">{engagementLabel}</span>
                                <span className="font-medium text-[#131718]">+{((engagementMultiplier - 1) * 100).toFixed(0)}%</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs pt-1">
                              <span className="text-[#131718]/70 font-medium">{tc.adjustedRate}</span>
                              <span className="font-semibold text-[#131718]">{adjustedHourlyRate.toFixed(2)}/hr</span>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-[#131718]/20"></div>

                          {/* Content Pricing Breakdown */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#131718]/70">{tc.timeCost} ({data.hoursPerContent}hrs)</span>
                              <span className="font-medium text-[#131718]">{baseContentCost.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#131718]/70">
                                {data.usageRights === 'organic' ? tc.organicOnly :
                                 data.usageRights === 'paid_ad' ? tc.paidAdRights :
                                 tc.exclusiveRights}
                              </span>
                              <span className="font-medium text-[#131718]">×{rightsMultiplier}</span>
                            </div>
                          </div>

                          {/* Final Price */}
                          <div className="pt-2 mt-2 border-t border-[#131718] flex items-center justify-between">
                            <span className="font-semibold text-[#131718] text-[16px]">{tc.floorPrice}</span>
                            <span className="text-base font-bold text-[#131718]">{finalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Why This Matters for Content Creators */}
                  <div className="backdrop-blur-xl bg-primary/5 rounded-lg shadow-sm p-4 mt-4">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="font-semibold text-[16px]">{tc.whyMatters}</h3>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <p dangerouslySetInnerHTML={{ __html: tc.contentWhy1 }} />
                      <p className="mt-2">{tc.contentWhy2}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}