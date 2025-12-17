import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Home } from "lucide-react";
import {useRole} from "../hooks/useRole";
import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout() {
  const { role, loading } = useRole();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 transition ${
      isActive ? "bg-primary text-white" : "hover:bg-base-300"
    }`;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-base-100 shadow">
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
        <h2 className="font-bold">Dashboard</h2>
        <button onClick={() => navigate("/")}>
          <Home size={22} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-base-100 shadow-lg
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">📊 Dashboard</h2>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <ul className="menu p-4 gap-1">
          {/* Go Home */}
          <li>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-300"
            >
              <Home size={18} /> Go Home
            </button>
          </li>

          <div className="divider" />

          {/* User */}
          {role === "user" && (
            <>
              <li><NavLink end to="/dashboard" className={linkClass}>My Orders</NavLink></li>
              <li><NavLink to="/dashboard/profile" className={linkClass}>Profile</NavLink></li>
              <li><NavLink to="/dashboard/wishlist" className={linkClass}>Wishlist</NavLink></li>
            </>
          )}

          {/* Librarian */}
          {role === "librarian" && (
            <>
              <li><NavLink end to="/dashboard" className={linkClass}>My Books</NavLink></li>
              <li><NavLink to="/dashboard/add-book" className={linkClass}>Add Book</NavLink></li>
            </>
          )}

          {/* Admin */}
          {role === "admin" && (
            <>
              <li><NavLink end to="/dashboard" className={linkClass}>All Users</NavLink></li>
              <li><NavLink to="/dashboard/manage-books" className={linkClass}>Manage Books</NavLink></li>
            </>
          )}

          <div className="divider" />

          <li>
            <button
              onClick={logout}
              className="btn btn-error btn-sm w-full"
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Content */}
      <main className="lg:ml-64 p-6 bg-base-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
