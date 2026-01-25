import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

export function ProtectedRoute() {
  const { loading, user, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return null; // ou um loader bonito

  // Se não está logado, manda pro login
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // Se está logado mas não é admin, bloqueia também
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
