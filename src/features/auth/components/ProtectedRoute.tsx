import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { shouldPreserveProtectedDestination } from "../utils/authNavigation";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const destination = `${location.pathname}${location.search}${location.hash}`;
    const state = shouldPreserveProtectedDestination(destination)
      ? { from: location }
      : undefined;

    return <Navigate to="/login" replace state={state} />;
  }

  return children;
}

export default ProtectedRoute;
