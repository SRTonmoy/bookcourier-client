// layout/DashboardLayout.jsx
// ENHANCED DESIGN VERSION
// - Improved visual hierarchy
// - Better spacing and alignment
// - Enhanced sidebar aesthetics
// - Cleaner header design
// - Smooth transitions and polish

import React, { useState, useEffect } from 'react';
import { Link, Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import ThemeToggle from '../components/ThemeToggle';
import {
  Menu, Home, BookOpen, ShoppingCart, User,
  FileText, Heart, Users, BarChart,
  LogOut, PlusCircle, ListOrdered,
  Shield, LibraryBig, AlertCircle,
  ChevronLeft, ChevronRight,
  Search, Bell, Settings
} from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { role, isLoading } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const baseItems = [
    { to: '/dashboard', icon: <Home size={20} />, label: 'Overview', exact: true },
    { to: '/dashboard/my-orders', icon: <ShoppingCart size={20} />, label: 'My Orders' },
    { to: '/dashboard/my-profile', icon: <User size={20} />, label: 'My Profile' },
    { to: '/dashboard/wishlist', icon: <Heart size={20} />, label: 'Wishlist' },
    { to: '/dashboard/invoices', icon: <FileText size={20} />, label: 'Invoices' },
  ];

  const librarianItems = [
    { to: '/dashboard/add-book', icon: <PlusCircle size={20} />, label: 'Add Book' },
    { to: '/dashboard/my-books', icon: <LibraryBig size={20} />, label: 'My Books' },
    { to: '/dashboard/orders', icon: <ListOrdered size={20} />, label: 'Manage Orders' },
  ];

  const adminItems = [
    { to: '/dashboard/all-users', icon: <Users size={20} />, label: 'All Users' },
    { to: '/dashboard/manage-books', icon: <BookOpen size={20} />, label: 'Manage Books' },
    { to: '/dashboard/stats', icon: <BarChart size={20} />, label: 'Statistics' },
    { to: '/dashboard/system', icon: <Shield size={20} />, label: 'System Settings' },
  ];

  const navItems = role === 'admin'
    ? [...baseItems, ...adminItems]
    : role === 'librarian'
      ? [...baseItems, ...librarianItems]
      : baseItems;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Get current page title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    const allItems = [...baseItems, ...librarianItems, ...adminItems];
    const currentItem = allItems.find(item => item.to === path);
    return currentItem?.label || 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-base-100">

      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - Enhanced Design */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-base-200 to-base-300/50 border-r border-base-300/50
        transition-all duration-300 ease-in-out shadow-xl
        ${sidebarOpen ? 'w-72' : 'w-20'}
        md:relative
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full backdrop-blur-sm">

          {/* SIDEBAR HEADER - Enhanced */}
          <div className="h-20 flex items-center justify-between px-4 border-b border-base-300/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                BC
              </div>
              {sidebarOpen && (
                <div>
                  <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    BookCenter
                  </span>
                  <p className="text-xs text-base-content/50 mt-0.5">Dashboard</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-circle btn-ghost btn-xs hidden md:flex hover:bg-base-300/50"
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* USER PROFILE - Added to sidebar */}
          {sidebarOpen && (
            <div className="px-4 py-3 border-b border-base-300/30">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-base-100/50">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-200">
                    <img src={user?.photoURL || '/default-avatar.png'} alt={user?.displayName} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user?.displayName}</p>
                  <p className="text-xs text-base-content/50 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* NAV - Enhanced */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <div className="px-2 py-2">
              {sidebarOpen && <h3 className="text-xs uppercase tracking-wider text-base-content/40 font-semibold mb-2">Navigation</h3>}
            </div>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-xl transition-all duration-200 group
                   ${sidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-3 my-0.5
                   ${isActive 
                    ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-l-4 border-primary' 
                    : 'hover:bg-base-300/30 hover:translate-x-1'}`
                }
              >
                <div className={`${sidebarOpen ? '' : 'tooltip tooltip-right'} flex-shrink-0`} data-tip={!sidebarOpen && item.label}>
                  <div className={`
                    p-1.5 rounded-lg transition-all duration-200
                    ${sidebarOpen ? 'group-hover:scale-110' : ''}
                    ${location.pathname === item.to 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-base-content/60 group-hover:text-base-content'
                    }
                  `}>
                    {item.icon}
                  </div>
                </div>
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {location.pathname === item.to && (
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* SIDEBAR FOOTER - Enhanced */}
          <div className="p-4 border-t border-base-300/50 space-y-3 bg-base-200/30">
            {sidebarOpen && (
              <div className="flex items-center justify-between px-1">
                <span className="text-sm text-base-content/60">Appearance</span>
                <ThemeToggle />
              </div>
            )}
            <button 
              onClick={handleLogout} 
              className="btn btn-outline btn-error btn-sm w-full hover:scale-[1.02] transition-transform"
            >
              <LogOut size={16} />
              {sidebarOpen && <span className="ml-2">Logout</span>}
            </button>
            {sidebarOpen && (
              <p className="text-center text-xs text-base-content/40 pt-2">
                v2.1.0 • {new Date().getFullYear()}
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>

        {/* HEADER - Enhanced with better design */}
        <header className={`
          sticky top-0 z-40 bg-base-100/80 backdrop-blur-lg border-b border-base-300/50
          transition-all duration-300
          ${scrolled ? 'shadow-sm' : ''}
        `}>
          <div className="h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileSidebarOpen(true)} 
                className="btn btn-circle btn-ghost btn-sm md:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  {getPageTitle()}
                  {role === 'admin' && (
                    <span className="badge badge-primary badge-xs">Admin</span>
                  )}
                  {role === 'librarian' && (
                    <span className="badge badge-secondary badge-xs">Librarian</span>
                  )}
                </h1>
                <p className="text-sm text-base-content/50 mt-0.5">
                  Welcome back, <span className="font-medium text-primary">{user?.displayName?.split(' ')[0]}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="input input-sm input-bordered w-48 pl-9 pr-4"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
                </div>
              </div>
              
              {/* Notifications */}
              <button className="btn btn-circle btn-ghost btn-sm relative">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-error-content text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* Settings */}
              <button className="btn btn-circle btn-ghost btn-sm">
                <Settings size={18} />
              </button>
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* User Avatar - Desktop */}
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-base-300">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.displayName?.split(' ')[0]}</p>
                  <p className="text-xs text-base-content/50">{role}</p>
                </div>
                <div className="avatar">
                  <div className="w-9 h-9 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
                    <img src={user?.photoURL || '/default-avatar.png'} alt="avatar" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* BREADCRUMB - Enhanced */}
        <div className="px-6 py-4 bg-base-100/50 border-b border-base-300/30">
          <div className="text-sm breadcrumbs flex items-center gap-2">
            <ul className="flex items-center gap-2">
              <li>
                <Link to="/" className="text-base-content/60 hover:text-primary transition-colors">
                  <Home size={14} className="inline mr-1" />
                  Home
                </Link>
              </li>
              <li>
                <span className="text-base-content/30">
                  <ChevronRight size={14} className="inline" />
                </span>
              </li>
              <li>
                <Link to="/dashboard" className="text-base-content/60 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="text-base-content/30">
                  <ChevronRight size={14} className="inline" />
                </span>
              </li>
              <li className="text-primary font-medium">{getPageTitle()}</li>
            </ul>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="px-6 py-8 pb-24 min-h-[calc(100vh-12rem)]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* FOOTER */}
        <footer className="px-6 py-4 border-t border-base-300/30 bg-base-100/50">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-base-content/50">
            <div>
              © {new Date().getFullYear()} BookCenter. All rights reserved.
            </div>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/help" className="hover:text-primary transition-colors">Help Center</Link>
            </div>
          </div>
        </footer>
      </div>

      {/* MOBILE BOTTOM NAV SAFE AREA - Enhanced */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-base-100 to-base-100/95 border-t border-base-300/50 backdrop-blur-lg" />
      
      {/* FLOATING ACTION BUTTON FOR MOBILE */}
      <button 
        onClick={() => navigate('/dashboard/add-book')}
        className="md:hidden fixed bottom-20 right-6 btn btn-circle btn-primary shadow-lg z-30"
      >
        <PlusCircle size={24} />
      </button>
    </div>
  );
}