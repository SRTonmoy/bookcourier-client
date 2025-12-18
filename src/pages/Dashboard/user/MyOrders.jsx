import React, { useEffect, useState } from 'react';
import axiosSecure from '../../../api/axiosSecure';
import { useAuth } from '../../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom'; // Fixed import
import { 
  Package, Clock, CheckCircle, XCircle, 
  DollarSign, Truck, RefreshCw, Eye
} from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate(); // ADDED THIS LINE - Call the hook!

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosSecure.get('/orders/my');
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'error', 
          message: 'Failed to load orders' 
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      setCancellingOrder(orderId);
      await axiosSecure.patch(`/orders/${orderId}/cancel`);
      
      setOrders(prev => prev.map(order => 
        order._id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      ));
      
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'success', 
          message: 'Order cancelled successfully' 
        }
      }));
    } catch (error) {
      console.error('Cancel order error:', error);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'error', 
          message: error.response?.data?.message || 'Failed to cancel order' 
        }
      }));
    } finally {
      setCancellingOrder(null);
    }
  };

  const handlePayNow = (order) => {
   
    
    // Navigate to payment page with the order ID
    navigate(`/payment/${order._id}`);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="text-warning" size={20} />;
      case 'processing': return <RefreshCw className="text-info" size={20} />;
      case 'shipped': return <Truck className="text-primary" size={20} />;
      case 'delivered': return <CheckCircle className="text-success" size={20} />;
      case 'cancelled': return <XCircle className="text-error" size={20} />;
      default: return <Package className="text-muted" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'badge-warning';
      case 'processing': return 'badge-info';
      case 'shipped': return 'badge-primary';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-error';
      default: return 'badge-outline';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    return paymentStatus === 'paid' ? 'badge-success' : 'badge-warning';
  };

  if (loading && orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-muted">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Package size={28} />
            My Orders
          </h2>
          <p className="text-muted mt-1">
            Track and manage your book orders
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={fetchOrders}
            className="btn btn-outline btn-sm gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link to="/books" className="btn btn-primary btn-sm gap-2">
            <Package size={16} />
            Order New Book
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Package size={24} />
            </div>
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-desc">All time</div>
          </div>
        </div>
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <DollarSign size={24} />
            </div>
            <div className="stat-title">Total Spent</div>
            <div className="stat-value">
              ${orders.reduce((sum, order) => sum + (order.amount || 0), 0).toFixed(2)}
            </div>
            <div className="stat-desc">On books</div>
          </div>
        </div>
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-success">
              <CheckCircle size={24} />
            </div>
            <div className="stat-title">Delivered</div>
            <div className="stat-value">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="stat-desc">Completed orders</div>
          </div>
        </div>
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-warning">
              <Clock size={24} />
            </div>
            <div className="stat-title">Pending</div>
            <div className="stat-value">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="stat-desc">Awaiting processing</div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body items-center text-center py-12">
            <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center mb-6">
              <Package size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No orders yet</h3>
            <p className="text-muted mb-6 max-w-md">
              You haven't placed any orders yet. Browse our collection and order your first book!
            </p>
            <Link to="/books" className="btn btn-primary gap-2">
              <Package size={18} />
              Browse Books
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-lg">
          <table className="table">
            <thead>
              <tr className="bg-base-200">
                <th>Order ID</th>
                <th>Book</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-base-300">
                  <td>
                    <div className="font-mono text-sm">
                      #{order._id?.slice(-6).toUpperCase()}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <img 
                        src={order.bookImage || '/book-placeholder.png'} 
                        alt={order.bookName}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{order.bookName}</div>
                        <div className="text-sm text-muted">{order.bookAuthor}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(order.orderDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="font-bold">${order.amount?.toFixed(2)}</td>
                  <td>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="btn btn-error btn-xs gap-1"
                          disabled={cancellingOrder === order._id}
                        >
                          {cancellingOrder === order._id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            'Cancel'
                          )}
                        </button>
                      )}
                      
                      {order.paymentStatus === 'unpaid' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => handlePayNow(order)}
                          className="btn btn-primary btn-xs gap-1"
                        >
                          <DollarSign size={12} />
                          Pay Now
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('show-toast', {
                            detail: { 
                              type: 'info', 
                              message: 'Order details view coming soon!' 
                            }
                          }));
                        }}
                        className="btn btn-outline btn-xs gap-1"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Status Legend */}
      <div className="mt-8 p-4 bg-base-200 rounded-lg">
        <h4 className="font-bold mb-3">Order Status Guide</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-sm">Pending - Order received</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-info"></div>
            <span className="text-sm">Processing - Preparing order</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm">Shipped - On the way</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-sm">Delivered - Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-error"></div>
            <span className="text-sm">Cancelled - Order cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
}