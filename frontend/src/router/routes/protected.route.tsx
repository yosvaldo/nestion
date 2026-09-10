import type IRoute from "@/models/route.model";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const ProfilePage = () => (
  <div className="p-8 font-sans max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
  </div>
);

const UserOrdersPage = () => (
  <div className="p-8 font-sans max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
  </div>
);

const TenantDashboardPage = () => (
  <div className="p-8 font-sans max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold text-slate-900">Tenant Dashboard</h1>
  </div>
);

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