import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/Intro").then((m) => ({ Component: m.default })),
  },
  {
    path: "/calculator",
    lazy: () => import("./pages/Calculator").then((m) => ({ Component: m.default })),
  },
  {
    path: "/resources",
    lazy: () => import("./pages/Resources").then((m) => ({ Component: m.default })),
  },
  {
    path: "*",
    lazy: () => import("./pages/Intro").then((m) => ({ Component: m.default })),
  },
]);
