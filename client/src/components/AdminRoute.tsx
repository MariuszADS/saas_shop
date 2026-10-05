import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

export default function AdminRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
}