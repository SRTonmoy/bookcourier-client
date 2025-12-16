import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Spinner";

export default function RoleRoute({ allow, children }) {
  const { role, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!allow.includes(role))
    return <Navigate to="/dashboard" replace />;

  return children;
}
