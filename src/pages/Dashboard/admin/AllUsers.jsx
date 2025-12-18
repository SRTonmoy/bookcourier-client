// pages/Dashboard/admin/AllUsers.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import axiosSecure from '../../../api/axiosSecure';
import { useAuth } from '../../../hooks/useAuth';
import { useRole } from '../../../hooks/useRole';
import { User, AlertCircle, RefreshCw, Shield, BookOpen } from 'lucide-react';

// User avatar component with fallback
const UserAvatar = ({ user, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  
  // Determine the best image source
  const getImageSrc = () => {
    // Try various possible image properties
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
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl'
  };
  
  // Role colors for avatar background
  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-gradient-to-br from-primary to-purple-600';
      case 'librarian': return 'bg-gradient-to-br from-secondary to-blue-600';
      default: return 'bg-gradient-to-br from-gray-600 to-gray-800';
    }
  };
  
  // Get initials from name or email
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
      
      {/* Online status indicator */}
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

  useEffect(() => {
    if (role === 'admin') {
      fetchUsers();
    }
  }, [role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get('/users');
      console.log('Fetched users data:', data); 
      setUsers(data);
      calculateStats(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Shield className="text-primary" size={28} />
            Manage Users
          </h2>
          <p className="text-muted mt-1">Manage user roles and permissions</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <User size={24} />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Shield size={24} />
            </div>
            <div className="stat-title">Admins</div>
            <div className="stat-value">{stats.admins}</div>
          </div>
        </div>
        
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-accent">
              <BookOpen size={24} />
            </div>
            <div className="stat-title">Librarians</div>
            <div className="stat-value">{stats.librarians}</div>
          </div>
        </div>
        
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-base-content">
              <User size={24} />
            </div>
            <div className="stat-title">Regular Users</div>
            <div className="stat-value">{stats.users}</div>
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