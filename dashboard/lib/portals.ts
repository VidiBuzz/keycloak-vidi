/**
 * Portal configuration for Candid Studios
 * Each portal has an ID, name, description, URL, icon, and required roles
 */

export interface Portal {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  roles: string[]; // Empty array means accessible to all authenticated users
  category: 'analytics' | 'operations' | 'client' | 'admin';
}

export const PORTALS: Portal[] = [
  // Existing Portals
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'View performance metrics, revenue reports, and business insights',
    url: 'https://analytics.candidstudios.net',
    icon: '📊',
    roles: ['admin', 'manager', 'analyst'],
    category: 'analytics',
  },
  {
    id: 'referral',
    name: 'Referral Program',
    description: 'Manage affiliate links and track referral commissions',
    url: 'https://referral.candidstudios.net',
    icon: '🤝',
    roles: [], // All authenticated users can access
    category: 'operations',
  },

  // Future Portals
  {
    id: 'vendor',
    name: 'Vendor Portal',
    description: 'Manage vendors, venues, and partnership relationships',
    url: 'https://vendor.candidstudios.net',
    icon: '🏢',
    roles: ['admin', 'manager', 'vendor-coordinator'],
    category: 'operations',
  },
  {
    id: 'photographer',
    name: 'Photographer Portal',
    description: 'Upload photos, manage bookings, and access project files',
    url: 'https://photographer.candidstudios.net',
    icon: '📷',
    roles: ['admin', 'photographer', 'videographer'],
    category: 'operations',
  },
  {
    id: 'client',
    name: 'Client Portal',
    description: 'View event photos, download media, and manage bookings',
    url: 'https://client.candidstudios.net',
    icon: '👥',
    roles: [], // All authenticated users (clients) can access
    category: 'client',
  },
  {
    id: 'editor',
    name: 'Editor Portal',
    description: 'Access raw files, submit edits, and manage editing projects',
    url: 'https://editor.candidstudios.net',
    icon: '🎬',
    roles: ['admin', 'editor', 'post-production'],
    category: 'operations',
  },

  // Admin Portal
  {
    id: 'admin',
    name: 'Admin Console',
    description: 'User management, permissions, and system configuration',
    url: 'https://login.candidstudios.net/admin/master/console/#/CandidStudios',
    icon: '⚙️',
    roles: ['admin'],
    category: 'admin',
  },
];

/**
 * Get portals accessible by a user based on their roles
 * @param userRoles - Array of role names the user has
 * @returns Array of portals the user can access
 */
export const getAccessiblePortals = (userRoles: string[]): Portal[] => {
  return PORTALS.filter((portal) => {
    // If portal has no role restrictions, it's accessible to all
    if (portal.roles.length === 0) return true;

    // Check if user has any of the required roles
    return portal.roles.some((requiredRole) => userRoles.includes(requiredRole));
  });
};

/**
 * Group portals by category
 * @param portals - Array of portals to group
 * @returns Object with portals grouped by category
 */
export const groupPortalsByCategory = (portals: Portal[]) => {
  return portals.reduce(
    (acc, portal) => {
      if (!acc[portal.category]) {
        acc[portal.category] = [];
      }
      acc[portal.category].push(portal);
      return acc;
    },
    {} as Record<string, Portal[]>
  );
};

/**
 * Category display names
 */
export const CATEGORY_NAMES = {
  analytics: 'Analytics & Reporting',
  operations: 'Operations & Management',
  client: 'Client Services',
  admin: 'Administration',
};
