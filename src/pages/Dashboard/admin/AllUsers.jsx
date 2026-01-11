// pages/Dashboard/admin/AllUsers.jsx - WITH CHARTS
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import axiosSecure from '../../../api/axiosSecure';
import { useAuth } from '../../../hooks/useAuth';
import { useRole } from '../../../hooks/useRole';
import { 
  User, AlertCircle, RefreshCw, Shield, BookOpen, 
  BarChart3, PieChart, TrendingUp, Calendar,
  Download, Filter
} from 'lucide-react';

// Import Recharts components
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// User avatar component with fallback (unchanged)
const UserAvatar = ({ user, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  
  const getImageSrc = () => {
    const sources = [
      user.photoURL,
      user.avatar,
      user.image,
      user.profilePicture,
      user.photo
    ];
    
    return sources.find(src => src && src !== '' && src !== 'null' && src !== 'undefined');
  };

  const imageSrc = getImageSrc();
  const hasImage = imageSrc && !imgError;
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl'
  };
  
  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-gradient-to-br from-primary to-purple-600';
      case 'librarian': return 'bg-gradient-to-br from-secondary to-blue-600';
      default: return 'bg-gradient-to-br from-gray-600 to-gray-800';
    }
  };
  
  const getInitials = () => {
    const name = user.name || user.displayName || user.email || 'User';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`avatar ${sizeClasses[size]} relative`}>
      {hasImage ? (
        <div className="rounded-full ring-2 ring-base-300 ring-offset-2 overflow-hidden">
          <img 
            src={imageSrc}
            alt={user.name || user.email}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            onLoad={() => setImgError(false)}
          />
        </div>
      ) : (
        <div className={`rounded-full flex items-center justify-center text-white font-bold ring-2 ring-base-300 ring-offset-2 ${getRoleColor(user.role)}`}>
          {getInitials()}
        </div>
      )}
      
      {user.isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-100"></div>
      )}
    </div>
  );
};

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const { user: currentUser } = useAuth();
  const { role } = useRole();
  const [stats, setStats] = useState({ total: 0, admins: 0, librarians: 0, users: 0 });
  
  // New state for charts
  const [chartData, setChartData] = useState({
    roleDistribution: [],
    userGrowth: [],
    activityData: []
  });
  const [activeChart, setActiveChart] = useState('bar'); // 'bar', 'pie', 'line'
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'month', 'week'

  useEffect(() => {
    if (role === 'admin') {
      fetchUsers();
    }
  }, [role]);

  useEffect(() => {
    if (users.length > 0) {
      prepareChartData();
    }
  }, [users, timeFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get('/users');
      setUsers(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (usersList) => {
    const stats = {
      total: usersList.length,
      admins: usersList.filter(u => u.role === 'admin').length,
      librarians: usersList.filter(u => u.role === 'librarian').length,
      users: usersList.filter(u => (!u.role || u.role === 'user')).length
    };
    setStats(stats);
  };

  const prepareChartData = () => {
    // Prepare role distribution data
    const roleData = [
      { name: 'Admins', value: stats.admins, color: '#3b82f6' },
      { name: 'Librarians', value: stats.librarians, color: '#8b5cf6' },
      { name: 'Users', value: stats.users, color: '#6b7280' }
    ].filter(item => item.value > 0);

    // Prepare user growth data (by join date)
    const userGrowth = prepareUserGrowthData();
    
    // Prepare activity data (mock data - you can replace with real data)
    const activityData = prepareActivityData();

    setChartData({
      roleDistribution: roleData,
      userGrowth,
      activityData
    });
  };

  const prepareUserGrowthData = () => {
    const now = new Date();
    const userGrowth = [];
    
    // Create last 7 days data
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Count users who joined on or before this day
      const usersBeforeDate = users.filter(user => {
        const joinDate = new Date(user.createdAt || user.joinedDate || Date.now());
        return joinDate <= date;
      }).length;
      
      userGrowth.push({
        date: dateStr,
        users: usersBeforeDate,
        newUsers: Math.floor(Math.random() * 5) // Mock new users data
      });
    }
    
    return userGrowth;
  };

  const prepareActivityData = () => {
    // Mock activity data - you should replace with real data from your backend
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      active: Math.floor(Math.random() * 20) + 10,
      new: Math.floor(Math.random() * 5) + 1
    }));
  };

  const updateRole = async (userId, email, newRole) => {
    if (!window.confirm(`Change ${email} to ${newRole}?\n\nThis will grant ${newRole === 'admin' ? 'full system access' : newRole === 'librarian' ? 'book management access' : 'basic user access'}.`)) return;

    setUpdating(email);
    try {
      await axiosSecure.patch(`/users/role/${email}`, { role: newRole });
      
      // Update local state immediately
      setUsers(prev => prev.map(u => 
        u.email === email ? { ...u, role: newRole } : u
      ));
      
      // Recalculate stats
      calculateStats(users.map(u => 
        u.email === email ? { ...u, role: newRole } : u
      ));
      
      // Show success toast
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'success', 
          message: `${email} is now ${newRole}` 
        }
      }));
      
    } catch (error) {
      console.error('Failed to update role:', error);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'error', 
          message: error.response?.data?.message || 'Failed to update role' 
        }
      }));
    } finally {
      setUpdating(null);
    }
  };

  // Filter current user from the list
  const otherUsers = users.filter(u => u.email !== currentUser?.email);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-muted">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="p-8">
        <div className="alert alert-error shadow-lg">
          <AlertCircle size={24} />
          <div>
            <h3 className="font-bold">Access Denied</h3>
            <div className="text-sm">Admin privileges required to view this page.</div>
          </div>
        </div>
      </div>
    );
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 border border-base-300 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Shield className="text-primary" size={28} />
            Manage Users
          </h2>
          <p className="text-muted mt-1">Manage user roles and permissions with visual insights</p>
        </div>
        
        <div className="flex gap-2">
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
            onClick={fetchUsers}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <User size={24} />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-desc">↗︎ {chartData.userGrowth[chartData.userGrowth.length - 1]?.newUsers || 0} new this week</div>
          </div>
        </div>
        
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Shield size={24} />
            </div>
            <div className="stat-title">Admins</div>
            <div className="stat-value">{stats.admins}</div>
            <div className="stat-desc">{((stats.admins / stats.total) * 100).toFixed(1)}% of total</div>
          </div>
        </div>
        
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-accent">
              <BookOpen size={24} />
            </div>
            <div className="stat-title">Librarians</div>
            <div className="stat-value">{stats.librarians}</div>
            <div className="stat-desc">{((stats.librarians / stats.total) * 100).toFixed(1)}% of total</div>
          </div>
        </div>
        
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-base-content">
              <User size={24} />
            </div>
            <div className="stat-title">Regular Users</div>
            <div className="stat-value">{stats.users}</div>
            <div className="stat-desc">{((stats.users / stats.total) * 100).toFixed(1)}% of total</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="text-primary" size={24} />
              User Analytics
            </h3>
            <p className="text-sm text-muted">Visual insights into user distribution and growth</p>
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
                <li><a onClick={() => setTimeFilter('all')}>All Time</a></li>
                <li><a onClick={() => setTimeFilter('month')}>Last Month</a></li>
                <li><a onClick={() => setTimeFilter('week')}>Last Week</a></li>
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
                    <BarChart data={chartData.roleDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Number of Users" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                
                {activeChart === 'pie' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={chartData.roleDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.roleDistribution.map((entry, index) => (
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
                    <AreaChart data={chartData.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="users" name="Total Users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Additional Stats Chart */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h4 className="font-bold flex items-center gap-2">
                <TrendingUp size={20} />
                User Growth Trend
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="users" name="Total Users" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current User Card */}
      <div className="card bg-primary bg-opacity-10 border border-primary border-opacity-20">
        <div className="card-body py-4">
          <div className="flex items-center gap-4">
            <UserAvatar user={currentUser} size="md" />
            <div className="flex-1">
              <h3 className="font-bold">You ({currentUser?.email})</h3>
              <p className="text-sm text-muted">You cannot change your own role</p>
            </div>
            <div className="badge badge-primary badge-lg">Admin (You)</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th className="text-center">User</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {otherUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <User size={48} className="text-base-300 mb-4" />
                        <p className="text-muted">No other users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  otherUsers.map((u) => (
                    <tr key={u._id || u.email} className="hover">
                      <td className="text-center">
                        <UserAvatar user={u} size="sm" />
                      </td>
                      <td className="font-medium">
                        <div>{u.name || 'No name provided'}</div>
                        {u.displayName && u.displayName !== u.name && (
                          <div className="text-xs text-muted">Display: {u.displayName}</div>
                        )}
                      </td>
                      <td>
                        <div className="font-mono text-sm">{u.email}</div>
                        {u.emailVerified && (
                          <span className="badge badge-success badge-xs mt-1">Verified</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'librarian' ? 'badge-secondary' : 'badge-outline'}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td>
                        <div>{new Date(u.createdAt || u.joinedDate || Date.now()).toLocaleDateString()}</div>
                        <div className="text-xs text-muted">
                          {new Date(u.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {u.role !== 'admin' && (
                            <button 
                              onClick={() => updateRole(u._id, u.email, 'admin')}
                              className="btn btn-xs btn-primary"
                              disabled={updating === u.email}
                              title="Grant full system access"
                            >
                              {updating === u.email ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : 'Make Admin'}
                            </button>
                          )}
                          {u.role !== 'librarian' && (
                            <button 
                              onClick={() => updateRole(u._id, u.email, 'librarian')}
                              className="btn btn-xs btn-secondary"
                              disabled={updating === u.email}
                              title="Grant book management access"
                            >
                              {updating === u.email ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : 'Librarian'}
                            </button>
                          )}
                          {u.role !== 'user' && u.role !== undefined && (
                            <button 
                              onClick={() => updateRole(u._id, u.email, 'user')}
                              className="btn btn-xs btn-outline"
                              disabled={updating === u.email}
                              title="Set as regular user"
                            >
                              {updating === u.email ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ): 'Make User'}
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