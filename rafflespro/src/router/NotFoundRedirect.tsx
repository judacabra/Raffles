import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function NotFoundRedirect() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}