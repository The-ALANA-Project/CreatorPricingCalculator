import { useState, useRef, useEffect } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent } from "@/app/components/ui/card";
import { Palette, Package, Video, Lightbulb } from "lucide-react";

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
      title: "Digital Creator",
      description: "Graphic design, UI/UX, web design, illustration, etc.",
    },
    {
      value: "physical" as CreatorTypeValue,
      icon: Package,
      title: "Physical Creator",
      description: "Fashion design, jewelry, crafts, physical products, etc.",
    },
    {
      value: "content" as CreatorTypeValue,
      icon: Video,
      title: "Content Creator",
      description: "YouTube, TikTok, Instagram, social media content, etc.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">What Type of Creator Are You?</h2>
        <p className="text-muted-foreground text-[16px]">
          Different creator types have different pricing considerations. Select yours to get customized rate calculations.
        </p>
      </div>

      {/* Rate Summary Card - Your Foundation from Step 2 */}
      <div className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-semibold mb-1">Your Base Rates</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Choose which rate to use for your pricing calculations below
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
              <div className="text-muted-foreground text-xs">Base Hourly Rate</div>
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
            <div className="text-muted-foreground text-xs mt-1">Your break-even rate</div>
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
              <div className="text-[#131718]/70 text-xs">Recommended Hourly Rate</div>
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
            <div className="text-[#131718]/60 text-xs mt-1">With 25% profit margin ✨</div>
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
                    <h3 className="font-semibold text-[16px]">Experience Level</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { level: "junior", label: "Junior", years: "0-2 years", adjustment: "-10% to -15%" },
                        { level: "mid", label: "Mid", years: "3-5 years", adjustment: "No adjustment" },
                        { level: "senior", label: "Senior", years: "6+ years", adjustment: "+15% to +25%" }
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
                    <h3 className="font-semibold text-[16px]">Project Terms</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { term: "standard", label: "Standard", desc: "2 revisions, normal timeline", adjustment: "No adjustment" },
                        { term: "extra_revisions", label: "Extra Revisions", desc: "3-5 revisions", adjustment: "+15%" },
                        { term: "rush", label: "Rush", desc: "Tight deadline", adjustment: "+25%" },
                        { term: "rush_revisions", label: "Rush + Revisions", desc: "Both combined", adjustment: "+40%" }
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
                      <h3 className="font-semibold mb-3 text-[#131718] text-[16px]">Your Adjusted Rates</h3>
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
                                <span className="text-[#131718]/70">Starting Rate ({selectedRateTier === 'recommended' ? 'Recommended' : 'Base'})</span>
                                <span className="font-medium text-[#131718]">{selectedHourlyRate.toFixed(2)}/hr</span>
                              </div>
                              {expMultiplier !== 1.0 && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[#131718]/70">Experience ({data.experienceLevel})</span>
                                  <span className="font-medium text-[#131718]">{expMultiplier < 1 ? '' : '+'}{((expMultiplier - 1) * 100).toFixed(0)}%</span>
                                </div>
                              )}
                              {data.projectTerms && termsMultiplier !== 1.0 && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[#131718]/70">{data.projectTerms === 'extra_revisions' ? 'Extra Revisions' : data.projectTerms === 'rush' ? 'Rush Delivery' : 'Rush + Revisions'}</span>
                                  <span className="font-medium text-[#131718]">+{((termsMultiplier - 1) * 100).toFixed(0)}%</span>
                                </div>
                              )}
                              <div className="pt-2 mt-2 border-t border-[#131718] flex items-center justify-between">
                                <span className="font-semibold text-[#131718] text-[16px]">Your Project Rate</span>
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
                      <h3 className="font-semibold text-[16px]">Why This Matters</h3>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <p>
                        <strong>Digital creators</strong> should choose between base (break-even) or recommended rates (with profit margin). 
                        Your base rate covers just expenses and living costs, while the recommended rate includes a 25% profit margin.
                      </p>
                      <p className="mt-2">
                        Then layer on experience level and project terms—you can charge 40%+ more for rush work with extra revisions, or adjust down if you're building your portfolio.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded Content - Physical Creator */}
              {isSelected && type.value === "physical" && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-6">
                  <div className="border-t border-border/50 pt-4 space-y-4">
                    <h3 className="font-semibold text-[16px]">Physical Product Costs</h3>
                    
                    <div className="space-y-3">
                      <Label htmlFor="materialCost" className="text-sm">
                        Material Cost Per Unit
                      </Label>
                      <Input
                        id="materialCost"
                        type="number"
                        inputMode="decimal"
                        placeholder="e.g., 25"
                        value={data.avgMaterialCost || ""}
                        onChange={(e) => updateData({ avgMaterialCost: parseFloat(e.target.value) || 0 })}
                        className="bg-input-background border border-border"
                      />
                      <p className="text-xs text-muted-foreground -mt-2.5">
                        Total cost of materials to make one piece (fabric, metal, supplies, etc.)
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="hoursPerUnit" className="text-sm">
                        Hours Per Unit
                      </Label>
                      <Input
                        id="hoursPerUnit"
                        type="number"
                        inputMode="decimal"
                        step="0.5"
                        placeholder="e.g., 2.5"
                        value={data.hoursPerUnit || ""}
                        onChange={(e) => updateData({ hoursPerUnit: parseFloat(e.target.value) || 0 })}
                        className="bg-input-background border border-border"
                      />
                      <p className="text-xs text-muted-foreground -mt-2.5">
                        How many hours it takes you to make one unit from start to finish
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[16px]">Sales Channel</Label>
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
                          <div className="font-semibold">Wholesale</div>
                          <div className="text-xs opacity-80">2x your cost</div>
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
                          <div className="font-semibold">Direct/Retail</div>
                          <div className="text-xs opacity-80">3x your cost</div>
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground -mt-2.5">
                        Wholesale = selling to stores. Direct/Retail = selling directly to customers.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="shippingCost" className="text-[16px]">
                        Shipping/Handling Cost (Optional)
                      </Label>
                      <Input
                        id="shippingCost"
                        type="number"
                        inputMode="decimal"
                        placeholder="e.g., 12"
                        value={data.shippingCost || ""}
                        onChange={(e) => updateData({ shippingCost: parseFloat(e.target.value) || 0 })}
                        className="bg-input-background border border-border"
                      />
                      <p className="text-xs text-muted-foreground -mt-2.5">
                        Average cost for packaging, labels, and shipping per unit
                      </p>
                    </div>
                  </div>

                  {/* Your Product Pricing Preview - Physical Creator */}
                  {data.avgMaterialCost && data.hoursPerUnit && data.salesChannel && (
                    <div className="bg-[#FEE6EA] border border-[#FEE6EA] rounded-lg shadow-md p-4">
                      <h3 className="font-semibold mb-3 text-[#131718] text-[16px]">Your Product Pricing</h3>
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
                                <span className="text-[#131718]/70">Materials</span>
                                <span className="font-medium text-[#131718]">{(data.avgMaterialCost || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#131718]/70">Labor ({data.hoursPerUnit}hrs × {selectedHourlyRate.toFixed(2)}/hr)</span>
                                <span className="font-medium text-[#131718]">{laborCost.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#131718]/70">{data.salesChannel === 'wholesale' ? 'Wholesale' : 'Retail'} Price (×{channelMultiplier})</span>
                                <span className="font-medium text-[#131718]">{basePrice.toFixed(2)}</span>
                              </div>
                              {data.shippingCost && data.shippingCost > 0 && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[#131718]/70">+ Shipping</span>
                                  <span className="font-medium text-[#131718]">{data.shippingCost.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="pt-2 mt-2 border-t border-[#131718] flex items-center justify-between">
                                <span className="font-semibold text-[#131718] text-[16px]">Final Price Per Unit</span>
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
                      <h3 className="font-semibold text-[16px]">Why This Matters</h3>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <p>
                        <strong>Physical creators</strong> must account for material costs, production time, and retail margins. 
                        Your time + materials is just the start—retail typically marks up 200-300% (2x-3x) to cover overhead and profit.
                      </p>
                      <p className="mt-2">
                        Don't forget shipping! Always include packaging and handling costs in your final price.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded Content - Content Creator */}
              {isSelected && type.value === "content" && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-6">
                  <div className="border-t border-border/50 pt-4 space-y-4">
                    <div className="space-y-3">
                      <Label className="text-[16px]">Primary Platform</Label>
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
                        Estimated Hours Per Post/Video
                      </Label>
                      <Input
                        id="hoursPerContent"
                        type="number"
                        inputMode="decimal"
                        step="0.5"
                        placeholder="e.g., 4"
                        value={data.hoursPerContent || ""}
                        onChange={(e) => updateData({ hoursPerContent: parseFloat(e.target.value) || 0 })}
                        className="bg-input-background border border-border"
                      />
                      <p className="text-xs text-muted-foreground -mt-2.5">
                        Total time for planning, shooting, editing, posting, and engagement (in hours)
                      </p>
                    </div>

                    {/* YouTube specific fields */}
                    {data.primaryPlatform === "YouTube" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="subscribers" className="text-[16px]">
                            Subscribers
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
                          <Label className="text-[16px]">Video Performance</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Avg. Views</label>
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
                              <label className="text-xs text-muted-foreground mb-1 block">Avg. Watch Time %</label>
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
                          <span className="text-muted-foreground text-[16px] text-[#131718] font-bold">View-to-Subscriber Rate:</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">Good: 10-20% | Viral: 50%+</p>
                      </div>
                    )}

                    {/* Instagram specific fields */}
                    {data.primaryPlatform === "Instagram" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="instagramFollowers" className="text-[16px]">
                            Followers
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
                          <Label className="text-[16px]">Post Engagement</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Avg. Likes</label>
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
                              <label className="text-xs text-muted-foreground mb-1 block">Avg. Comments</label>
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
                          <span className="text-muted-foreground text-[#131718] text-[16px] font-bold">Engagement Rate:</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">Good: 3-5% | Great: 7-10% | Exceptional: 10%+</p>
                      </div>
                    )}

                    {/* TikTok specific fields */}
                    {data.primaryPlatform === "TikTok" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="tiktokFollowers" className="text-[16px]">
                            Followers
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
                          <Label className="text-[16px]">Video Performance</Label>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Avg. Views per Video</label>
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
                                <label className="text-xs text-muted-foreground mb-1 block">Avg. Likes</label>
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
                                <label className="text-xs text-muted-foreground mb-1 block">Avg. Comments</label>
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
                          <span className="text-muted-foreground text-[16px] text-[#131718] font-bold">View-to-Follower Rate:</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">Good: 50-100% | Viral: 200%+ (views can exceed followers)</p>
                      </div>
                    )}

                    {/* Twitter/X specific fields */}
                    {data.primaryPlatform === "Twitter/X" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="twitterFollowers" className="text-[16px]">
                            Followers
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
                          <Label className="text-[16px]">Post Performance</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Avg. Impressions</label>
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
                              <label className="text-xs text-muted-foreground mb-1 block">Avg. Engagements</label>
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
                          <span className="text-muted-foreground text-[16px] text-[#131718] font-bold">Engagement Rate:</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">Good: 1-3% | Great: 5%+</p>
                      </div>
                    )}

                    {/* LinkedIn specific fields */}
                    {data.primaryPlatform === "LinkedIn" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="linkedinFollowers" className="text-[16px]">
                            Followers
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
                          <Label className="text-[16px]">Post Performance</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Avg. Impressions</label>
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
                              <label className="text-xs text-muted-foreground mb-1 block">Avg. Engagements</label>
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
                          <span className="text-muted-foreground text-[16px] font-bold text-[#131718]">Engagement Rate:</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">Good: 1-3% | Great: 5%+</p>
                      </div>
                    )}

                    {/* Blog/Newsletter specific fields */}
                    {data.primaryPlatform === "Blog/Newsletter" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="blogNewsletterSubscribers" className="text-[16px]">
                            Subscribers
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
                          <Label className="text-[16px]">Open Rate</Label>
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
                          <p className="text-xs text-muted-foreground -mt-2.5">Percentage of emails opened by subscribers</p>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[16px]">Click-Through Rate (CTR)</Label>
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
                          <p className="text-xs text-muted-foreground -mt-2.5">Percentage of opened emails that clicked a link</p>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEE6EA]">
                          <span className="text-muted-foreground text-[16px] font-bold text-[#131718]">Overall Engagement:</span>
                          <span className="font-semibold text-[16px]">
                            {typeof data.engagementRate === 'number' ? `${data.engagementRate}%` : '—'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-[15px] p-0">Overall Engagement: Good 1-2% | Great 3-4%+</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label htmlFor="contentType" className="text-[16px]">
                        Content Type
                      </Label>
                      <select
                        id="contentType"
                        value={data.contentType || ""}
                        onChange={(e) => updateData({ contentType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-border"
                      >
                        <option value="">Select type...</option>
                        {data.primaryPlatform === "Blog/Newsletter" ? (
                          <>
                            <option value="blog_post">Blog Post</option>
                            <option value="newsletter_issue">Newsletter Issue</option>
                            <option value="article_series">Article Series</option>
                            <option value="sponsored_article">Sponsored Article</option>
                            <option value="guest_post">Guest Post</option>
                          </>
                        ) : (
                          <>
                            <option value="sponsored_post">Sponsored Post</option>
                            <option value="video">Video (60s+)</option>
                            <option value="short">Short/Reel (under 60s)</option>
                            <option value="story">Story/Temporary</option>
                            <option value="series">Content Series</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[16px]">Usage Rights</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { value: "organic", label: "Organic Only", desc: "The creator posts to their own feed/channel, content appears organically to their followers" },
                          { value: "paid_ad", label: "Paid Ad Usage", desc: "The brand can take the content and use it in their paid advertising campaigns" },
                          { value: "exclusive", label: "Exclusive Rights", desc: "Full ownership where the brand can use it anywhere, and often includes exclusivity clauses" },
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
                    let audienceLabel = "Under 1K";
                    if (audienceSize >= 1000000) {
                      audienceMultiplier = 1.5;
                      audienceLabel = "1M+ (Mega)";
                    } else if (audienceSize >= 500000) {
                      audienceMultiplier = 1.4;
                      audienceLabel = "500K+ (Large)";
                    } else if (audienceSize >= 100000) {
                      audienceMultiplier = 1.3;
                      audienceLabel = "100K+ (Mid)";
                    } else if (audienceSize >= 50000) {
                      audienceMultiplier = 1.2;
                      audienceLabel = "50K+ (Growing)";
                    } else if (audienceSize >= 10000) {
                      audienceMultiplier = 1.1;
                      audienceLabel = "10K+ (Micro)";
                    } else if (audienceSize >= 5000) {
                      audienceMultiplier = 1.05;
                      audienceLabel = "5K+ (Emerging)";
                    } else if (audienceSize >= 1000) {
                      audienceMultiplier = 1.02;
                      audienceLabel = "1K+ (Starting)";
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
                        engagementLabel = "Viral Engagement";
                      } else if (data.primaryPlatform === 'YouTube' && engagementRate >= 20) {
                        engagementMultiplier = 1.15;
                        engagementLabel = "High Engagement";
                      } else if (data.primaryPlatform === 'YouTube' && engagementRate >= 10) {
                        engagementMultiplier = 1.08;
                        engagementLabel = "Good Engagement";
                      }
                      
                      // Instagram: Good 3-5% | Great 7-10% | Exceptional 10%+
                      else if (data.primaryPlatform === 'Instagram' && engagementRate >= 10) {
                        engagementMultiplier = 1.18;
                        engagementLabel = "Exceptional Engagement";
                      } else if (data.primaryPlatform === 'Instagram' && engagementRate >= 7) {
                        engagementMultiplier = 1.15;
                        engagementLabel = "Great Engagement";
                      } else if (data.primaryPlatform === 'Instagram' && engagementRate >= 3) {
                        engagementMultiplier = 1.08;
                        engagementLabel = "Good Engagement";
                      }
                      
                      // TikTok: Good 50-100% | Viral 200%+
                      else if (data.primaryPlatform === 'TikTok' && engagementRate >= 200) {
                        engagementMultiplier = 1.25;
                        engagementLabel = "Viral Engagement";
                      } else if (data.primaryPlatform === 'TikTok' && engagementRate >= 100) {
                        engagementMultiplier = 1.15;
                        engagementLabel = "High Engagement";
                      } else if (data.primaryPlatform === 'TikTok' && engagementRate >= 50) {
                        engagementMultiplier = 1.08;
                        engagementLabel = "Good Engagement";
                      }
                      
                      // Twitter/X: Good 1-3% | Great 5%+
                      else if (data.primaryPlatform === 'Twitter/X' && engagementRate >= 5) {
                        engagementMultiplier = 1.15;
                        engagementLabel = "Great Engagement";
                      } else if (data.primaryPlatform === 'Twitter/X' && engagementRate >= 1) {
                        engagementMultiplier = 1.08;
                        engagementLabel = "Good Engagement";
                      }
                      
                      // LinkedIn: Good 1-3% | Great 5%+
                      else if (data.primaryPlatform === 'LinkedIn' && engagementRate >= 5) {
                        engagementMultiplier = 1.15;
                        engagementLabel = "Great Engagement";
                      } else if (data.primaryPlatform === 'LinkedIn' && engagementRate >= 1) {
                        engagementMultiplier = 1.08;
                        engagementLabel = "Good Engagement";
                      }
                      
                      // Blog/Newsletter: Good 1-2% | Great 3-4%+
                      else if (data.primaryPlatform === 'Blog/Newsletter' && engagementRate >= 3) {
                        engagementMultiplier = 1.15;
                        engagementLabel = "Great Engagement";
                      } else if (data.primaryPlatform === 'Blog/Newsletter' && engagementRate >= 1) {
                        engagementMultiplier = 1.08;
                        engagementLabel = "Good Engagement";
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
                        <h3 className="font-semibold mb-3 text-[#131718] text-[16px]">Your Content Pricing</h3>
                        <div className="space-y-3">
                          {/* Hourly Rate Breakdown */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#131718]/70">Starting Rate ({selectedRateTier === 'recommended' ? 'Recommended' : 'Base'})</span>
                              <span className="font-medium text-[#131718]">{selectedHourlyRate.toFixed(2)}/hr</span>
                            </div>
                            {audienceMultiplier > 1.0 && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#131718]/70">Audience Size ({audienceLabel})</span>
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
                              <span className="text-[#131718]/70 font-medium">Adjusted Rate</span>
                              <span className="font-semibold text-[#131718]">{adjustedHourlyRate.toFixed(2)}/hr</span>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-[#131718]/20"></div>

                          {/* Content Pricing Breakdown */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#131718]/70">Time Cost ({data.hoursPerContent}hrs)</span>
                              <span className="font-medium text-[#131718]">{baseContentCost.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#131718]/70">
                                {data.usageRights === 'organic' ? 'Organic Only (1x)' : 
                                 data.usageRights === 'paid_ad' ? 'Paid Ad Rights (2.5x)' : 
                                 'Exclusive Rights (5x)'}
                              </span>
                              <span className="font-medium text-[#131718]">×{rightsMultiplier}</span>
                            </div>
                          </div>

                          {/* Final Price */}
                          <div className="pt-2 mt-2 border-t border-[#131718] flex items-center justify-between">
                            <span className="font-semibold text-[#131718] text-[16px]">Your Floor Price</span>
                            <span className="text-base font-bold text-[#131718]">{finalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Why This Matters for Content Creators */}
                  <div className="backdrop-blur-xl bg-primary/5 rounded-lg shadow-sm p-4 mt-4">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="font-semibold text-[16px]">Why This Matters</h3>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <p>
                        <strong>Content creators</strong> price based on audience size, engagement, and usage rights—not just time. 
                        A 10K follower account with 5% engagement is more valuable than 100K with 0.5% engagement.
                      </p>
                      <p className="mt-2">
                        Usage rights matter: organic posts are base price, paid ad usage is 2-3x more, and exclusive rights can be 5x+.
                      </p>
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