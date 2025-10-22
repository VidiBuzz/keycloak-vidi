# Keycloak for Candid Studios

Identity Provider for VidiBlast.net and Candid Studios with Google SSO and custom email themes.

## Features

- 🔐 **Google SSO** - Single sign-on authentication
- 📧 **Custom Email Theme** - Branded email templates for Candid Studios
- 🚀 **Railway Deployment** - Automated deployment via Railway
- 🐘 **PostgreSQL Database** - Persistent storage
- 📊 **Health & Metrics** - Built-in monitoring

## Custom Email Theme

This repository includes a custom email theme (`candid-studios`) with:
- Modern, responsive design
- Purple gradient branding
- Professional email templates for:
  - Email verification
  - Password reset (can be extended)
  - Welcome emails (can be extended)

### Theme Structure

```
themes/candid-studios/
├── theme.properties
└── email/
    ├── html/
    │   └── email-verification.ftl
    └── text/
        └── email-verification.ftl
```

## Deployment

This Keycloak instance is deployed on Railway and automatically builds from this repository.

### Deployment Process

1. Push changes to `main` branch
2. Railway automatically detects changes
3. Docker image is built with custom theme included
4. Keycloak is redeployed with new theme

### Railway Configuration

- **Project**: Keycloak Production
- **Environment**: Production
- **Database**: PostgreSQL (managed by Railway)
- **Domain**: keycloak-production-4dfd.up.railway.app

## Configuration

### Activating the Custom Theme

After deployment:

1. Login to Keycloak Admin Console
   - URL: https://keycloak-production-4dfd.up.railway.app/
   - Credentials: [Stored securely]

2. Select "CandidStudios" Realm

3. Go to: **Realm Settings** → **Themes** tab

4. Set **Email theme** to: `candid-studios`

5. Click **Save**

6. Test by sending a verification email

### Email Settings (Resend.com)

Configure SMTP in **Realm Settings** → **Email**:
- Host: `smtp.resend.com`
- Port: `587`
- From: `noreply@candidstudios.net`
- Auth: Resend API credentials

## Development

### Local Testing

```bash
# Clone repository
git clone https://github.com/VidiBuzz/keycloak-vidi.git
cd keycloak-vidi

# Build Docker image
docker build -t keycloak-candid:local .

# Run locally
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  keycloak-candid:local
```

### Customizing Email Templates

Email templates use FreeMarker (.ftl) format:

- **HTML version**: `themes/candid-studios/email/html/email-verification.ftl`
- **Text version**: `themes/candid-studios/email/text/email-verification.ftl`

Variables available:
- `${user.firstName}` - User's first name
- `${user.lastName}` - User's last name
- `${user.email}` - User's email
- `${link}` - Action link (e.g., verification URL)
- `${realmName}` - Realm name

## Version History

- **v1.1** (2025-10-22) - Added Candid Studios custom email theme
- **v1.0** (2025-10-20) - Initial deployment with Google SSO

## Support

For issues or questions:
- **Email**: support@candidstudios.net
- **Railway Dashboard**: https://railway.com/project/5eac6ae5-eed2-49aa-84d5-05058f760ac8

## License

Internal use only - Candid Studios / VidiBuzz
