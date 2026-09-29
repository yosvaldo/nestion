import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "@/components/layout/public.layout";
import ErrorPage from "@/pages/error/error.page";
import publicRoutes from "../routes/public.route";
import { userProtectedRoutes, tenantProtectedRoutes } from "../routes/protected.route";
import SEO from "@/components/seo/seo";

export default function RouterProvider() {
  return (
    <BrowserRouter>
      <SEO />
      <Routes>
        <Route errorElement={<ErrorPage />}>
          <Route element={<PublicLayout />}>
            {publicRoutes.map((route, index) =>
              route.index ? (
                <Route key="home" index element={route.element} />
              ) : (
                <Route key={route.path || index} path={route.path} element={route.element} />
              )
            )}
          </Route>

          <Route element={<PublicLayout />}>
            {userProtectedRoutes.map((route, index) => (
              <Route key={route.path || index} path={route.path} element={route.element} />
            ))}
          </Route>

          {tenantProtectedRoutes.map((route, index) => (
            <Route key={route.path || index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) =>
                child.index ? (
                  <Route key="tenant-index" index element={child.element} />
                ) : (
                  <Route
                    key={child.path || childIndex}
                    path={child.path}
                    element={child.element}
                  />
                )
              )}
            </Route>
          ))}
        </Route>

        <Route
          path="*"
          element={
            <div className="p-12 text-center font-sans font-medium text-slate-600">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}