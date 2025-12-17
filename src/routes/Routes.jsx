import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import AllBooks from "../pages/Books/AllBooks";
import BookDetails from "../pages/Books/BookDetails";

import PrivateRoute from "./PrivateRoutes";
import { userRoutes, librarianRoutes, adminRoutes } from "./dashboardRoutes";
import { useAuth } from "../hooks/useAuth";

export default function RoutesApp() {
  const { role } = useAuth();

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<AllBooks />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {role === "user" && <Route index element={userRoutes[0].element} />}
        {role === "librarian" && (
          <Route index element={librarianRoutes[0].element} />
        )}
        {role === "admin" && <Route index element={adminRoutes[0].element} />}

        {role === "user" &&
          userRoutes.map(
            r => r.path && <Route key={r.path} path={r.path} element={r.element} />
          )}

        {role === "librarian" &&
          librarianRoutes.map(
            r => r.path && <Route key={r.path} path={r.path} element={r.element} />
          )}

        {role === "admin" &&
          adminRoutes.map(
            r => r.path && <Route key={r.path} path={r.path} element={r.element} />
          )}
      </Route>

      {/* 404 */}
      <Route path="*" element={<h2 className="p-10 text-center">Not Found</h2>} />
    </Routes>
  );
}
