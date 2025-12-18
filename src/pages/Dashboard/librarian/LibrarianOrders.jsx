// pages/Dashboard/librarian/LibrarianOrders.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import axiosSecure from '../../../api/axiosSecure';
import { useRole } from '../../../hooks/useRole';
import { useAuth } from '../../../hooks/useAuth';

export default function LibrarianOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useRole();
  const { user } = useAuth();

  useEffect(() => {
    if (role === 'librarian') {
      fetchOrders();
    }
  }, [role]);

  const fetchOrders = async () => {
  try {
    const { data } = await axiosSecure.get('/orders/librarian/my');
   
    
    setOrders(data.orders); 
  } catch (error) {
    
  } finally {
    setLoading(false);
  }
};


  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosSecure.patch(`/orders/${orderId}/status`, { status: newStatus });
      alert(`Order status updated to ${newStatus}`);
      fetchOrders(); 
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order status');
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await axiosSecure.patch(`/orders/${orderId}/cancel`);
      alert('Order cancelled');
      fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order');
    }
  };

  if (loading) return <div className="p-8">Loading orders...</div>;
  if (role !== 'librarian') return <div className="p-8 text-error">Access denied. Librarian only.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Orders ({orders.length})</h2>
        <button onClick={fetchOrders} className="btn btn-sm btn-outline">
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          <span>No orders found for your books.</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Order ID</th>
                <th>Book</th>
                <th>Customer</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-base-300">
                  <td className="font-mono text-sm">{order._id?.slice(-6)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <img 
                        src={order.bookImage || '/book-placeholder.png'} 
                        alt={order.bookName}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className="font-medium">{order.bookName}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium">{order.userName}</p>
                      <p className="text-sm text-muted">{order.userEmail}</p>
                      <p className="text-xs">{order.phone}</p>
                    </div>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <select 
                      className={`select select-bordered select-xs ${order.status === 'pending' ? 'text-warning' : order.status === 'shipped' ? 'text-info' : 'text-success'}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="font-bold">${order.amount}</td>
                  <td>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => cancelOrder(order._id)}
                          className="btn btn-xs btn-error"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}