import { createBrowserRouter } from "react-router";
import { lazy } from "react";

const Intro = lazy(() => import("./pages/Intro"));
const Calculator = lazy(() => import("./pages/Calculator"));
const Resources = lazy(() => import("./pages/Resources"));

export const router = createBrowserRouter([
  { path: "/", Component: Intro },
  { path: "/home", Component: Intro },
  { path: "/calculator", Component: Calculator },
  { path: "/resources", Component: Resources },
  { path: "*", Component: Intro },
]);
