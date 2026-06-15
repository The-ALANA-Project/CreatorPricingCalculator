import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ExternalLink, Shield, Zap, FileText } from "lucide-react";
import { Link } from "react-router";
import { FloatingToolbar } from "@/app/components/FloatingToolbar";
import { useLanguage, LanguageToggle } from "@/app/i18n/LanguageContext";

export default function Resources() {
  const { t } = useLanguage();

  const resources = [
    {
      category: "Help" as const,
      icon: Shield,
      items: [
        {
          title: "HateAid",
          description: t.resources.items.hateaid,
          url: "https://hateaid.org/en/",
          author: "",
          authorUrl: "",
        },
      ],
    },
    {
      category: "Platforms" as const,
      icon: Zap,
      items: [
        {
          title: "Paragraph",
          description: t.resources.items.paragraph,
          url: "https://paragraph.com/",
          author: "",
          authorUrl: "",
        },
      ],
    },
    {
      category: "Tools" as const,
      icon: FileText,
      items: [
        {
          title: "Freelance Rate Guide",
          description: t.resources.items.freelancerate,
          url: "https://www.freelancerateguide.com/",
          author: "Shivani Shah",
          authorUrl: "https://www.linkedin.com/in/wordsbyshivani/",
        },
        {
          title: "Creator Branding Studio",
          description: t.resources.items.brandingstudio,
          url: "https://creator-branding.com/",
          author: "Stella Achenbach",
          authorUrl: "https://www.linkedin.com/in/stella-achenbach/",
        },
        {
          title: "Creator Contract Builder",
          description: t.resources.items.creatorcontractbuilder,
          url: "https://creatorcontractbuilder.com/",
          author: "Stella Achenbach",
          authorUrl: "https://www.linkedin.com/in/stella-achenbach/",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Floating Toolbar - no steps on Resources page */}
      <FloatingToolbar showSteps={false} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-primary/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] py-6 sm:py-6">
        <div className="px-4 sm:px-6">
          <div className="flex items-start sm:items-end justify-between">
            <div>
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-primary-foreground">{t.resources.title}</h1>
              <p className="text-sm sm:text-sm text-[#fee6ea] mt-1">
                {t.resources.subtitle}
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
        <div className="max-w-4xl mx-auto space-y-8">
          {resources.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-6">
                  <IconComponent className="h-6 w-6 text-primary" />
                  <h2 className="font-semibold text-[25px]">{t.resources.sections[section.category]}</h2>
                </div>

                <div className="grid gap-6">
                  {section.items.map((item) => (
                    <Card 
                      key={item.title}
                      className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.15)] transition-all duration-300"
                    >
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm sm:text-base text-muted-foreground mb-4">
                              {item.description}
                            </p>
                            {item.author && (
                              <p className="text-sm text-muted-foreground">
                                {t.resources.createdBy}{" "}
                                <a 
                                  href={item.authorUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-medium"
                                >
                                  {item.author}
                                </a>
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <a 
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button className="w-full sm:w-auto">
                                {section.category === "Help" ? t.resources.buttons.learnMore : section.category === "Platforms" ? t.resources.buttons.visitPlatform : t.resources.buttons.visitTool}
                              </Button>
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Divider */}
      <div className="border-t border-[#131718]" />

      {/* Footer */}
      <footer className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-muted-foreground px-[16px] pt-[0px] pb-24 lg:pb-[16px]">
        <p>
          {t.resources.footer.share}{' '}
          <a
            href="https://ko-fi.com/stellaachenbach"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-bold"
          >
            {t.resources.footer.donating}
          </a>
          {' '}{t.resources.footer.helpful}
        </p>
        <p className="mt-2">
          {t.resources.footer.madeWith}{' '}
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