import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "@/components/layout/public.layout";
import ErrorPage from "@/pages/error/error.page";
import publicRoutes from "../routes/public.route";
import protectedRoutes from "../routes/protected.route";
import SEO from "@/components/seo/seo";
import type IRoute from "@/models/route.model";

export default function RouterProvider() {
  return (
    <BrowserRouter>
      <SEO />
      <Routes>
        <Route errorElement={<ErrorPage />}>
          <Route element={<PublicLayout />}>
            {publicRoutes.map((route: IRoute, index: number) => (
              <Route key={route.path || index} {...route} />
            ))}
          </Route>
          <Route path="/app">
            {protectedRoutes.map((route: IRoute, index: number) => (
              <Route key={route.path || index} {...route} />
            ))}
          </Route>
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