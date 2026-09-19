import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "@/components/layout/public.layout";
import ErrorPage from "@/pages/error/error.page";
import publicRoutes from "../routes/public.route";
import SEO from "@/components/seo/seo";
import type IRoute from "@/models/route.model";
import ProtectedLayout from "@/components/layout/protected.layout";
import ProfilePage from "@/pages/user/profile.page";
import UserOrdersPage from "@/pages/user/order.page";
import TenantDashboardPage from "@/pages/tenant/dashboard.page";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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

            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRole="USER" requireVerified>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute allowedRole="USER" requireVerified>
                  <UserOrdersPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route
              path="tenant/dashboard"
              element={
                <ProtectedRoute allowedRole="TENANT" requireVerified>
                  <TenantDashboardPage />
                </ProtectedRoute>
              }
            />
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