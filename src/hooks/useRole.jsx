// hooks/useRole.jsx
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import axiosSecure from '../api/axiosSecure';

export const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState('user');
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) {
        setRole('user');
        setRoleLoading(false);
        return;
      }

      try {
        // Try to get role from server
        const { data } = await axiosSecure.get('/users/role');
        setRole(data.role || 'user');
      } catch (error) {
        console.warn('Failed to fetch role, defaulting to user:', error);
        setRole('user');
      } finally {
        setRoleLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchRole();
    } else if (!authLoading && !user) {
      setRoleLoading(false);
    }
  }, [user, authLoading]);

  return { role, isLoading: authLoading || roleLoading };
};