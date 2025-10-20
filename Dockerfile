# Keycloak v26.0.7 for Railway Deployment
# Deploy Version: 1.0
# Date: 2025-10-20
# Purpose: Identity Provider for VidiBlast.net with Google SSO

FROM quay.io/keycloak/keycloak:26.0.7

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
