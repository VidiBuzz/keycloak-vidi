'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getUserRoles, hasRole } from '../../lib/keycloak';
import UserManagement from '../../components/admin/UserManagement';
import './admin.css';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      const roles = getUserRoles();
      console.log('AdminPage: User roles:', roles);
      const isAdminRole = hasRole('admin');
      console.log('AdminPage: Has admin role:', isAdminRole);
      setIsAdmin(isAdminRole);
      setLoading(false);
    };

    // Increased delay to match HomePage timing
    const timer = setTimeout(checkAdmin, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container-inline">
          <div className="loading-spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="access-denied">
          <h2>🔒 Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
          <a href="/" className="btn-primary">Return to Dashboard</a>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="admin-page">
        <div className="admin-header">
          <h1>👥 User Management</h1>
          <p>Manage users, roles, and permissions for Candid Studios portals</p>
        </div>

        <UserManagement />
      </div>
    </DashboardLayout>
  );
}
