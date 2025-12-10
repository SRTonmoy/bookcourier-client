import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../utils/AuthProvider';
import { FaMoon, FaSun, FaUserCircle, FaBars } from 'react-icons/fa';

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  return (
    <nav className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">📚 BookCourier</Link>
      </div>

      <div className="hidden md:flex gap-2">
        <NavLink to="/" className="btn btn-ghost">Home</NavLink>
        <NavLink to="/books" className="btn btn-ghost">Books</NavLink>
        <NavLink to="/dashboard" className="btn btn-ghost">Dashboard</NavLink>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn btn-ghost" title="Toggle theme"><FaMoon/></button>
        {user ? (
          <Link to="/dashboard" className="avatar">
            <div className="w-8 rounded-full">
              <img src={user.photoURL || 'https://i.pravatar.cc/150?img=3'} alt="avatar" />
            </div>
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary">Login</Link>
        )}

        <button className="md:hidden btn btn-ghost" onClick={()=> setOpen(!open)}><FaBars/></button>
      </div>

      {open && (
        <div className="md:hidden absolute right-4 top-16 bg-base-200 rounded shadow p-3">
          <NavLink to="/" className="block py-1">Home</NavLink>
          <NavLink to="/books" className="block py-1">Books</NavLink>
          <NavLink to="/dashboard" className="block py-1">Dashboard</NavLink>
          <NavLink to="/login" className="block py-1">Login</NavLink>
        </div>
      )}
    </nav>
  );
}
