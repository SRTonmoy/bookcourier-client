// components/Navbar.jsx - UPDATED
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        {/* Mobile Menu Button */}
        <div className="dropdown md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-circle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 px-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary text-base-100 rounded-full flex items-center justify-center font-bold text-xl">
            BC
          </div>
          <div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BookCourier
            </span>
            <p className="text-xs text-muted">Library-to-Home Delivery</p>
          </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `rounded-lg ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/books" 
              className={({ isActive }) => 
                `rounded-lg ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`
              }
            >
              All Books
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `rounded-lg ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`
                }
              >
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* Right Side: Theme Toggle & User */}
      <div className="navbar-end gap-4 px-4">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* User Profile or Login */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              className="btn btn-ghost btn-circle avatar"
              role="button"
              aria-label="User menu"
            >
              <div className="w-10 h-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                <img 
                  src={user.photoURL || '/default-avatar.png'} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
            </div>
            <ul 
              tabIndex={0} 
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2"
            >
              <li className="px-4 py-2 border-b">
                <div className="font-semibold">{user.displayName || 'User'}</div>
                <div className="text-sm text-muted">{user.email}</div>
              </li>
              <li>
                <Link to="/dashboard" className="py-3">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-profile" className="py-3">
                  My Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="py-3 text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-outline btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-base-100 shadow-lg border-t">
          <ul className="menu p-4 space-y-2">
            <li>
              <NavLink 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `block py-3 rounded-lg ${isActive ? 'bg-primary text-primary-content' : ''}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/books" 
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `block py-3 rounded-lg ${isActive ? 'bg-primary text-primary-content' : ''}`
                }
              >
                All Books
              </NavLink>
            </li>
            {user ? (
              <>
                <li>
                  <NavLink 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `block py-3 rounded-lg ${isActive ? 'bg-primary text-primary-content' : ''}`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/my-profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `block py-3 rounded-lg ${isActive ? 'bg-primary text-primary-content' : ''}`
                    }
                  >
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left py-3 text-error rounded-lg"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 rounded-lg"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 rounded-lg bg-primary text-primary-content"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}