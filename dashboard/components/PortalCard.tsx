'use client';

import React from 'react';
import { Portal } from '../lib/portals';

interface PortalCardProps {
  portal: Portal;
}

export default function PortalCard({ portal }: PortalCardProps) {
  return (
    <a
      href={portal.url}
      className="portal-card"
      target={portal.id === 'admin' ? '_blank' : '_self'}
      rel={portal.id === 'admin' ? 'noopener noreferrer' : undefined}
    >
      <div className="portal-icon">{portal.icon}</div>
      <h3 className="portal-name">{portal.name}</h3>
      <p className="portal-description">{portal.description}</p>
      {portal.url.includes('candidstudios.net') && !portal.url.includes('login.candidstudios.net') && (
        <span className="portal-status">🔗 External Portal</span>
      )}
    </a>
  );
}
