import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

const allowAnyAuthAdmin = (import.meta.env.VITE_ALLOW_ANY_AUTH_ADMIN ?? "false") === "true";

export function ProtectedRoute() {
  const { loading, user, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // ✅ TEMPORÁRIO: qualquer logado entra
  if (allowAnyAuthAdmin) return <Outlet />;

  // ✅ Normal: só admins (allowlist)
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
