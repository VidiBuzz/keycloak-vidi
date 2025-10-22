# Candid Studios Dashboard Setup Guide

Complete step-by-step guide for deploying the Candid Studios Portal Hub.

## Prerequisites Checklist

- [x] Keycloak running at `login.candidstudios.net`
- [x] Custom email theme deployed (pending PR merge)
- [x] Custom login theme deployed (pending PR merge)
- [ ] Keycloak client `dashboard` created
- [ ] User roles configured in Keycloak
- [ ] Dashboard deployed to Railway/Vercel

## Part 1: Configure Keycloak Client

### Step 1: Login to Keycloak Admin Console

1. Go to https://login.candidstudios.net/admin/
2. Login with: `support@candidstudios.net` / `Snoboard19`
3. Select **CandidStudios** realm from dropdown

### Step 2: Create Dashboard Client

1. Navigate to **Clients** → **Create**
2. Fill in client details:
   ```
   Client ID: dashboard
   Name: Candid Studios Dashboard
   Description: Central portal hub for SSO access
   Always Display in Console: OFF
   ```
3. Click **Save**

### Step 3: Configure Client Settings

**General Settings:**
- Client authentication: `OFF` (public client)
- Standard flow: `ON`
- Direct access grants: `OFF`
- Implicit flow: `OFF`

**Access Settings:**
- Root URL: `https://login.candidstudios.net`
- Home URL: `https://login.candidstudios.net`
- Valid redirect URIs:
  ```
  http://localhost:3001/*
  https://login.candidstudios.net/*
  ```
- Valid post logout redirect URIs: `https://login.candidstudios.net/*`
- Web origins: `+` (allow all configured redirect URIs)

**Advanced Settings:**
- OAuth 2.0 Device Authorization Grant: `OFF`
- OIDC CIBA Grant: `OFF`
- PKCE Code Challenge Method: `S256` (recommended)

Click **Save**

## Part 2: Configure User Roles

### Step 1: Create Realm Roles

Navigate to **Realm Roles** → **Create Role**

Create these roles:

1. **admin**
   - Description: Full administrative access to all portals
   - Composite: No

2. **manager**
   - Description: Access to analytics and operational portals
   - Composite: No

3. **photographer**
   - Description: Photographer portal access for uploads
   - Composite: No

4. **videographer**
   - Description: Video uploads and project management
   - Composite: No

5. **editor**
   - Description: Post-production and editing portal access
   - Composite: No

6. **post-production**
   - Description: Editing and rendering workflows
   - Composite: No

7. **analyst**
   - Description: Analytics dashboard access
   - Composite: No

8. **vendor-coordinator**
   - Description: Vendor and venue management
   - Composite: No

### Step 2: Assign Roles to Users

1. Go to **Users** → Select user
2. Navigate to **Role Mappings** tab
3. Click **Assign role**
4. Select appropriate roles from list
5. Click **Assign**

**Example Role Assignments:**
- Ryan (support@candidstudios.net): `admin`
- Photographers: `photographer`, `videographer`
- Editors: `editor`, `post-production`
- Managers: `manager`, `analyst`

## Part 3: Deploy Dashboard

### Option A: Deploy to Railway (Recommended)

1. **Push dashboard to your fork:**
   ```bash
   cd /Users/ryanmayiras/keycloak-vidi
   git add dashboard/
   git commit -m "Add Candid Studios portal hub dashboard"
   git push origin main
   ```

2. **Create new Railway service:**
   - Go to https://railway.com/project/5eac6ae5-eed2-49aa-84d5-05058f760ac8
   - Click **+ New** → **Empty Service**
   - Name: `candid-dashboard`

3. **Connect GitHub repository:**
   - Click service → **Settings** → **Source**
   - Connect to `support318/keycloak-vidi` repository
   - Set root directory: `/dashboard`
   - Click **Deploy**

4. **Configure environment variables:**
   - Go to **Variables** tab
   - Add these variables:
     ```
     NEXT_PUBLIC_KEYCLOAK_URL=https://login.candidstudios.net/
     NEXT_PUBLIC_KEYCLOAK_REALM=CandidStudios
     NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=dashboard
     NEXT_PUBLIC_APP_URL=https://login.candidstudios.net
     PORT=3001
     NODE_ENV=production
     ```

5. **Configure custom domain:**
   - Go to **Settings** → **Networking**
   - Click **Add Custom Domain**
   - Enter: `login.candidstudios.net`
   - Railway will provide CNAME target

6. **Update Cloudflare DNS:**
   - Go to Cloudflare dashboard for `candidstudios.net`
   - Edit existing CNAME record for `login`
   - Change target to Railway's CNAME (e.g., `candid-dashboard.railway.app`)
   - Keep proxy enabled (orange cloud)

7. **Wait for deployment:**
   - Railway will build and deploy automatically
   - Check **Deployments** tab for status
   - Look for "Deploy successful" message

### Option B: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy dashboard:**
   ```bash
   cd /Users/ryanmayiras/keycloak-vidi/dashboard
   vercel
   ```

3. **Configure environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_KEYCLOAK_URL production
   # Enter: https://login.candidstudios.net/

   vercel env add NEXT_PUBLIC_KEYCLOAK_REALM production
   # Enter: CandidStudios

   vercel env add NEXT_PUBLIC_KEYCLOAK_CLIENT_ID production
   # Enter: dashboard

   vercel env add NEXT_PUBLIC_APP_URL production
   # Enter: https://login.candidstudios.net
   ```

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

5. **Add custom domain:**
   - Go to Vercel dashboard → Project → Settings → Domains
   - Add: `login.candidstudios.net`
   - Update Cloudflare DNS to point to Vercel

## Part 4: Testing

### Test 1: Authentication Flow

1. Go to https://login.candidstudios.net
2. You should be redirected to Keycloak login
3. Login with your credentials
4. You should see the dashboard with portal cards

### Test 2: Role-Based Access

1. Login as admin user
2. Verify you see ALL portals:
   - Analytics Dashboard
   - Referral Program
   - Vendor Portal
   - Photographer Portal
   - Client Portal
   - Editor Portal
   - Admin Console

2. Login as photographer user
3. Verify you see only:
   - Referral Program (all users)
   - Photographer Portal
   - Client Portal (all users)

### Test 3: Portal Links

1. Click each portal card
2. Verify external portals open (may show separate login for now)
3. Admin Console should open in new tab

### Test 4: Logout

1. Click **Logout** button
2. Should redirect to Keycloak logout
3. Should clear session
4. Accessing dashboard again should require re-login

## Part 5: Bulk User Import (After Theme Merge)

Once dad merges the Keycloak theme PR tomorrow:

1. **Configure themes in Keycloak:**
   - Login to Admin Console
   - CandidStudios Realm → Realm Settings → Themes
   - Login theme: `candid-studios`
   - Email theme: `candid-studios`
   - Click **Save**

2. **Test invitation email:**
   ```bash
   # Get fresh admin token
   curl -X POST 'https://login.candidstudios.net/realms/master/protocol/openid-connect/token' \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -d 'username=support@candidstudios.net' \
     -d 'password=Snoboard19' \
     -d 'grant_type=password' \
     -d 'client_id=admin-cli' > /tmp/keycloak_token.json

   # Extract token
   TOKEN=$(cat /tmp/keycloak_token.json | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

   # Test with your email
   curl -X POST 'https://login.candidstudios.net/admin/realms/CandidStudios/users' \
     -H 'Authorization: Bearer '$TOKEN \
     -H 'Content-Type: application/json' \
     -d '{
       "username": "test-user",
       "email": "ryanmayiras@gmail.com",
       "firstName": "Test",
       "lastName": "User",
       "enabled": true,
       "emailVerified": false,
       "requiredActions": ["VERIFY_EMAIL"]
     }'
   ```

3. **Verify email looks correct** (modern purple gradient design)

4. **Run bulk import script:**
   ```bash
   # Create import script
   # (Script to be created based on Employees.csv)
   ```

## Troubleshooting

### Dashboard shows blank page
- Check browser console for errors
- Verify Keycloak client redirect URIs include dashboard URL
- Check environment variables are set correctly

### "User is not authenticated" error
- Clear browser cookies
- Check Keycloak is accessible at `login.candidstudios.net`
- Verify dashboard client is enabled in Keycloak

### CORS errors in console
- Add web origin in Keycloak client settings
- Set to `+` to allow all redirect URIs

### Portals not showing
- Check user has correct roles assigned
- Verify `lib/portals.ts` role requirements
- Check browser console for errors

### Railway deployment fails
- Check Dockerfile builds locally: `docker build -t dashboard .`
- Verify environment variables are set
- Check Railway logs for error messages

## Next Steps

1. ✅ Wait for dad to merge Keycloak theme PR
2. ✅ Configure email/login themes in Keycloak
3. ✅ Test invitation emails
4. ✅ Import all 32 staff members
5. ⬜ Integrate existing portals (analytics, referral) with Keycloak SSO
6. ⬜ Build future portals (vendor, photographer, client, editor)

## Support

Need help? Contact:
- Email: support@candidstudios.net
- Check Railway/Vercel logs for deployment issues
- Review Keycloak admin console for configuration problems

---

**Last Updated:** 2025-10-22
**Author:** Ryan Mayiras / Claude Code
**Version:** 1.0
