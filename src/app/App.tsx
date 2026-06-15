import { RouterProvider } from "react-router";
import { router } from "./routes";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { CookieBanner } from "@/app/components/CookieBanner";
import { LanguageProvider } from "@/app/i18n/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
        <CookieBanner />
      </TooltipProvider>
    </LanguageProvider>
  );
}

export default App;