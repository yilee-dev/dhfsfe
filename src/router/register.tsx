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

export const registerRoutes = {
  file: [...appRoutes],
};
