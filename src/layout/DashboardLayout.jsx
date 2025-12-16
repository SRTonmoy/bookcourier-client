import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout() {
  const { role, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>

        <ul className="menu">
          {role === "user" && (
            <>
              <li><NavLink to="/dashboard">My Orders</NavLink></li>
              <li><NavLink to="/dashboard/profile">My Profile</NavLink></li>
            </>
          )}

          {role === "librarian" && (
            <>
              <li><NavLink to="/dashboard/add-book">Add Book</NavLink></li>
              <li><NavLink to="/dashboard/my-books">My Books</NavLink></li>
            </>
          )}

          {role === "admin" && (
            <>
              <li><NavLink to="/dashboard/users">All Users</NavLink></li>
              <li><NavLink to="/dashboard/manage-books">Manage Books</NavLink></li>
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
      <main className="flex-1 p-6 bg-base-100">
        <Outlet />
      </main>
    </div>
  );
}
