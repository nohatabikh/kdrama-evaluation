import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { getAuthDestination } from "../utils/authNavigation";

type GuestRouteProps = {
  children: ReactNode;
};

function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  const destination = getAuthDestination(location.state);

  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  return children;
}

export default GuestRoute;
