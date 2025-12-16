import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";

export default function DashboardLayout() {
  const { role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [];

  if (role === "user") {
    links.push(
      { name: "My Orders", path: "/dashboard" },
      { name: "My Profile", path: "/dashboard/profile" }
    );
  } else if (role === "librarian") {
    links.push(
      { name: "Add Book", path: "/dashboard/add-book" },
      { name: "My Books", path: "/dashboard/my-books" }
    );
  } else if (role === "admin") {
    links.push(
      { name: "All Users", path: "/dashboard/users" },
      { name: "Manage Books", path: "/dashboard/manage-books" }
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Mobile toggle */}
      <button
        className="md:hidden absolute top-4 left-4 btn btn-square btn-ghost"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <HiMenu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed z-20 inset-y-0 left-0 w-64 bg-base-200 p-6 transform md:translate-x-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative`}
      >
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg hover:bg-primary hover:text-white ${
                    isActive ? "bg-primary text-white" : ""
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          <li className="mt-6">
            <button
              onClick={logout}
              className="btn btn-error w-full"
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}
