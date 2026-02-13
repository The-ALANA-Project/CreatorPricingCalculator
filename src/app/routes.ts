import { createBrowserRouter } from "react-router";
import Calculator from "./pages/Calculator";
import Resources from "./pages/Resources";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Calculator,
  },
  {
    path: "/resources",
    Component: Resources,
  },
]);
