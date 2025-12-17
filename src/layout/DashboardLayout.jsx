// layout/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import ThemeToggle from '../components/ThemeToggle';
import { 
  Menu, X, Home, BookOpen, ShoppingCart, User, 
  FileText, Heart, Users, BarChart, Package,
  LogOut, Settings, PlusCircle, Edit, ListOrdered,
  Shield, LibraryBig, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { role, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();

  // Close mobile sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Navigation based on role
  const getNavItems = () => {
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
    ];

    if (role === 'admin') {
      return [...baseItems, ...adminItems];
    } else if (role === 'librarian') {
      return [...baseItems, ...librarianItems];
    }
    return baseItems;
  };

  const navItems = getNavItems();

  // Role display with color
  const getRoleBadge = () => {
    const colors = {
      admin: 'badge-error',
      librarian: 'badge-secondary',
      user: 'badge-primary'
    };
    
    const roleText = role === 'admin' ? 'Administrator' : 
                    role === 'librarian' ? 'Librarian' : 'User';
    
    return (
      <span className={`badge ${colors[role] || 'badge-primary'} badge-sm`}>
        {roleText}
      </span>
    );
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-base-200 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">BC</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">Dashboard</h2>
                  <p className="text-xs text-muted">BookCourier</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setMobileSidebarOpen(false);
                  } else {
                    setSidebarOpen(false);
                  }
                }}
                className="btn btn-ghost btn-circle btn-sm"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            {/* User Profile */}
            <div className="mt-6 p-3 bg-base-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                    <img 
                      src={user?.photoURL || '/default-avatar.png'} 
                      alt={user?.displayName || 'User'}
                      className="object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {user?.displayName || 'User'}
                  </h3>
                  <p className="text-sm text-muted truncate">
                    {user?.email}
                  </p>
                  <div className="mt-1">
                    {getRoleBadge()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink 
                    to={item.to}
                    end={item.exact}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                      ${isActive 
                        ? 'bg-primary text-primary-content shadow-md' 
                        : 'hover:bg-base-300 text-base-content'
                      }
                    `}
                  >
                    <span className="flex-shrink-0">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="my-6 border-t border-base-300"></div>

            {/* Quick Links */}
            <div className="px-3">
              <p className="text-sm font-semibold text-muted mb-2">Quick Links</p>
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/books" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <BookOpen size={18} />
                    <span>All Books</span>
                  </Link>
                </li>
                {role === 'librarian' || role === 'admin' ? (
                  <li>
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-accent" />
                        <span className="text-sm font-medium text-accent">Staff Panel</span>
                      </div>
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-base-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Theme</span>
                <ThemeToggle />
              </div>
              
              <button 
                onClick={handleLogout}
                className="btn btn-outline btn-error btn-sm w-full"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
              
              <div className="text-xs text-center text-muted pt-2">
                <p>BookCourier v1.0</p>
                <p>© {new Date().getFullYear()} All rights reserved</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${sidebarOpen ? 'md:ml-64' : ''}
      `}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-base-100 border-b border-base-300 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left: Sidebar Toggle */}
            <div className="flex items-center gap-4">
              {!sidebarOpen ? (
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="btn btn-ghost btn-circle btn-sm hidden md:flex"
                >
                  <ChevronRight size={20} />
                </button>
              ) : null}
              
              <button 
                onClick={() => setMobileSidebarOpen(true)}
                className="btn btn-ghost btn-circle btn-sm md:hidden"
              >
                <Menu size={20} />
              </button>
              
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-sm text-muted">
                  Manage your books, orders, and account
                </p>
              </div>
            </div>

            {/* Right: Actions & Theme */}
            <div className="flex items-center gap-4">
              {/* Notifications (Placeholder) */}
              <div className="dropdown dropdown-end">
                <div 
                  tabIndex={0} 
                  className="btn btn-ghost btn-circle btn-sm"
                  role="button"
                >
                  <div className="indicator">
                    <AlertCircle size={20} />
                    <span className="badge badge-xs badge-primary indicator-item"></span>
                  </div>
                </div>
                <ul 
                  tabIndex={0} 
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2"
                >
                  <li className="px-4 py-2 border-b">
                    <span className="font-semibold">Notifications</span>
                  </li>
                  <li>
                    <a className="py-3">
                      <div className="text-sm">No new notifications</div>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Avatar (Desktop) */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-muted">{getRoleBadge()}</p>
                </div>
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                    <img 
                      src={user?.photoURL || '/default-avatar.png'} 
                      alt={user?.displayName || 'User'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumb (Optional) */}
        <div className="px-6 py-3 bg-base-200 border-b border-base-300">
          <div className="text-sm breadcrumbs">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-140px)] p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-base-300 bg-base-200">
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted">
                <p>
                  © {new Date().getFullYear()} BookCourier. 
                  <span className="hidden md:inline"> All rights reserved.</span>
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <Link to="/privacy" className="text-sm link link-hover">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-sm link link-hover">
                  Terms of Service
                </Link>
                <Link to="/help" className="text-sm link link-hover">
                  Help Center
                </Link>
              </div>
              
              <div className="text-sm text-muted">
                <span className="hidden md:inline">Server Status: </span>
                <span className="badge badge-success badge-sm">Online</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation (for small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-30">
        <div className="flex justify-around items-center py-2">
          <Link 
            to="/dashboard" 
            className="flex flex-col items-center p-2"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/dashboard/my-orders" 
            className="flex flex-col items-center p-2"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <ShoppingCart size={20} />
            <span className="text-xs mt-1">Orders</span>
          </Link>
          
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="flex flex-col items-center p-2"
          >
            <Menu size={20} />
            <span className="text-xs mt-1">Menu</span>
          </button>
          
          <Link 
            to="/dashboard/my-profile" 
            className="flex flex-col items-center p-2"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center p-2 text-error"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}