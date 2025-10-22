'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { getUserProfile, logout, initKeycloak } from '../lib/keycloak';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Create context for user profile
export const UserContext = createContext<any>(null);

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const authenticated = await initKeycloak();
      if (authenticated) {
        const profile = getUserProfile();
        setUser(profile);
      }
      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Authenticating with Keycloak...</p>
      </div>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <div className="dashboard-layout">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <img src="/logo.png" alt="Candid Studios" className="header-logo" />
              <h1>Candid Studios</h1>
            </div>
            <div className="header-right">
              {user && (
                <>
                  <div className="user-info">
                    <span className="user-name">{user.fullName || user.email}</span>
                    <span className="user-roles">
                      {user.roles.filter((r: string) => !r.startsWith('default')).join(', ') || 'User'}
                    </span>
                  </div>
                  <button onClick={logout} className="logout-button">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">{children}</main>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>&copy; {new Date().getFullYear()} Candid Studios. All rights reserved.</p>
          <p>
            Need help? <a href="mailto:support@candidstudios.net">support@candidstudios.net</a>
          </p>
        </footer>
      </div>
    </UserContext.Provider>
  );
}
