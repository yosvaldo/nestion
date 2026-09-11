import type IRoute from "@/models/route.model";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfilePage from "@/pages/user/profile.page";
import UserOrdersPage from "@/pages/user/order.page";
import TenantDashboardPage from "@/pages/tenant/dashboard.page";

const protectedRoutes: IRoute[] = [
  {
    path: "profile",
    element: (
      <ProtectedRoute requireVerified>
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
  {
    path: "tenant/dashboard",
    element: (
      <ProtectedRoute allowedRole="TENANT" requireVerified>
        <TenantDashboardPage />
      </ProtectedRoute>
    ),
  },
];

export default protectedRoutes;