import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthenticationContext";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const authToken = localStorage.getItem('authToken'); // Check localStorage

  if (!isAuthenticated && !authToken) {
    return <Navigate to="/authentication/sign-in" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
