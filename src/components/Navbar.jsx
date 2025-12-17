// components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useWishlistStore } from "../store/wishlistStore";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getWishlistCount } = useWishlistStore();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const wishlistCount = getWishlistCount();

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 ${
      isActive
        ? "bg-primary text-primary-content"
        : "hover:bg-base-300"
    }`;

  return (
    <nav className="navbar bg-base-100 shadow sticky top-0 z-50">
      {/* LEFT */}
      <div className="navbar-start">
        {/* Mobile menu button */}
        <button
          className="btn btn-ghost btn-circle md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 px-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
            BC
          </div>
          <span className="font-bold text-xl">BookCourier</span>
        </Link>
      </div>

      {/* CENTER (Desktop links) */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal gap-2">
          <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
          <li><NavLink to="/books" className={navLinkClass}>All Books</NavLink></li>
          {user && (
            <li>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end gap-3">
        {/* Wishlist icon */}
        {user && (
          <Link
            to="/dashboard/wishlist"
            className="btn btn-ghost btn-circle relative"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 badge badge-primary badge-xs">
                {wishlistCount}
              </span>
            )}
          </Link>
        )}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User / Auth */}
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="user"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="px-4 py-2 border-b">
                <p className="font-semibold">{user.displayName || "User"}</p>
                <p className="text-xs">{user.email}</p>
              </li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/dashboard/wishlist">Wishlist</Link></li>
              <li>
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        )}
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-base-100 border-t shadow">
          <ul className="menu p-4 space-y-2">
            <li>
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/books" onClick={() => setMobileMenuOpen(false)}>
                All Books
              </NavLink>
            </li>

            {user ? (
              <>
                <li>
                  <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/wishlist" onClick={() => setMobileMenuOpen(false)}>
                    Wishlist ({wishlistCount})
                  </NavLink>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
