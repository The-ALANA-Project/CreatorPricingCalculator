import { RouterProvider } from "react-router";
import { router } from "./routes";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { CookieBanner } from "@/app/components/CookieBanner";

function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
      <CookieBanner />
    </TooltipProvider>
  );
}

export default App;