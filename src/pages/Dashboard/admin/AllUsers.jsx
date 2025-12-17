// pages/Dashboard/admin/AllUsers.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import axiosSecure from '../../../api/axiosSecure';
import { useAuth } from '../../../hooks/useAuth';
import { useRole } from '../../../hooks/useRole';

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { role } = useRole();

  useEffect(() => {
    if (role === 'admin') {
      fetchUsers();
    }
  }, [role]);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosSecure.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (email, newRole) => {
    if (!window.confirm(`Change ${email} to ${newRole}?`)) return;

    try {
      await axiosSecure.patch(`/users/role/${email}`, { role: newRole });
      alert('Role updated successfully');
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role');
    }
  };

  if (loading) return <div className="p-8">Loading users...</div>;
  if (role !== 'admin') return <div className="p-8 text-error">Access denied. Admin only.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Users ({users.length})</h2>
      
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id || u.email} className="hover:bg-base-300">
                <td>
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img src={u.photoURL || '/default-avatar.png'} alt={u.name} />
                    </div>
                  </div>
                </td>
                <td className="font-medium">{u.name || 'No name'}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'librarian' ? 'badge-secondary' : 'badge-outline'}`}>
                    {u.role || 'user'}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => updateRole(u.email, 'admin')}
                        className="btn btn-xs btn-primary"
                      >
                        Make Admin
                      </button>
                    )}
                    {u.role !== 'librarian' && (
                      <button 
                        onClick={() => updateRole(u.email, 'librarian')}
                        className="btn btn-xs btn-secondary"
                      >
                        Make Librarian
                      </button>
                    )}
                    {u.role !== 'user' && (
                      <button 
                        onClick={() => updateRole(u.email, 'user')}
                        className="btn btn-xs btn-outline"
                      >
                        Make User
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}