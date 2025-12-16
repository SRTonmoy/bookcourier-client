import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "./privateRoutes";
import { userRoutes, librarianRoutes, adminRoutes } from "./dashboardRoutes.jsx";
import { useAuth } from "../hooks/useAuth";

export default function RoutesApp() {
  const { role } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Dashboard routes */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {role === "user" &&
          userRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}

        {role === "librarian" &&
          librarianRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}

        {role === "admin" &&
          adminRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}
      </Route>

      {/* Catch-all for 404 */}
      <Route path="*" element={<h2 className="p-8 text-center">Page Not Found</h2>} />
    </Routes>
  );
}
