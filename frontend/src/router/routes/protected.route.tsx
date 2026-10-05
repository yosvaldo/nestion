import type IRoute from "@/models/route.model";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfilePage from "@/pages/user/profile.page";
import UserOrdersPage from "@/pages/user/order.page";
import TenantDashboardPage from "@/pages/tenant/dashboard.page";
import TenantLayout from "@/components/layout/tenant.layout";
import TenantOrdersPage from "@/pages/tenant/order.page";
import TenantReportsPage from "@/pages/tenant/report.page";
import CreateProperty from "@/components/form/CreateProperty";
import RoomSettingsPage from "@/pages/tenant/room-setting.page";

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
    path: "tenant",
    element: (
      <ProtectedRoute allowedRole="TENANT" requireVerified>
        <TenantLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TenantDashboardPage /> },
      { path: "properties/create", element: <CreateProperty /> },
//      { path: "properties/:id/edit", element: <EditProperty />},
      { path: "rooms/:roomId", element: <RoomSettingsPage />},
      { path: "orders", element: <TenantOrdersPage /> },
      { path: "reports", element: <TenantReportsPage /> },
    ],
  },
];