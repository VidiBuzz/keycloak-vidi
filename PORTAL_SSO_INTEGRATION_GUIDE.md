# Portal SSO Integration Guide

Complete guide for integrating existing Candid Studios portals with Keycloak SSO.

## Overview

This guide covers integrating:
1. **analytics.candidstudios.net** - Analytics Dashboard
2. **referral.candidstudios.net** - Referral/Affiliate Program
3. **Future portals** - Vendor, Photographer, Client, Editor

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Keycloak Clients](#create-keycloak-clients)
3. [Integration Methods](#integration-methods)
4. [Option A: JavaScript/SPA Integration](#option-a-javascriptspa-integration)
5. [Option B: Server-Side Integration (Node.js)](#option-b-server-side-integration-nodejs)
6. [Option C: Next.js Integration](#option-c-nextjs-integration)
7. [Testing SSO Flow](#testing-sso-flow)
8. [Removing Old Login Pages](#removing-old-login-pages)

---

## Prerequisites

- [ ] Dashboard client created in Keycloak
- [ ] User roles configured
- [ ] Access to portal codebases
- [ ] Basic knowledge of OAuth 2.0 / OIDC

## Create Keycloak Clients

For each portal, you need to create a Keycloak client:

### Step 1: Login to Keycloak Admin

```bash
# Go to admin console
https://login.candidstudios.net/admin/

# Login with: admin / 2468VidiSmart.
# Select: CandidStudios realm
```

### Step 2: Create Client for Analytics Portal

1. Navigate to **Clients** → **Create**
2. Fill in details:
   ```
   Client ID: analytics-portal
   Name: Analytics Dashboard
   Description: Business metrics and reporting
   ```
3. Click **Save**

4. **Configure Settings:**
   - Client authentication: `OFF` (public client) or `ON` (confidential)
   - Standard flow: `ON`
   - Direct access grants: `OFF`
   - Valid redirect URIs:
     ```
     https://analytics.candidstudios.net/*
     http://localhost:3000/* (for local development)
     ```
   - Web origins: `+`
   - PKCE: `S256` (recommended)

### Step 3: Repeat for Referral Portal

```
Client ID: referral-portal
Name: Referral Program
Valid redirect URIs:
  https://referral.candidstudios.net/*
  http://localhost:3001/*
```

### Step 4: Client Configuration Reference

| Portal | Client ID | URL |
|--------|-----------|-----|
| Analytics | analytics-portal | analytics.candidstudios.net |
| Referral | referral-portal | referral.candidstudios.net |
| Vendor | vendor-portal | vendor.candidstudios.net |
| Photographer | photographer-portal | photographer.candidstudios.net |
| Client | client-portal | client.candidstudios.net |
| Editor | editor-portal | editor.candidstudios.net |

---

## Integration Methods

Choose the method that matches your portal's technology stack:

### Method Comparison

| Method | Best For | Complexity | Frontend/Backend |
|--------|----------|------------|------------------|
| JavaScript/SPA | React, Vue, Angular SPAs | Easy | Frontend |
| Node.js | Express, Koa apps | Medium | Backend |
| Next.js | Next.js apps | Easy | Both |
| Python | Django, Flask | Medium | Backend |

---

## Option A: JavaScript/SPA Integration

Best for: React, Vue, Angular, or vanilla JavaScript frontends

### Step 1: Install Keycloak.js

```bash
npm install keycloak-js
```

### Step 2: Create Keycloak Configuration

```typescript
// src/lib/keycloak.ts
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://login.candidstudios.net/',
  realm: 'CandidStudios',
  clientId: 'analytics-portal', // Change per portal
});

export const initKeycloak = async () => {
  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    });

    if (authenticated) {
      console.log('User authenticated');
      console.log('Token:', keycloak.token);
      console.log('User info:', keycloak.tokenParsed);
    }

    return authenticated;
  } catch (error) {
    console.error('Keycloak init failed:', error);
    return false;
  }
};

export const getToken = () => keycloak.token;
export const getUserInfo = () => keycloak.tokenParsed;
export const logout = () => keycloak.logout();
export const refreshToken = () => keycloak.updateToken(30);

export default keycloak;
```

### Step 3: Initialize in React App

```typescript
// src/App.tsx or src/index.tsx
import { useEffect, useState } from 'react';
import { initKeycloak, getUserInfo } from './lib/keycloak';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const auth = await initKeycloak();
      setAuthenticated(auth);
      if (auth) {
        setUser(getUserInfo());
      }
    };

    init();
  }, []);

  if (!authenticated) {
    return <div>Authenticating...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.given_name}!</h1>
      {/* Your app content */}
    </div>
  );
}
```

### Step 4: Protect API Calls

```typescript
// src/api/client.ts
import keycloak from './lib/keycloak';

export async function fetchAnalytics() {
  // Ensure token is fresh
  await keycloak.updateToken(30);

  const response = await fetch('https://api.candidstudios.net/analytics', {
    headers: {
      'Authorization': `Bearer ${keycloak.token}`,
    },
  });

  return response.json();
}
```

---

## Option B: Server-Side Integration (Node.js)

Best for: Express, Koa, or other Node.js backends

### Step 1: Install Dependencies

```bash
npm install express-session keycloak-connect
```

### Step 2: Configure Keycloak Middleware

```javascript
// server.js
const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express();

// Session configuration
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'your-secret-key-here',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}));

// Keycloak configuration
const keycloak = new Keycloak({
  store: memoryStore,
}, {
  realm: 'CandidStudios',
  'auth-server-url': 'https://login.candidstudios.net/',
  'ssl-required': 'external',
  resource: 'analytics-portal',
  'public-client': true,
  'confidential-port': 0,
});

// Apply Keycloak middleware
app.use(keycloak.middleware());

// Protect routes
app.get('/', keycloak.protect(), (req, res) => {
  res.send(`Hello ${req.kauth.grant.access_token.content.name}!`);
});

// Role-based protection
app.get('/admin', keycloak.protect('admin'), (req, res) => {
  res.send('Admin only page');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Step 3: Check User Roles

```javascript
app.get('/api/analytics', keycloak.protect(), (req, res) => {
  const token = req.kauth.grant.access_token.content;

  // Check if user has analyst role
  if (token.realm_access?.roles.includes('analyst')) {
    // Fetch and return analytics data
    res.json({ data: 'analytics data' });
  } else {
    res.status(403).json({ error: 'Insufficient permissions' });
  }
});
```

---

## Option C: Next.js Integration

Best for: Next.js applications

### Step 1: Install next-auth

```bash
npm install next-auth
```

### Step 2: Configure NextAuth with Keycloak

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
      issuer: 'https://login.candidstudios.net/realms/CandidStudios',
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.roles = account.roles;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.roles = token.roles;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

### Step 3: Protect Pages

```typescript
// app/analytics/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AnalyticsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}
```

---

## Testing SSO Flow

### Test Checklist

1. **Unauthenticated Access:**
   - [ ] Visit portal URL
   - [ ] Should redirect to Keycloak login
   - [ ] Keycloak shows Candid Studios theme

2. **Authentication:**
   - [ ] Login with test credentials
   - [ ] Should redirect back to portal
   - [ ] Portal shows user name
   - [ ] Token is valid

3. **Single Sign-On:**
   - [ ] Login to first portal (e.g., Analytics)
   - [ ] Open second portal (e.g., Referral)
   - [ ] Should auto-login without credentials

4. **Token Refresh:**
   - [ ] Wait for token to expire (~60 seconds)
   - [ ] Portal should auto-refresh token
   - [ ] No re-login required

5. **Logout:**
   - [ ] Click logout in portal
   - [ ] Should logout from all portals
   - [ ] Keycloak session cleared

6. **Role-Based Access:**
   - [ ] Login as admin → sees all features
   - [ ] Login as photographer → sees limited features
   - [ ] Login as analyst → sees analytics only

---

## Removing Old Login Pages

Once SSO is working, remove old login systems:

### Step 1: Identify Old Auth Code

Search for:
- Login forms
- User authentication functions
- Password validation
- Session management (if using local sessions)

```bash
# Find old login code
grep -r "login" src/
grep -r "authenticate" src/
grep -r "password" src/
```

### Step 2: Remove Old Auth Routes

```javascript
// BEFORE
app.post('/login', async (req, res) => {
  // Old login logic
});

app.post('/register', async (req, res) => {
  // Old registration logic
});

// AFTER
// Delete these routes - Keycloak handles all auth
```

### Step 3: Update Navigation

```jsx
// BEFORE
<a href="/login">Login</a>

// AFTER
<button onClick={() => keycloak.logout()}>Logout</button>
```

### Step 4: Database Cleanup (Optional)

If you stored passwords in your database:

```sql
-- Backup first!
-- Remove password columns (users now authenticate via Keycloak)
ALTER TABLE users DROP COLUMN password_hash;
ALTER TABLE users DROP COLUMN password_salt;
```

---

## Common Issues & Solutions

### Issue: Infinite Redirect Loop

**Solution:** Check redirect URIs in Keycloak client settings

```
Valid redirect URIs must include:
- https://yourportal.candidstudios.net/*
- Exact match or wildcard
```

### Issue: CORS Errors

**Solution:** Add web origin in Keycloak client

```
Web Origins: +
(This allows all configured redirect URIs)
```

### Issue: Token Expired Errors

**Solution:** Implement automatic token refresh

```javascript
// Refresh token every 30 seconds
setInterval(async () => {
  await keycloak.updateToken(30);
}, 30000);
```

### Issue: Role Not Found

**Solution:** Ensure roles are assigned in Keycloak

1. Go to Users → Select user
2. Role Mappings tab
3. Assign role → Select roles → Assign

---

## Next Steps

1. ✅ Create Keycloak clients for all portals
2. ✅ Choose integration method per portal
3. ✅ Implement SSO in one portal (test first)
4. ✅ Test authentication flow thoroughly
5. ✅ Roll out to remaining portals
6. ✅ Remove old login systems
7. ✅ Monitor and optimize

## Support

- **Keycloak Docs:** https://www.keycloak.org/docs/latest/securing_apps/
- **Next-Auth:** https://next-auth.js.org/providers/keycloak
- **Email:** support@candidstudios.net

---

**Last Updated:** 2025-10-22
**Author:** Ryan Mayiras / Claude Code
**Version:** 1.0
