import MyOrders from "../pages/Dashboard/user/MyOrders";
import MyProfile from "../pages/Dashboard/user/MyProfile";
import MyWishlist from "../pages/Dashboard/user/MyWishlist";
import AddBook from "../pages/Dashboard/librarian/AddBook";
import MyBooks from "../pages/Dashboard/librarian/MyBooks";
import AllUsers from "../pages/Dashboard/admin/AllUsers";
import ManageBooks from "../pages/Dashboard/admin/ManageBooks";

// Always include paths relative to /dashboard
export const userRoutes = [
  { path: "", element: <MyOrders /> },
  { path: "profile", element: <MyProfile /> },
  { path: "wishlist", element: <MyWishlist /> },
];

export const librarianRoutes = [
  { path: "add-book", element: <AddBook /> },
  { path: "my-books", element: <MyBooks /> },
];

export const adminRoutes = [
  { path: "users", element: <AllUsers /> },
  { path: "manage-books", element: <ManageBooks /> },
];
