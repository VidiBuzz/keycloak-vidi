'use client';

import React, { useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified: boolean;
  roles: string[];
}

const AVAILABLE_ROLES = [
  { id: 'admin', name: 'Admin', description: 'Full system access' },
  { id: 'manager', name: 'Manager', description: 'Analytics & operations' },
  { id: 'photographer', name: 'Photographer', description: 'Photo uploads' },
  { id: 'videographer', name: 'Videographer', description: 'Video uploads' },
  { id: 'editor', name: 'Editor', description: 'Post-production' },
  { id: 'post-production', name: 'Post Production', description: 'Editing workflows' },
  { id: 'analyst', name: 'Analyst', description: 'Analytics only' },
  { id: 'vendor-coordinator', name: 'Vendor Coordinator', description: 'Vendor management' },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roles: [] as string[],
  });

  // This would connect to your Keycloak API
  const loadUsers = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual API call
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();
      // setUsers(data);

      // For now, show placeholder
      console.log('Load users from Keycloak API');
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TODO: Implement actual API call
      // await fetch('/api/admin/users/invite', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(inviteForm),
      // });

      console.log('Invite user:', inviteForm);
      alert(`Invitation sent to ${inviteForm.email}`);

      setShowInviteModal(false);
      setInviteForm({ firstName: '', lastName: '', email: '', roles: [] });
    } catch (error) {
      console.error('Failed to invite user:', error);
      alert('Failed to send invitation');
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setInviteForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter((r) => r !== roleId)
        : [...prev.roles, roleId],
    }));
  };

  return (
    <div className="user-management">
      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="actions">
          <button
            onClick={() => setShowInviteModal(true)}
            className="btn-primary"
          >
            ✉️ Invite User
          </button>
          <button onClick={loadUsers} className="btn-secondary">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="coming-soon-card">
        <h3>🚧 Coming Soon</h3>
        <p>
          Full user management interface is currently in development. For now, use these tools:
        </p>
        <div className="tool-links">
          <a
            href="https://login.candidstudios.net/admin/master/console/#/CandidStudios/users"
            target="_blank"
            rel="noopener noreferrer"
            className="tool-link"
          >
            <span className="tool-icon">⚙️</span>
            <div>
              <h4>Keycloak Admin Console</h4>
              <p>Full user management and configuration</p>
            </div>
          </a>
          <div className="tool-link" onClick={() => alert('Run: ./scripts/bulk-import-staff.sh')}>
            <span className="tool-icon">📥</span>
            <div>
              <h4>Bulk Import Script</h4>
              <p>Import all staff from CSV file</p>
              <code>./scripts/bulk-import-staff.sh</code>
            </div>
          </div>
          <div className="tool-link" onClick={() => alert('Run: ./scripts/setup-roles.sh')}>
            <span className="tool-icon">🎭</span>
            <div>
              <h4>Role Setup Script</h4>
              <p>Configure all realm roles</p>
              <code>./scripts/setup-roles.sh</code>
            </div>
          </div>
        </div>

        <div className="api-info">
          <h4>🔌 API Integration Available</h4>
          <p>
            This page will connect to Keycloak Admin REST API for:
          </p>
          <ul>
            <li>✅ List all users with pagination</li>
            <li>✅ Search users by name/email</li>
            <li>✅ Send invitation emails</li>
            <li>✅ Assign/remove roles</li>
            <li>✅ Enable/disable accounts</li>
            <li>✅ View user details and activity</li>
          </ul>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✉️ Invite New User</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleInviteUser}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={inviteForm.firstName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, firstName: e.target.value })
                  }
                  required
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={inviteForm.lastName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, lastName: e.target.value })
                  }
                  required
                  placeholder="Enter last name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  required
                  placeholder="user@candidstudios.net"
                />
              </div>

              <div className="form-group">
                <label>Assign Roles</label>
                <div className="role-checkboxes">
                  {AVAILABLE_ROLES.map((role) => (
                    <label key={role.id} className="role-checkbox">
                      <input
                        type="checkbox"
                        checked={inviteForm.roles.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                      />
                      <div className="role-info">
                        <span className="role-name">{role.name}</span>
                        <span className="role-desc">{role.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
