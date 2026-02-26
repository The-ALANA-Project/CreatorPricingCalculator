import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { SEO } from "@/app/components/SEO";

export default function Intro() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const tubeRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const line3Ref = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // GSAP barrel-roll animation
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.set(containerRef.current, { visibility: "visible" });

    const lines = [line1Ref.current, line2Ref.current, line3Ref.current];
    if (!lines.every(Boolean)) return;

    const textLines = ["Creator", "Pricing", "Calculator"];

    // Split each word into individual char spans
    const splitLines = lines.map((line, lineIndex) => {
      if (!line) return null;
      line.innerHTML = textLines[lineIndex]
        .split("")
        .map(
          (char) =>
            `<span class="char" style="display:inline-block;backface-visibility:hidden;">${char}</span>`
        )
        .join("");
      return line.querySelectorAll(".char");
    });

    let tl: gsap.core.Timeline | null = null;

    // Double rAF to ensure DOM layout is complete before 3D transforms
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const width = window.innerWidth;
        const depth = -width / 8;
        const transformOrigin = `50% 50% ${depth}px`;

        gsap.set(lines, {
          perspective: 700,
          transformStyle: "preserve-3d",
        });

        // CTA fade-in after 2s
        if (ctaRef.current) {
          gsap.to(ctaRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 2,
            ease: "power2.out",
          });
        }

        // Main looping timeline
        tl = gsap.timeline({ repeat: -1 });

        splitLines.forEach((chars, index) => {
          if (!chars || !tl) return;

          tl.fromTo(
            Array.from(chars),
            { rotationX: -90 },
            {
              rotationX: 270,
              stagger: 0.12,
              duration: 2.5,
              ease: "none",
              transformOrigin,
              onUpdate() {
                Array.from(chars).forEach((char: Element) => {
                  const el = char as HTMLElement;
                  const rot = gsap.getProperty(el, "rotationX") as number;
                  const n = ((rot % 360) + 360) % 360;
                  el.style.opacity = n > 90 && n < 270 ? "0" : "1";
                });
              },
            },
            index * 0.75
          );
        });
      });
    });

    return () => {
      tl?.kill();
    };
  }, []);

  // Exit: liquid glass dissolve
  const handleBeginJourney = () => {
    sessionStorage.setItem("intro-seen", "true");
    sessionStorage.setItem("intro-transitioning", "true");

    if (!containerRef.current) {
      navigate("/calculator");
      return;
    }

    gsap
      .timeline({ onComplete: () => navigate("/calculator") })
      .to(containerRef.current, {
        opacity: 0,
        filter: "blur(50px)",
        scale: 1.08,
        duration: 1.4,
        ease: "power1.inOut",
      });
  };

  return (
    <>
      <SEO
        title="Creator Pricing Calculator - Know Your Worth, Set Your Rates"
        description="Calculate your sustainable creator rates based on real expenses, taxes, and business needs. Stop guessing, start pricing with confidence."
        keywords="creator pricing, freelance rates, rate calculator, creator economy, pricing strategy, freelance pricing, content creator rates"
      />

      <div
        ref={containerRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#131718", visibility: "hidden" }}
      >
        {/* Rolling text container */}
        <div
          ref={tubeRef}
          className="relative w-full flex flex-col items-center justify-center"
          style={{ height: "clamp(300px, 30vw, 500px)" }}
        >
          {["Creator", "Pricing", "Calculator"].map((word, i) => {
            const refs = [line1Ref, line2Ref, line3Ref];
            return (
              <h1
                key={word}
                ref={refs[i]}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 whitespace-nowrap text-center"
                style={{
                  lineHeight: 1.2,
                  letterSpacing: "-0.4vw",
                  fontSize: "clamp(80px, 14vw, 200px)",
                  color: "#FEE6EA",
                  backfaceVisibility: "hidden",
                  willChange: "transform",
                }}
              >
                {word}
              </h1>
            );
          })}
        </div>

        {/* CTA section — fades in after 2s */}
        <div
          ref={ctaRef}
          className="mt-16 mb-32 opacity-0 flex flex-col items-center"
          style={{ transform: "translateY(20px)" }}
        >
          <button
            onClick={handleBeginJourney}
            className="relative overflow-hidden rounded-full px-12 py-4 text-lg font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              background: "#131718",
              color: "#FEE6EA",
              border: "1px solid #FEE6EA",
              boxShadow:
                "0 0 30px rgba(254,230,234,0.3), 0 0 60px rgba(254,230,234,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(254,230,234,0.9)";
              e.currentTarget.style.color = "#131718";
              e.currentTarget.style.boxShadow = "none";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#131718";
              e.currentTarget.style.color = "#FEE6EA";
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(254,230,234,0.3), 0 0 60px rgba(254,230,234,0.15)";
            }}
          >
            Start Pricing Now
          </button>

          <p
            className="text-center mt-6 text-sm px-6"
            style={{ color: "rgba(254,230,234,0.6)", maxWidth: "400px" }}
          >
            Optimized for desktop experience. Mobile works, but may feel less
            convenient.
          </p>
        </div>
      </div>
    </>
  );
}