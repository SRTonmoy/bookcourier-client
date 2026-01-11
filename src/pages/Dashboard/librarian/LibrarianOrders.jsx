// pages/Dashboard/librarian/LibrarianOrders.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import axiosSecure from '../../../api/axiosSecure';
import { useRole } from '../../../hooks/useRole';
import { useAuth } from '../../../hooks/useAuth';
import {
  Package, Truck, CheckCircle, Clock, XCircle,
  DollarSign, Users, BarChart3, PieChart, TrendingUp,
  Calendar, RefreshCw, Filter, Download, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
  ComposedChart, Scatter
} from 'recharts';

export default function LibrarianOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useRole();
  const { user } = useAuth();
  
  // Chart states
  const [chartData, setChartData] = useState({
    dailyOrders: [],
    statusDistribution: [],
    revenueByBook: [],
    paymentDistribution: [],
    monthlyRevenue: []
  });
  const [activeChart, setActiveChart] = useState('bar'); // 'bar', 'line', 'pie', 'revenue'
  const [timeFilter, setTimeFilter] = useState('week'); // 'day', 'week', 'month', 'all'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'shipped', 'delivered'
  const [selectedBook, setSelectedBook] = useState('all'); // 'all' or specific book ID

  useEffect(() => {
    if (role === 'librarian') {
      fetchOrders();
    }
  }, [role]);

  useEffect(() => {
    if (orders.length > 0) {
      prepareChartData();
    }
  }, [orders, timeFilter, statusFilter, selectedBook]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosSecure.get('/orders/librarian/my');
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

  const prepareChartData = () => {
    // Filter orders based on current filters
    const filteredOrders = orders.filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesBook = selectedBook === 'all' || order.bookId === selectedBook;
      return matchesStatus && matchesBook;
    });

    // Prepare daily orders data
    const dailyData = prepareDailyOrdersData(filteredOrders);
    
    // Prepare status distribution
    const statusData = prepareStatusDistribution(filteredOrders);
    
    // Prepare revenue by book
    const revenueData = prepareRevenueByBook(filteredOrders);
    
    // Prepare payment distribution
    const paymentData = preparePaymentDistribution(filteredOrders);
    
    // Prepare monthly revenue
    const monthlyData = prepareMonthlyRevenue(filteredOrders);

    setChartData({
      dailyOrders: dailyData,
      statusDistribution: statusData,
      revenueByBook: revenueData,
      paymentDistribution: paymentData,
      monthlyRevenue: monthlyData
    });
  };

  const prepareDailyOrdersData = (filteredOrders) => {
    const days = [];
    const today = new Date();
    
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateISO = date.toISOString().split('T')[0];
      
      const dayOrders = filteredOrders.filter(order => 
        new Date(order.orderDate).toISOString().split('T')[0] === dateISO
      );
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const dayCount = dayOrders.length;
      const pendingCount = dayOrders.filter(o => o.status === 'pending').length;
      const completedCount = dayOrders.filter(o => o.status === 'delivered').length;
      
      days.push({
        date: dateStr,
        orders: dayCount,
        revenue: dayRevenue,
        pending: pendingCount,
        completed: completedCount
      });
    }
    
    return days;
  };

  const prepareStatusDistribution = (filteredOrders) => {
    const statusCounts = {};
    filteredOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    const statusColors = {
      'pending': '#f59e0b',
      'shipped': '#3b82f6',
      'delivered': '#10b981',
      'cancelled': '#ef4444'
    };
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: statusColors[status] || '#6b7280'
    }));
  };

  const prepareRevenueByBook = (filteredOrders) => {
    const bookRevenue = {};
    filteredOrders.forEach(order => {
      const key = order.bookId;
      if (!bookRevenue[key]) {
        bookRevenue[key] = {
          name: order.bookName || `Book ${key.slice(-4)}`,
          revenue: 0,
          orders: 0
        };
      }
      bookRevenue[key].revenue += order.amount || 0;
      bookRevenue[key].orders += 1;
    });
    
    return Object.values(bookRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5 books
  };

  const preparePaymentDistribution = (filteredOrders) => {
    const paidCount = filteredOrders.filter(o => o.paymentStatus === 'paid').length;
    const unpaidCount = filteredOrders.filter(o => o.paymentStatus !== 'paid').length;
    
    return [
      { name: 'Paid', value: paidCount, color: '#10b981' },
      { name: 'Unpaid', value: unpaidCount, color: '#f59e0b' }
    ];
  };

  const prepareMonthlyRevenue = (filteredOrders) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === index && orderDate.getFullYear() === currentYear;
      });
      
      const revenue = monthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const ordersCount = monthOrders.length;
      const avgOrderValue = ordersCount > 0 ? revenue / ordersCount : 0;
      
      return {
        month,
        revenue,
        orders: ordersCount,
        average: avgOrderValue
      };
    }).slice(0, 6); // Last 6 months
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosSecure.patch(`/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'success', 
          message: `Order status updated to ${newStatus}` 
        }
      }));
    } catch (error) {
      console.error('Failed to update order:', error);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'error', 
          message: 'Failed to update order status' 
        }
      }));
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await axiosSecure.patch(`/orders/${orderId}/cancel`);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'success', 
          message: 'Order cancelled successfully' 
        }
      }));
    } catch (error) {
      console.error('Failed to cancel order:', error);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'error', 
          message: 'Failed to cancel order' 
        }
      }));
    }
  };

  // Get unique books for filter
  const uniqueBooks = Array.from(new Set(orders.map(order => order.bookId))).map(bookId => {
    const order = orders.find(o => o.bookId === bookId);
    return {
      id: bookId,
      name: order?.bookName || `Book ${bookId?.slice(-4)}`
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 border border-base-300 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: {entry.name.includes('$') ? `$${entry.value.toFixed(2)}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="p-8 text-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="mt-4 text-muted">Loading orders...</p>
    </div>
  );
  
  if (role !== 'librarian') return (
    <div className="p-8">
      <div className="alert alert-error shadow-lg">
        <AlertCircle size={24} />
        <div>
          <h3 className="font-bold">Access Denied</h3>
          <div className="text-sm">Librarian privileges required to view this page.</div>
        </div>
      </div>
    </div>
  );

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesBook = selectedBook === 'all' || order.bookId === selectedBook;
    return matchesStatus && matchesBook;
  });

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Package size={28} />
            Librarian Orders Dashboard
          </h2>
          <p className="text-muted mt-1">Manage and analyze orders for your books</p>
        </div>
        
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-outline btn-sm gap-2">
              <Download size={16} />
              Export
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Export Orders CSV</a></li>
              <li><a>Export Revenue Report</a></li>
              <li><a>Export Chart Data</a></li>
            </ul>
          </div>
          <button 
            onClick={fetchOrders}
            className="btn btn-outline btn-sm gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Loading...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Package size={24} />
            </div>
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">{filteredOrders.length}</div>
            <div className="stat-desc">Filtered orders</div>
          </div>
        </div>
        
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <DollarSign size={24} />
            </div>
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value">${totalRevenue.toFixed(2)}</div>
            <div className="stat-desc">${avgOrderValue.toFixed(2)} avg per order</div>
          </div>
        </div>
        
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-success">
              <CheckCircle size={24} />
            </div>
            <div className="stat-title">Delivered</div>
            <div className="stat-value">
              {filteredOrders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="stat-desc">Completed orders</div>
          </div>
        </div>
        
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-warning">
              <Clock size={24} />
            </div>
            <div className="stat-title">Pending</div>
            <div className="stat-value">
              {filteredOrders.filter(o => o.status === 'pending').length}
            </div>
            <div className="stat-desc">Awaiting processing</div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card bg-base-100 shadow">
        <div className="card-body py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Filter by Status</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Filter by Book</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
              >
                <option value="all">All Books</option>
                {uniqueBooks.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Time Range</span>
              </label>
              <div className="tabs tabs-boxed">
                <button 
                  className={`tab ${timeFilter === 'week' ? 'tab-active' : ''}`}
                  onClick={() => setTimeFilter('week')}
                >
                  Week
                </button>
                <button 
                  className={`tab ${timeFilter === 'month' ? 'tab-active' : ''}`}
                  onClick={() => setTimeFilter('month')}
                >
                  Month
                </button>
                <button 
                  className={`tab ${timeFilter === 'all' ? 'tab-active' : ''}`}
                  onClick={() => setTimeFilter('all')}
                >
                  All Time
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="text-primary" size={24} />
              Order Analytics
            </h3>
            <p className="text-sm text-muted">Visual insights into your book orders</p>
          </div>
          
          <div className="tabs tabs-boxed">
            <button 
              className={`tab ${activeChart === 'bar' ? 'tab-active' : ''}`}
              onClick={() => setActiveChart('bar')}
            >
              <BarChart3 size={16} />
              Daily
            </button>
            <button 
              className={`tab ${activeChart === 'line' ? 'tab-active' : ''}`}
              onClick={() => setActiveChart('line')}
            >
              <TrendingUp size={16} />
              Trends
            </button>
            <button 
              className={`tab ${activeChart === 'pie' ? 'tab-active' : ''}`}
              onClick={() => setActiveChart('pie')}
            >
              <PieChart size={16} />
              Distribution
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Chart */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="h-80">
                {activeChart === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData.dailyOrders}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#3b82f6" />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#8b5cf6" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
                
                {activeChart === 'line' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Monthly Revenue ($)" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        name="Orders" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                
                {activeChart === 'pie' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={chartData.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Additional Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue by Book */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <DollarSign size={18} />
                  Top Books by Revenue
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.revenueByBook}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']} />
                      <Bar dataKey="revenue" name="Revenue ($)" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Payment Distribution */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle size={18} />
                  Payment Status
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={chartData.paymentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {chartData.paymentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Package size={48} className="text-base-300 mb-4" />
                        <p className="text-muted">No orders found matching your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
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
                        <select 
                          className={`select select-bordered select-xs ${
                            order.status === 'pending' ? 'select-warning' : 
                            order.status === 'shipped' ? 'select-info' : 
                            'select-success'
                          }`}
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          {order.status === 'cancelled' && (
                            <option value="cancelled">Cancelled</option>
                          )}
                        </select>
                      </td>
                      <td>
                        <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="font-bold">${order.amount?.toFixed(2)}</td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}