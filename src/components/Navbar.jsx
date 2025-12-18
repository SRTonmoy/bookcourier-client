import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Heart, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useWishlistStore } from "../store/wishlistStore";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getWishlistCount } = useWishlistStore();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const wishlistCount = getWishlistCount();

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 transition-colors ${
      isActive ? "bg-primary text-primary-content" : "hover:bg-base-300"
    }`;

  if (loading) {
    return (
      <nav className="navbar bg-base-100 shadow sticky top-0 z-50">
        <div className="navbar-start">
          <div className="w-10 h-10 rounded-lg bg-base-300 animate-pulse"></div>
        </div>
        <div className="navbar-center">
          <div className="h-6 w-32 bg-base-300 rounded animate-pulse"></div>
        </div>
        <div className="navbar-end">
          <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse"></div>
        </div>
      </nav>
    );
  }

  const renderAvatar = (size = 10, iconSize = 20) => (
    <div className={`w-${size} h-${size} rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 overflow-hidden bg-base-300`}>
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName || user.email || "User"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/user-default.jpg";
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-content">
          <User size={iconSize} />
        </div>
      )}
    </div>
  );

  return (
    <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50 border-b">
      {/* LEFT */}
      <div className="navbar-start">
        {/* Mobile menu button */}
        <button
          className="btn btn-ghost btn-circle md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 px-3 hover:no-underline">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center font-bold shadow-md">
            <span className="text-lg">BC</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            BookCourier
          </span>
        </Link>
      </div>

      {/* CENTER (Desktop links) */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal gap-1">
          <li>
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/books" className={navLinkClass}>
              All Books
            </NavLink>
          </li>
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
      <div className="navbar-end gap-2">
        {/* Wishlist icon */}
        {user && (
          <Link
            to="/dashboard/wishlist"
            className="btn btn-ghost btn-circle relative group"
            title="Wishlist"
          >
            <Heart 
              size={22} 
              className="transition-transform group-hover:scale-110 group-hover:text-red-500" 
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 badge badge-primary badge-sm flex items-center justify-center p-0">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
        )}

        {/* Theme toggle */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        {/* User / Auth */}
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar transition-all hover:scale-105" title="User Menu">
              {renderAvatar(10, 20)}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-56 mt-3 border">
              {/* User Info */}
              <li className="px-4 py-3 border-b bg-base-200">
                <div className="flex items-center gap-3">
                  {renderAvatar(10, 18)}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {user.displayName || user.email?.split('@')[0] || "User"}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </li>

              {/* Menu Items */}
              <li className="mt-1">
                <Link to="/dashboard" className="py-3">Dashboard</Link>
              </li>
              <li>
                <Link to="/dashboard/wishlist" className="py-3 flex justify-between items-center">
                  Wishlist {wishlistCount > 0 && <span className="badge badge-primary badge-sm">{wishlistCount}</span>}
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-orders" className="py-3">My Orders</Link>
              </li>
              <li>
                <Link to="/dashboard/my-profile" className="py-3">Profile</Link>
              </li>

              <div className="divider my-1"></div>

              <li>
                <button onClick={handleLogout} className="py-3 text-error hover:bg-error hover:text-error-content transition-colors">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="sm:hidden"><ThemeToggle /></div>
            <Link to="/login" className="btn btn-outline btn-sm hover:scale-105 transition-transform">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm hover:scale-105 transition-transform shadow-md">Register</Link>
          </div>
        )}
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-base-100 border-t shadow-lg animate-slideDown">
          <ul className="menu p-4 space-y-1">
            <li>
              <NavLink to="/" className={({ isActive }) => `rounded-lg ${isActive ? 'bg-primary text-primary-content' : ''}`} onClick={() => setMobileMenuOpen(false)} end>Home</NavLink>
            </li>
            <li>
              <NavLink to="/books" className={({ isActive }) => `rounded-lg ${isActive ? 'bg-primary text-primary-content' : ''}`} onClick={() => setMobileMenuOpen(false)}>All Books</NavLink>
            </li>
            {user ? (
              <>
                <div className="divider my-2"></div>
                <li className="menu-title"><span className="text-muted">Dashboard</span></li>
                <li><NavLink to="/dashboard" className={({ isActive }) => `rounded-lg ${isActive ? 'bg-primary text-primary-content' : ''}`} onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink></li>
                <li>
                  <NavLink to="/dashboard/wishlist" className={({ isActive }) => `rounded-lg ${isActive ? 'bg-primary text-primary-content' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center justify-between w-full">
                      <span>Wishlist</span>
                      {wishlistCount > 0 && <span className="badge badge-primary badge-sm">{wishlistCount}</span>}
                    </div>
                  </NavLink>
                </li>
                <li><NavLink to="/dashboard/my-orders" className={({ isActive }) => `rounded-lg ${isActive ? 'bg-primary text-primary-content' : ''}`} onClick={() => setMobileMenuOpen(false)}>My Orders</NavLink></li>
                <li><NavLink to="/dashboard/my-profile" className={({ isActive }) => `rounded-lg ${isActive ? 'bg-primary text-primary-content' : ''}`} onClick={() => setMobileMenuOpen(false)}>Profile</NavLink></li>
                <div className="divider my-2"></div>
                <li><button onClick={handleLogout} className="text-error rounded-lg py-3 hover:bg-error hover:text-error-content w-full">Logout</button></li>
              </>
            ) : (
              <>
                <div className="divider my-2"></div>
                <li><Link to="/login" className="btn btn-outline w-full justify-center" onClick={() => setMobileMenuOpen(false)}>Login</Link></li>
                <li><Link to="/register" className="btn btn-primary w-full justify-center" onClick={() => setMobileMenuOpen(false)}>Register</Link></li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40 top-16" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </nav>
  );
}
