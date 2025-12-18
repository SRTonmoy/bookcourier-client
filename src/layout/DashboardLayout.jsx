import React, { useState, useEffect } from 'react';
import { Link, Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import ThemeToggle from '../components/ThemeToggle';
import {
  Menu, Home, BookOpen, ShoppingCart, User,
  FileText, Heart, Users, BarChart,
  LogOut, PlusCircle, ListOrdered,
  Shield, LibraryBig, ChevronLeft, ChevronRight,
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

  /* ------------------ EFFECTS ------------------ */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileSidebarOpen(false);
    };
    const onScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : 'auto';
  }, [mobileSidebarOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  /* ------------------ NAV ITEMS ------------------ */
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

  const navItems =
    role === 'admin'
      ? [...baseItems, ...adminItems]
      : role === 'librarian'
      ? [...baseItems, ...librarianItems]
      : baseItems;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const getPageTitle = () => {
    const all = [...baseItems, ...librarianItems, ...adminItems];
    return all.find(i => i.to === location.pathname)?.label || 'Dashboard';
  };

  /* ------------------ JSX ------------------ */
  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background-dashbaord.jpg')" }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35 z-0" />

      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-gradient-to-b from-base-200/80 to-base-300/50
          border-r border-base-300/50 shadow-xl
          transition-all duration-300
          w-72
          ${sidebarOpen ? 'md:w-72' : 'md:w-20'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">

          {/* HEADER */}
          <div className="h-20 flex items-center justify-between px-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">
                BC
              </div>
              {sidebarOpen && (
                <div>
                  <p className="font-bold">BookCenter</p>
                  <p className="text-xs opacity-60">Dashboard</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-circle btn-ghost btn-xs hidden md:flex"
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* NAV */}
          <nav className="flex-1 p-3 overflow-y-auto">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition
                   ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-base-300/40'}`
                }
              >
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* FOOTER */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-error btn-sm w-full"
            >
              <LogOut size={16} />
              {sidebarOpen && <span className="ml-2">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div
        className={`
          flex-1 transition-all duration-300 relative
          ml-0
          ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}
        `}
      >
        {/* HEADER */}
        <header className={`sticky top-0 z-40 bg-base-100/80 backdrop-blur border-b ${scrolled ? 'shadow-sm' : ''}`}>
          <div className="h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="btn btn-ghost btn-sm md:hidden"
              >
                <Menu />
              </button>

              {/* Home button */}
              <button
                onClick={() => navigate('/')}
                className="btn btn-ghost btn-sm flex items-center gap-1"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Home</span>
              </button>

              <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* SEARCH */}
              <div className="hidden md:flex relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                <input className="input input-sm pl-9" placeholder="Search" />
              </div>

              {/* NOTIFICATION */}
              <button className="btn btn-circle btn-ghost btn-sm">
                <Bell size={18} />
              </button>

              {/* SETTINGS + THEME */}
              <div className="hidden sm:flex items-center gap-2">
                <button className="btn btn-circle btn-ghost btn-sm">
                  <Settings size={18} />
                </button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="px-6 py-8 min-h-[calc(100vh-4rem)] bg-white/10 backdrop-blur rounded-lg m-4">
          <Outlet />
        </main>
      </div>

      {/* FAB – ROLE BASED */}
      {(role === 'admin' || role === 'librarian') && (
        <button
          onClick={() => navigate('/dashboard/add-book')}
          className="md:hidden fixed bottom-20 right-6 btn btn-circle btn-primary shadow-lg"
        >
          <PlusCircle size={24} />
        </button>
      )}
    </div>
  );
}
