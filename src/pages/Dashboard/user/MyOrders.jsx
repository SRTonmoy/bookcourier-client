import React, { useEffect, useState } from 'react';
import axiosSecure from '../../../api/axiosSecure';
import { useAuth } from '../../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, Clock, CheckCircle, XCircle, 
  DollarSign, Truck, RefreshCw, Eye,
  BarChart3, PieChart, TrendingUp, Calendar,
  Download, Filter
} from 'lucide-react';
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
  RadialBarChart, RadialBar, ComposedChart
} from 'recharts';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Chart states
  const [chartData, setChartData] = useState({
    monthlySpending: [],
    statusDistribution: [],
    paymentDistribution: [],
    timelineData: []
  });
  const [activeChart, setActiveChart] = useState('bar'); // 'bar', 'pie', 'line', 'radial'
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year', 'all'

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      prepareChartData();
    }
  }, [orders, timeRange]);

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

  const prepareChartData = () => {
    // Prepare monthly spending data
    const monthlyData = prepareMonthlySpending();
    
    // Prepare status distribution
    const statusData = prepareStatusDistribution();
    
    // Prepare payment distribution
    const paymentData = preparePaymentDistribution();
    
    // Prepare timeline data
    const timelineData = prepareTimelineData();
    
    setChartData({
      monthlySpending: monthlyData,
      statusDistribution: statusData,
      paymentDistribution: paymentData,
      timelineData
    });
  };

  const prepareMonthlySpending = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === index && orderDate.getFullYear() === currentYear;
      });
      
      const totalSpent = monthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const avgOrderValue = monthOrders.length > 0 ? totalSpent / monthOrders.length : 0;
      
      return {
        month,
        total: totalSpent,
        orders: monthOrders.length,
        average: avgOrderValue
      };
    }).slice(0, 6); // Last 6 months
  };

  const prepareStatusDistribution = () => {
    const statusCounts = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    const statusColors = {
      'pending': '#f59e0b',
      'processing': '#3b82f6',
      'shipped': '#8b5cf6',
      'delivered': '#10b981',
      'cancelled': '#ef4444'
    };
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: statusColors[status] || '#6b7280'
    }));
  };

  const preparePaymentDistribution = () => {
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
    const unpaidOrders = orders.filter(o => o.paymentStatus !== 'paid').length;
    
    return [
      { name: 'Paid', value: paidOrders, color: '#10b981' },
      { name: 'Unpaid', value: unpaidOrders, color: '#f59e0b' }
    ];
  };

  const prepareTimelineData = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dateISO = date.toISOString().split('T')[0];
      
      const dayOrders = orders.filter(order => 
        new Date(order.orderDate).toISOString().split('T')[0] === dateISO
      );
      
      const daySpending = dayOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const dayCount = dayOrders.length;
      
      last30Days.push({
        date: dateStr,
        orders: dayCount,
        spending: daySpending,
        avg: dayCount > 0 ? daySpending / dayCount : 0
      });
    }
    
    return last30Days;
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

  // Custom Tooltip Component
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
            Track and manage your book orders with visual insights
          </p>
        </div>

        <div className="flex gap-3">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-outline btn-sm gap-2">
              <Download size={16} />
              Export
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Export as CSV</a></li>
              <li><a>Export as PDF</a></li>
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

      {/* Charts Section */}
      <div className="space-y-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="text-primary" size={24} />
              Order Analytics
            </h3>
            <p className="text-sm text-muted">Visual insights into your order history</p>
          </div>
          
          <div className="flex gap-2">
            <div className="tabs tabs-boxed">
              <button 
                className={`tab ${activeChart === 'bar' ? 'tab-active' : ''}`}
                onClick={() => setActiveChart('bar')}
              >
                <BarChart3 size={16} />
                Bar
              </button>
              <button 
                className={`tab ${activeChart === 'pie' ? 'tab-active' : ''}`}
                onClick={() => setActiveChart('pie')}
              >
                <PieChart size={16} />
                Pie
              </button>
              <button 
                className={`tab ${activeChart === 'line' ? 'tab-active' : ''}`}
                onClick={() => setActiveChart('line')}
              >
                <TrendingUp size={16} />
                Line
              </button>
            </div>
            
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-sm btn-outline gap-2">
                <Filter size={16} />
                Filter
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => setTimeRange('week')}>Last Week</a></li>
                <li><a onClick={() => setTimeRange('month')}>Last Month</a></li>
                <li><a onClick={() => setTimeRange('year')}>Last Year</a></li>
                <li><a onClick={() => setTimeRange('all')}>All Time</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Chart */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="h-80">
                {activeChart === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.monthlySpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="total" name="Total Spending ($)" fill="#3b82f6" />
                      <Bar dataKey="orders" name="Number of Orders" fill="#8b5cf6" />
                    </BarChart>
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
                
                {activeChart === 'line' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="spending" 
                        name="Daily Spending ($)" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="orders" 
                        name="Daily Orders" 
                        stroke="#8b5cf6" 
                        fill="#8b5cf6" 
                        fillOpacity={0.3} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Additional Stats Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Status Chart */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <DollarSign size={18} />
                  Payment Status
                </h4>
                <div className="h-48">
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
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Calendar size={18} />
                  Recent Activity
                </h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.timelineData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        name="Orders per day" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
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