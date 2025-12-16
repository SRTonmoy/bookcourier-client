// src/routes/PrivateRoutes.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Wrap protected routes with this component
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can show a loader while checking auth
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in, render the protected route
  return children;
}
