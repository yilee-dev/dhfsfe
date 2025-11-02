import { lazy, type JSX, type LazyExoticComponent } from "react";

import type { RouteProps } from "react-router";

export type IRoutesProps = {
  path: RouteProps["path"];
  element: RouteProps["element"];
};

const cw = (Component: LazyExoticComponent<() => JSX.Element>) => {
  return <Component />;
};

const appRoutes: IRoutesProps[] = [
  {
    path: "/",
    element: cw(lazy(() => import("@/pages/file-manager"))),
  },
  {
    path: "/folders/:id",
    element: cw(lazy(() => import("@/pages/file-manager"))),
  },
];

const authRoutes: IRoutesProps[] = [
  {
    path: "/sign-in",
    element: cw(lazy(() => import("@/pages/auth/sign-in"))),
  },
  {
    path: "/sign-up",
    element: cw(lazy(() => import("@/pages/auth/sign-up"))),
  },
];

export const registerRoutes = {
  auth: [...authRoutes],
  file: [...appRoutes],
};
