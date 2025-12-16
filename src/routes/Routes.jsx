import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "./privateRoutes.jsx";
import { userRoutes, librarianRoutes, adminRoutes } from "./dashboardRoutes.jsx";
import { useAuth } from "../hooks/useAuth";
import Books from "../pages/Books/AllBooks.jsx";

export default function RoutesApp() {
  const { role } = useAuth();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books" element={<Books />} />  
      </Route>

      <Route
        path="/dashboard"
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
    </Routes>
  );
}
