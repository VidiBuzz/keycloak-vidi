'use client';

import React from 'react';
import { Portal } from '../lib/portals';

interface PortalCardProps {
  portal: Portal;
}

export default function PortalCard({ portal }: PortalCardProps) {
  // Determine if this is an external link
  const isExternal = portal.url.startsWith('http');
  const isKeycloakAdmin = portal.id === 'keycloak-admin';

  return (
    <a
      href={portal.url}
      className="portal-card"
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      <div className="portal-icon">{portal.icon}</div>
      <h3 className="portal-name">{portal.name}</h3>
      <p className="portal-description">{portal.description}</p>
      {isExternal && portal.url.includes('candidstudios.net') && !portal.url.includes('login.candidstudios.net') && (
        <span className="portal-status">🔗 External Portal</span>
      )}
      {isKeycloakAdmin && (
        <span className="portal-status">⚙️ Advanced Settings</span>
      )}
    </a>
  );
}
