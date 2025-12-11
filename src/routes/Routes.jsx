import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import AllBooks from '../pages/Books/AllBooks'
import BookDetails from '../pages/Books/BookDetails'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import NotFound from '../pages/Error/NotFound'
import DashboardLayout from '../layout/DashboardLayout'
import MyOrders from '../pages/Dashboard/user/MyOrders'
import MyProfile from '../pages/Dashboard/user/MyProfile'
import ProtectedRoute from '../components/ProtectedRoute'

export default function RoutesApp(){
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<AllBooks />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<MyOrders />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="my-profile" element={<MyProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}