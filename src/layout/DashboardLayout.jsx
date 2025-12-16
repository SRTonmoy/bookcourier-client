import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HiMenu } from "react-icons/hi";

export default function DashboardLayout() {
  const { role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile hamburger */}
      <div className="md:hidden absolute top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-square btn-ghost"
        >
          <HiMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-10 top-0 left-0 h-full w-64 bg-base-200 p-4 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <ul className="menu">
          {role === "user" && (
            <>
              <li>
                <NavLink to="/dashboard/MyOrders" onClick={() => setSidebarOpen(false)}>
                  My Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/MyProfile"
                  onClick={() => setSidebarOpen(false)}
                >
                  My Profile
                </NavLink>
              </li>
            </>
          )}

          {role === "librarian" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/AddBook"
                  onClick={() => setSidebarOpen(false)}
                >
                  Add Book
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/MyBooks"
                  onClick={() => setSidebarOpen(false)}
                >
                  My Books
                </NavLink>
              </li>
            </>
          )}

          {role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/AllUsers"
                  onClick={() => setSidebarOpen(false)}
                >
                  All Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/ManageBooks"
                  onClick={() => setSidebarOpen(false)}
                >
                  Manage Books
                </NavLink>
              </li>
            </>
          )}

          <li className="mt-4">
            <button onClick={logout} className="btn btn-sm btn-error">
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 md:ml-64 p-6 bg-base-100">
        <Outlet />
      </main>
    </div>
  );
}
