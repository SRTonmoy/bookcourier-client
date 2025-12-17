// pages/Dashboard/admin/AdminProfile.jsx
import React from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import { useRole } from '../../../hooks/useRole';

export default function AdminProfile() {
  const { role } = useRole();
  
  if (role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="p-8 text-error text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p>Admin access required.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>
        <div className="card bg-base-200 p-6">
          <p>Admin profile management coming soon!</p>
        </div>
      </div>
    </DashboardLayout>
  );
}