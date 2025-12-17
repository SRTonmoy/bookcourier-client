// pages/Dashboard/user/MyInvoices.jsx
import React from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';

export default function MyInvoices() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">My Invoices</h2>
        <div className="alert alert-info">
          <span>Invoice feature coming soon!</span>
        </div>
      </div>
    </DashboardLayout>
  );
}