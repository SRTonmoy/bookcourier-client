// pages/Dashboard/admin/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../layout/DashboardLayout';
import { useRole } from '../../../hooks/useRole';
import axiosSecure from '../../../api/axiosSecure';
import axiosPublic from '../../../api/axiosPublic';
import { 
  Users, BookOpen, ShoppingBag, Shield, 
  TrendingUp, DollarSign, Clock, CheckCircle,
  AlertCircle, BarChart3, PieChart, TrendingDown,
  Calendar, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export default function DashboardOverview() {
  const { role } = useRole();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, admins: 0, librarians: 0, today: 0 },
    books: { total: 0, published: 0, unpublished: 0, newToday: 0 },
    orders: { total: 0, pending: 0, completed: 0, revenue: 0 },
    recentActivity: []
  });
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month'

  useEffect(() => {
    if (role === 'admin') {
      fetchDashboardData();
    }
  }, [role, timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch users data
      const usersRes = await axiosSecure.get('/users');
      const users = usersRes.data;
      
      // Fetch books data
      const booksRes = await axiosPublic.get('/books');
      const books = booksRes.data;
      
      // Fetch orders data (you'll need to adjust this based on your actual API)
      const ordersRes = await axiosSecure.get('/orders');
      const orders = ordersRes.data?.data || ordersRes.data || [];
      
      // Calculate metrics
      const today = new Date().toISOString().split('T')[0];
      
      const userStats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        librarians: users.filter(u => u.role === 'librarian').length,
        today: users.filter(u => 
          new Date(u.createdAt).toISOString().split('T')[0] === today
        ).length
      };
      
      const bookStats = {
        total: books.length,
        published: books.filter(b => b.status === 'published').length,
        unpublished: books.filter(b => b.status !== 'published').length,
        newToday: books.filter(b => 
          new Date(b.createdAt).toISOString().split('T')[0] === today
        ).length
      };
      
      const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.paymentStatus === 'pending').length,
        completed: orders.filter(o => o.paymentStatus === 'paid').length,
        revenue: orders
          .filter(o => o.paymentStatus === 'paid')
          .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
      };
      
      // Prepare recent activity
      const recentActivity = prepareRecentActivity(users, books, orders);
      
      // Prepare chart data
      const chartData = prepareChartData(users, books, orders);
      
      setDashboardData({
        users: userStats,
        books: bookStats,
        orders: orderStats,
        recentActivity,
        chartData
      });
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareRecentActivity = (users, books, orders) => {
    const activities = [];
    
    // Add user registrations
    const recentUsers = [...users]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    
    recentUsers.forEach(user => {
      activities.push({
        id: user._id,
        type: 'user',
        title: 'New User Registered',
        description: `${user.name || user.email} joined`,
        time: new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: <Users size={16} />,
        color: 'text-blue-500'
      });
    });
    
    // Add new books
    const recentBooks = [...books]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
    
    recentBooks.forEach(book => {
      activities.push({
        id: book._id,
        type: 'book',
        title: 'New Book Added',
        description: `"${book.bookName}" by ${book.author}`,
        time: new Date(book.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: <BookOpen size={16} />,
        color: 'text-green-500'
      });
    });
    
    // Add recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
    
    recentOrders.forEach(order => {
      activities.push({
        id: order._id,
        type: 'order',
        title: order.paymentStatus === 'paid' ? 'Order Completed' : 'New Order',
        description: `$${order.totalPrice} from ${order.userEmail}`,
        time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: order.paymentStatus === 'paid' ? <CheckCircle size={16} /> : <ShoppingBag size={16} />,
        color: order.paymentStatus === 'paid' ? 'text-purple-500' : 'text-yellow-500'
      });
    });
    
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  };

  const prepareChartData = (users, books, orders) => {
    // Prepare last 7 days data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateISO = date.toISOString().split('T')[0];
      
      // Count users per day
      const usersCount = users.filter(u => 
        new Date(u.createdAt).toISOString().split('T')[0] === dateISO
      ).length;
      
      // Count books per day
      const booksCount = books.filter(b => 
        new Date(b.createdAt).toISOString().split('T')[0] === dateISO
      ).length;
      
      // Calculate revenue per day
      const dailyRevenue = orders
        .filter(o => 
          o.paymentStatus === 'paid' && 
          new Date(o.createdAt).toISOString().split('T')[0] === dateISO
        )
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      
      last7Days.push({
        date: dateStr,
        users: usersCount,
        books: booksCount,
        revenue: dailyRevenue
      });
    }
    
    // Prepare role distribution for pie chart
    const roleDistribution = [
      { name: 'Admins', value: dashboardData.users.admins, color: '#3b82f6' },
      { name: 'Librarians', value: dashboardData.users.librarians, color: '#8b5cf6' },
      { name: 'Users', value: dashboardData.users.total - dashboardData.users.admins - dashboardData.users.librarians, color: '#6b7280' }
    ].filter(item => item.value > 0);
    
    // Prepare book status distribution
    const bookDistribution = [
      { name: 'Published', value: dashboardData.books.published, color: '#10b981' },
      { name: 'Unpublished', value: dashboardData.books.unpublished, color: '#f59e0b' }
    ].filter(item => item.value > 0);
    
    return {
      timeline: last7Days,
      roleDistribution,
      bookDistribution
    };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-muted">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="alert alert-error shadow-lg">
            <AlertCircle size={24} />
            <div>
              <h3 className="font-bold">Access Denied</h3>
              <div className="text-sm">Admin privileges required to view this page.</div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 border border-base-300 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: {entry.name === 'revenue' ? `$${entry.value}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="text-primary" size={32} />
              Admin Dashboard
            </h1>
            <p className="text-muted mt-1">Overview of your library management system</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="tabs tabs-boxed">
              <button 
                className={`tab ${timeRange === 'day' ? 'tab-active' : ''}`}
                onClick={() => setTimeRange('day')}
              >
                Today
              </button>
              <button 
                className={`tab ${timeRange === 'week' ? 'tab-active' : ''}`}
                onClick={() => setTimeRange('week')}
              >
                Week
              </button>
              <button 
                className={`tab ${timeRange === 'month' ? 'tab-active' : ''}`}
                onClick={() => setTimeRange('month')}
              >
                Month
              </button>
            </div>
            
            <button
              onClick={fetchDashboardData}
              className="btn btn-ghost btn-sm"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/dashboard/admin/users" className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted flex items-center gap-2">
                    <Users size={16} />
                    Total Users
                  </div>
                  <div className="text-3xl font-bold mt-2">{dashboardData.users.total}</div>
                </div>
                <div className={`text-xl ${dashboardData.users.today > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                  {dashboardData.users.today > 0 ? (
                    <div className="flex items-center gap-1">
                      <ArrowUpRight size={20} />
                      <span className="text-sm">+{dashboardData.users.today}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <ArrowDownRight size={20} />
                      <span className="text-sm">0</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted mt-2">Today's registrations</div>
            </div>
          </Link>

          <Link to="/dashboard/admin/books" className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted flex items-center gap-2">
                    <BookOpen size={16} />
                    Total Books
                  </div>
                  <div className="text-3xl font-bold mt-2">{dashboardData.books.total}</div>
                </div>
                <div className="badge badge-success">
                  {Math.round((dashboardData.books.published / dashboardData.books.total) * 100)}% Published
                </div>
              </div>
              <div className="text-xs text-muted mt-2">{dashboardData.books.published} published • {dashboardData.books.unpublished} unpublished</div>
            </div>
          </Link>

          <Link to="/dashboard/admin/orders" className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted flex items-center gap-2">
                    <ShoppingBag size={16} />
                    Total Orders
                  </div>
                  <div className="text-3xl font-bold mt-2">{dashboardData.orders.total}</div>
                </div>
                <div className={`text-xl ${dashboardData.orders.pending > 0 ? 'text-warning' : 'text-success'}`}>
                  {dashboardData.orders.pending > 0 ? (
                    <div className="flex items-center gap-1">
                      <AlertCircle size={20} />
                      <span className="text-sm">{dashboardData.orders.pending} pending</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <CheckCircle size={20} />
                      <span className="text-sm">All paid</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted mt-2">Revenue: ${dashboardData.orders.revenue.toFixed(2)}</div>
            </div>
          </Link>

          <Link to="/dashboard/admin/profile" className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted flex items-center gap-2">
                    <Shield size={16} />
                    Admin Controls
                  </div>
                  <div className="text-3xl font-bold mt-2">{dashboardData.users.admins}</div>
                </div>
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-12">
                    <span className="text-lg">A</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted mt-2">You have full system access</div>
            </div>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline Chart */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <TrendingUp size={20} />
                  Activity Overview ({timeRange})
                </h3>
                <div className="text-sm text-muted">Last 7 days</div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData.chartData?.timeline || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      name="New Users" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.2} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="books" 
                      name="New Books" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue ($)" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Role Distribution */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Users size={18} />
                  User Roles
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={dashboardData.chartData?.roleDistribution || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.chartData?.roleDistribution?.map((entry, index) => (
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

            {/* Book Status Distribution */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <BookOpen size={18} />
                  Book Status
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.chartData?.bookDistribution || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="card bg-base-100 shadow lg:col-span-2">
            <div className="card-body">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock size={20} />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {dashboardData.recentActivity.length === 0 ? (
                  <p className="text-center text-muted py-8">No recent activity</p>
                ) : (
                  dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-base-200 rounded-lg">
                      <div className={`p-2 rounded-full ${activity.color} bg-opacity-20`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted">{activity.description}</div>
                      </div>
                      <div className="text-xs text-muted">{activity.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/dashboard/admin/users"
                  className="btn btn-outline btn-block justify-start gap-3"
                >
                  <Users size={18} />
                  Manage Users
                </Link>
                <Link
                  to="/dashboard/admin/books"
                  className="btn btn-outline btn-block justify-start gap-3"
                >
                  <BookOpen size={18} />
                  Manage Books
                </Link>
                <Link
                  to="/dashboard/admin/orders"
                  className="btn btn-outline btn-block justify-start gap-3"
                >
                  <ShoppingBag size={18} />
                  View Orders
                </Link>
                <Link
                  to="/dashboard/admin/profile"
                  className="btn btn-outline btn-block justify-start gap-3"
                >
                  <Shield size={18} />
                  Admin Profile
                </Link>
              </div>
              
              {/* System Status */}
              <div className="divider">System Status</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Connection</span>
                  <span className="badge badge-success badge-sm">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <span className="badge badge-success badge-sm">Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage Usage</span>
                  <span className="badge badge-warning badge-sm">65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <DollarSign size={24} />
              </div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">${dashboardData.orders.revenue.toFixed(2)}</div>
              <div className="stat-desc">All time earnings</div>
            </div>
          </div>
          
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <CheckCircle size={24} />
              </div>
              <div className="stat-title">Completed Orders</div>
              <div className="stat-value">{dashboardData.orders.completed}</div>
              <div className="stat-desc">{((dashboardData.orders.completed / dashboardData.orders.total) * 100).toFixed(1)}% success rate</div>
            </div>
          </div>
          
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-accent">
                <TrendingUp size={24} />
              </div>
              <div className="stat-title">Growth Rate</div>
              <div className="stat-value">+24%</div>
              <div className="stat-desc">Compared to last month</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}