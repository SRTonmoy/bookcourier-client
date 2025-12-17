// routes/dashboardRoutes.js
import { lazy } from 'react';

// User routes
const MyOrders = lazy(() => import('../pages/Dashboard/user/MyOrders'));
const MyProfile = lazy(() => import('../pages/Dashboard/user/MyProfile'));
const MyWishlist = lazy(() => import('../pages/Dashboard/user/MyWishlist'));
const MyInvoices = lazy(() => import('../pages/Dashboard/user/MyInvoices'));

// Librarian routes
const AddBook = lazy(() => import('../pages/Dashboard/librarian/AddBook'));
const MyBooks = lazy(() => import('../pages/Dashboard/librarian/MyBooks'));
const EditBook = lazy(() => import('../pages/Dashboard/librarian/EditBook'));
const LibrarianOrders = lazy(() => import('../pages/Dashboard/librarian/LibrarianOrders'));

// Admin routes
const AllUsers = lazy(() => import('../pages/Dashboard/admin/AllUsers'));
const ManageBooks = lazy(() => import('../pages/Dashboard/admin/ManageBooks'));
const AdminProfile = lazy(() => import('../pages/Dashboard/admin/AdminProfile'));

export const userRoutes = [
  { path: 'my-orders', element: <MyOrders /> },
  { path: 'my-profile', element: <MyProfile /> },
  { path: 'wishlist', element: <MyWishlist /> },
  { path: 'invoices', element: <MyInvoices /> }
];

export const librarianRoutes = [
  { path: 'add-book', element: <AddBook /> },
  { path: 'my-books', element: <MyBooks /> },
  { path: 'edit-book/:id', element: <EditBook /> },
  { path: 'orders', element: <LibrarianOrders /> },
  ...userRoutes // Librarians also have user routes
];

export const adminRoutes = [
  { path: 'all-users', element: <AllUsers /> },
  { path: 'manage-books', element: <ManageBooks /> },
  { path: 'admin-profile', element: <AdminProfile /> },
  ...userRoutes // Admins also have user routes
];