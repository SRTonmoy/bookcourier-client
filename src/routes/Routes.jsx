// routes/Routes.jsx - UPDATED
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import MainLayout from '../layout/MainLayout';
import DashboardLayout from '../layout/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import ThemePreview from '../components/ThemePreview';
import Stats from '../pages/Dashboard/user/Stats';
import SystemSettings from '../pages/Dashboard/user/SystemSettings';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home/Home'));
const AllBooks = lazy(() => import('../pages/Books/AllBooks'));
const BookDetails = lazy(() => import('../pages/Books/BookDetails'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const NotFound = lazy(() => import('../pages/Error/NotFound'));
const PaymentPage = lazy(() => import('../pages/Payment/PaymentPage'));

// User Dashboard
const MyOrders = lazy(() => import('../pages/Dashboard/user/MyOrders'));
const MyProfile = lazy(() => import('../pages/Dashboard/user/MyProfile'));
const MyWishlist = lazy(() => import('../pages/Dashboard/user/MyWishlist'));
const MyInvoices = lazy(() => import('../pages/Dashboard/user/MyInvoices'));

// Librarian Dashboard
const AddBook = lazy(() => import('../pages/Dashboard/librarian/AddBook'));
const MyBooks = lazy(() => import('../pages/Dashboard/librarian/MyBooks'));
const EditBook = lazy(() => import('../pages/Dashboard/librarian/EditBook'));
const LibrarianOrders = lazy(() => import('../pages/Dashboard/librarian/LibrarianOrders'));

// Admin Dashboard
const AllUsers = lazy(() => import('../pages/Dashboard/admin/AllUsers'));
const ManageBooks = lazy(() => import('../pages/Dashboard/admin/ManageBooks'));
const AdminProfile = lazy(() => import('../pages/Dashboard/admin/AdminProfile'));

// Loading component
const DashboardLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="mt-4 text-muted">Loading dashboard...</p>
    </div>
  </div>
);


export default function RoutesApp() {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useRole();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
    <Suspense fallback={<DashboardLoading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/books" element={<MainLayout><AllBooks /></MainLayout>} />
        <Route path="/books/:id" element={<MainLayout><BookDetails /></MainLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment/:orderId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardLayout /> {/* NO MainLayout wrapper! */}
  </ProtectedRoute>
}>
          {/* Default redirect based on role */}
          <Route index element={
            role === 'admin' ? <Navigate to="/dashboard/all-users" replace /> :
            role === 'librarian' ? <Navigate to="/dashboard/my-books" replace /> :
            <Navigate to="/dashboard/my-orders" replace />
          } />
          
          {/* User Routes (accessible by all logged-in users) */}
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="wishlist" element={<MyWishlist />} />
          <Route path="invoices" element={<MyInvoices />} />
          
          {/* Librarian Routes */}
          {role === 'librarian' || role === 'admin' ? (
            <>
              <Route path="add-book" element={<AddBook />} />
              <Route path="my-books" element={<MyBooks />} />
              <Route path="edit-book/:id" element={<EditBook />} />
              <Route path="orders" element={<LibrarianOrders />} />
            </>
          ) : null}
          
          {/* Admin Routes */}
          {role === 'admin' ? (
            <>
              <Route path="all-users" element={<AllUsers />} />
              <Route path="manage-books" element={<ManageBooks />} />
              <Route path="admin-profile" element={<AdminProfile />} />
              <Route path="stats" element={<Stats/>} />
              <Route path="system" element={<SystemSettings />} />
            </>
          ) : null}
        </Route>

        {/* 404 */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </Suspense>
    {process.env.NODE_ENV === 'development' && <ThemePreview />} </>
  );
}