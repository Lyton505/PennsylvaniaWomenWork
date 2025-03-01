import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../contexts/UserContext";
import LoginLoading from "../pages/LoginLoading";

interface ProtectedRouteProps {
  element: ReactElement;
  allowedRoles: string[];
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { user, loading: userLoading } = useUser(); // ✅ Get user loading state

  if (auth0Loading || userLoading) {
    return <LoginLoading />; // ✅ Prevents flickering
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

export default ProtectedRoute;
