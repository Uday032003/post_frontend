import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const accessToken = Cookies.get("access_Token");
  if (accessToken === undefined) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
