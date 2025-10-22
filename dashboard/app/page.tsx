'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PortalCard from '../components/PortalCard';
import { getUserRoles } from '../lib/keycloak';
import { getAccessiblePortals, groupPortalsByCategory, CATEGORY_NAMES, Portal } from '../lib/portals';

export default function HomePage() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [groupedPortals, setGroupedPortals] = useState<Record<string, Portal[]>>({});

  useEffect(() => {
    const userRoles = getUserRoles();
    const accessiblePortals = getAccessiblePortals(userRoles);
    const grouped = groupPortalsByCategory(accessiblePortals);

    setPortals(accessiblePortals);
    setGroupedPortals(grouped);
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to Your Portal Hub</h2>
          <p>Access all your Candid Studios portals from one central location.</p>
        </div>

        {Object.entries(groupedPortals).map(([category, categoryPortals]) => (
          <section key={category} className="portal-section">
            <h3 className="section-title">{CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}</h3>
            <div className="portal-grid">
              {categoryPortals.map((portal) => (
                <PortalCard key={portal.id} portal={portal} />
              ))}
            </div>
          </section>
        ))}

        {portals.length === 0 && (
          <div className="no-portals">
            <p>You don't have access to any portals yet.</p>
            <p>Please contact your administrator for access.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
