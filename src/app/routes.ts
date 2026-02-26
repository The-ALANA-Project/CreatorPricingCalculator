import { createBrowserRouter } from "react-router";
import Intro from "./pages/Intro";
import Calculator from "./pages/Calculator";
import Resources from "./pages/Resources";

export const router = createBrowserRouter([
  { path: "/", Component: Intro },
  { path: "/home", Component: Intro },
  { path: "/calculator", Component: Calculator },
  { path: "/resources", Component: Resources },
  { path: "*", Component: Intro },
]);
