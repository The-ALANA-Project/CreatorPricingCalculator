import { RouterProvider } from "react-router";
import { router } from "./routes";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { CookieBanner } from "@/app/components/CookieBanner";
import { LanguageProvider } from "@/app/i18n/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <TooltipProvider>
        {/* Hidden SVG filter for liquid glass distortion effect */}
        <svg style={{ display: "none" }} aria-hidden="true">
          <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves={1} seed={5} result="noise" />
            <feComponentTransfer in="noise" result="adjustedNoise">
              <feFuncR type="gamma" amplitude={1} exponent={0.5} offset={0} />
              <feFuncG type="gamma" amplitude={1} exponent={0.5} offset={0} />
              <feFuncB type="gamma" amplitude={1} exponent={0.5} offset={0} />
            </feComponentTransfer>
            <feGaussianBlur in="adjustedNoise" stdDeviation={3} result="softMap" />
            <feSpecularLighting in="softMap" surfaceScale={5} specularExponent={100} result="specLight">
              <fePointLight x={-200} y={-200} z={300} />
            </feSpecularLighting>
            <feComposite in="specLight" in2="softMap" operator="arithmetic" k1={0} k2={1} k3={0} k4={0} result="litMap" />
            <feDisplacementMap in="SourceGraphic" in2="softMap" scale={150} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <RouterProvider router={router} />
        <CookieBanner />
      </TooltipProvider>
    </LanguageProvider>
  );
}

export default App;