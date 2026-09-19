import type IRoute from "@/models/route.model";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfilePage from "@/pages/user/profile.page";
import UserOrdersPage from "@/pages/user/order.page";
import TenantDashboardPage from "@/pages/tenant/dashboard.page";

export const userProtectedRoutes: IRoute[] = [
  {
    path: "profile",
    element: (
      <ProtectedRoute allowedRole="USER" requireVerified>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "orders",
    element: (
      <ProtectedRoute allowedRole="USER" requireVerified>
        <UserOrdersPage />
      </ProtectedRoute>
    ),
  },
];

export const tenantProtectedRoutes: IRoute[] = [
  {
    path: "tenant/dashboard",
    element: (
      <ProtectedRoute allowedRole="TENANT" requireVerified>
        <TenantDashboardPage />
      </ProtectedRoute>
    ),
  },
];