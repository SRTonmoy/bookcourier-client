import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Menu } from 'lucide-react'

export default function Navbar(){
  const { user, logout } = useAuth()

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary text-base-100 rounded-full flex items-center justify-center font-bold">BC</div>
          <span className="font-semibold text-lg">BookCourier</span>
        </Link>
      </div>
      <div className="flex-none hidden md:block">
        <ul className="menu menu-horizontal p-0">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/books">Books</NavLink></li>
          <li><NavLink to="/dashboard" className="btn btn-sm">
  Dashboard
</NavLink>
</li>
          {!user && <li><NavLink to="/login">Login</NavLink></li>}
          {user && (
            <li className="flex items-center gap-2">
              <img src={user.photoURL || '/favicon.ico'} alt="profile" className="w-8 h-8 rounded-full" />
            </li>
          )}
        </ul>
      </div>
      <div className="md:hidden">
        <button className="btn btn-ghost btn-circle">
          <Menu />
        </button>
      </div>
    </div>
  )
}