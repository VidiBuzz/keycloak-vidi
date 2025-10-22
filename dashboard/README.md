# Candid Studios Portal Hub

Central dashboard for accessing all Candid Studios portals with Keycloak SSO authentication.

## Features

- 🔐 **Keycloak SSO Integration** - Single sign-on authentication
- 🎨 **Modern UI** - Purple gradient design matching Keycloak login theme
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔑 **Role-Based Access** - Portal visibility based on user roles
- 🚀 **Fast & Secure** - Built with Next.js and TypeScript

## Portal Access

### Existing Portals
- **Analytics Dashboard** - Business metrics and reports (admin, manager, analyst)
- **Referral Program** - Affiliate links and commissions (all users)

### Future Portals
- **Vendor Portal** - Vendor and venue management (admin, manager, vendor-coordinator)
- **Photographer Portal** - Photo uploads and bookings (admin, photographer, videographer)
- **Client Portal** - View and download event media (all users)
- **Editor Portal** - Raw files and editing projects (admin, editor, post-production)
- **Admin Console** - User and system management (admin only)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Keycloak server running at `login.candidstudios.net`

### Installation

1. **Clone the repository:**
   ```bash
   cd keycloak-vidi/dashboard
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   NEXT_PUBLIC_KEYCLOAK_URL=https://login.candidstudios.net/
   NEXT_PUBLIC_KEYCLOAK_REALM=CandidStudios
   NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=dashboard
   NEXT_PUBLIC_APP_URL=https://login.candidstudios.net
   ```

3. **Create Keycloak client:**

   Go to Keycloak Admin Console → CandidStudios Realm → Clients → Create

   **Client Settings:**
   - Client ID: `dashboard`
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Standard Flow Enabled: `ON`
   - Direct Access Grants Enabled: `OFF`
   - Valid Redirect URIs:
     - `http://localhost:3001/*` (for local development)
     - `https://login.candidstudios.net/*` (for production)
   - Web Origins: `+` (allow all redirect URIs)

4. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3001](http://localhost:3001)

## User Roles

Configure these roles in Keycloak Admin Console:

- `admin` - Full access to all portals
- `manager` - Access to analytics, vendor, and operations portals
- `photographer` - Access to photographer portal and file uploads
- `videographer` - Access to photographer portal and file uploads
- `editor` - Access to editor portal for post-production
- `post-production` - Access to editor portal
- `analyst` - Access to analytics dashboard
- `vendor-coordinator` - Access to vendor portal

## Deployment

### Option 1: Railway (Recommended)

1. **Create new Railway project:**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Configure environment variables in Railway:**
   - `NEXT_PUBLIC_KEYCLOAK_URL`
   - `NEXT_PUBLIC_KEYCLOAK_REALM`
   - `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`
   - `NEXT_PUBLIC_APP_URL`

3. **Deploy:**
   ```bash
   railway up
   ```

4. **Add custom domain:**
   - Railway Settings → Networking → Custom Domain
   - Add: `login.candidstudios.net`

### Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_KEYCLOAK_URL production
   vercel env add NEXT_PUBLIC_KEYCLOAK_REALM production
   vercel env add NEXT_PUBLIC_KEYCLOAK_CLIENT_ID production
   vercel env add NEXT_PUBLIC_APP_URL production
   ```

4. **Add custom domain in Vercel dashboard**

### Option 3: Docker

1. **Build Docker image:**
   ```bash
   docker build -t candid-dashboard .
   ```

2. **Run container:**
   ```bash
   docker run -p 3001:3001 \
     -e NEXT_PUBLIC_KEYCLOAK_URL=https://login.candidstudios.net/ \
     -e NEXT_PUBLIC_KEYCLOAK_REALM=CandidStudios \
     -e NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=dashboard \
     -e NEXT_PUBLIC_APP_URL=https://login.candidstudios.net \
     candid-dashboard
   ```

## Project Structure

```
dashboard/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (portal hub)
├── components/            # React components
│   ├── DashboardLayout.tsx # Main layout with header/footer
│   └── PortalCard.tsx     # Portal card component
├── lib/                   # Utilities and configuration
│   ├── keycloak.ts        # Keycloak SSO integration
│   └── portals.ts         # Portal definitions and access control
├── public/                # Static assets
│   └── logo.png           # Candid Studios logo
├── .env.local.example     # Environment variables template
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Customization

### Adding New Portals

Edit `lib/portals.ts`:

```typescript
{
  id: 'new-portal',
  name: 'Portal Name',
  description: 'Portal description',
  url: 'https://portal.candidstudios.net',
  icon: '🎯',
  roles: ['admin', 'role-name'], // Empty array = all users
  category: 'operations',
}
```

### Modifying Styles

Edit `app/globals.css` to change:
- Colors (CSS variables in `:root`)
- Layout spacing
- Card designs
- Responsive breakpoints

## Troubleshooting

### "User not authenticated" error
- Verify Keycloak is running at `login.candidstudios.net`
- Check Keycloak client configuration (redirect URIs)
- Clear browser cache and cookies

### Portals not showing
- Check user has correct roles in Keycloak
- Verify `lib/portals.ts` role assignments

### CORS errors
- Add web origin in Keycloak client settings
- Check `next.config.js` headers configuration

## Support

Need help? Contact [support@candidstudios.net](mailto:support@candidstudios.net)

## License

© 2025 Candid Studios. All rights reserved.
