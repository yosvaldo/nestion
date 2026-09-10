import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "@/stores/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: "USER" | "TENANT";
  requireVerified?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRole,
  requireVerified = false,
}: ProtectedRouteProps) {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!accessToken || !user) {
      toast.error("Silakan login terlebih dahulu untuk mengakses halaman ini.");
    } else if (requireVerified && !user.isVerified) {
      toast.error("Akun Anda belum terverifikasi. Silakan cek email Anda.");
    } else if (allowedRole && user.role !== allowedRole) {
      toast.error("Anda tidak memiliki akses ke halaman ini.");
    }
  }, [accessToken, user, allowedRole, requireVerified]);

  if (!accessToken || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireVerified && !user.isVerified) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}