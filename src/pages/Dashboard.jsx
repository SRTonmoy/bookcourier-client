import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import MyOrders from './dashboard/MyOrders';
import MyProfile from './dashboard/MyProfile';

export default function Dashboard(){
  const { user } = useAuth();

  return (
    <div className="min-h-[70vh] p-6">
      <div className="drawer drawer-mobile">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
          <Routes>
            <Route path="/" element={<MyOrders/>} />
            <Route path="/profile" element={<MyProfile/>} />
          </Routes>
        </div>
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-200">
            <li><Link to="/dashboard">My Orders</Link></li>
            <li><Link to="/dashboard/profile">My Profile</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
