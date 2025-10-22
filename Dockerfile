# Keycloak v26.0.7 for Railway Deployment
# Deploy Version: 1.1
# Date: 2025-10-22
# Purpose: Identity Provider for VidiBlast.net with Google SSO
# Update: Added Candid Studios custom email theme

FROM quay.io/keycloak/keycloak:26.0.7

# Copy custom email theme for Candid Studios
COPY themes/candid-studios /opt/keycloak/themes/candid-studios

# Set production environment defaults
ENV KC_DB=postgres \
    KC_HEALTH_ENABLED=true \
    KC_METRICS_ENABLED=true \
    KC_LOG_LEVEL=info

# Build optimized for production
RUN /opt/keycloak/bin/kc.sh build

# Entrypoint
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

# Start in dev mode initially for easier configuration
# Will switch to production mode after initial setup
CMD ["start-dev"]
