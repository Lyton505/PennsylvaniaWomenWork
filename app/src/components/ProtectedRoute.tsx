import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import LoginLoading from "../pages/LoginLoading";

interface ProtectedRouteProps {
  element: ReactElement;
  allowedRoles: string[];
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user: auth0User } = useAuth0();
  const username = auth0User?.email || "";
  const { user, loading } = useCurrentUser(username);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <LoginLoading />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    console.log("Current user role: ", user.role);
    console.log("Allowed roles: ", allowedRoles);
    return <Navigate to="/home" replace />;
  }

  return element;
};

export default ProtectedRoute;
