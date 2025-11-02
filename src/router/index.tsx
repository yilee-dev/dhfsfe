import { Route, Routes, type RouteProps } from "react-router";
import { registerRoutes } from "./register";
import { Suspense } from "react";
import FileAppLayout from "@/pages/file-manager/layout";

const Router = (props: RouteProps) => {
  return (
    <Routes>
      <Route>
        {registerRoutes.file.map((route, index) => (
          <Route
            key={"route-" + index}
            path={route.path}
            element={
              <FileAppLayout>
                <Suspense>{route.element}</Suspense>
              </FileAppLayout>
            }
          />
        ))}
      </Route>
      <Route>
        {registerRoutes.auth.map((route, index) => (
          <Route
            key={"auth-" + index}
            path={route.path}
            element={<Suspense>{route.element}</Suspense>}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default Router;
