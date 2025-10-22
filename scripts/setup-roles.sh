#!/bin/bash
###############################################################################
# Candid Studios Keycloak Role Setup Script
#
# This script creates all required realm roles in Keycloak for the
# Candid Studios portal hub.
#
# Usage:
#   ./scripts/setup-roles.sh
#
# Roles Created:
#   - admin: Full access to all portals
#   - manager: Analytics and operations access
#   - photographer: Photo uploads and bookings
#   - videographer: Video uploads and bookings
#   - editor: Post-production access
#   - post-production: Editing workflows
#   - analyst: Analytics dashboard only
#   - vendor-coordinator: Vendor management
###############################################################################

set -e

# Configuration
KEYCLOAK_URL="https://login.candidstudios.net"
REALM="CandidStudios"
ADMIN_USER="admin"
ADMIN_PASSWORD="2468VidiSmart."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  Candid Studios Role Setup${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

# Get admin token
log_info "Authenticating with Keycloak..."
TOKEN=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "username=${ADMIN_USER}" \
  --data-urlencode "password=${ADMIN_PASSWORD}" \
  --data-urlencode "grant_type=password" \
  --data-urlencode "client_id=admin-cli" | jq -r '.access_token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  log_error "Authentication failed"
  exit 1
fi
log_success "Authentication successful\n"

# Define roles as arrays
ROLE_NAMES=("admin" "manager" "photographer" "videographer" "editor" "post-production" "analyst" "vendor-coordinator")
ROLE_DESCS=(
  "Full administrative access to all portals and system configuration"
  "Access to analytics, vendor management, and operational portals"
  "Photographer portal access for photo uploads and bookings"
  "Video uploads, project management, and file access"
  "Post-production and editing portal access"
  "Editing workflows, rendering, and delivery"
  "Analytics dashboard and reporting access"
  "Vendor and venue management portal access"
)

# Create each role
log_info "Creating realm roles...\n"
SUCCESS=0
SKIPPED=0

for i in "${!ROLE_NAMES[@]}"; do
  role="${ROLE_NAMES[$i]}"
  description="${ROLE_DESCS[$i]}"

  echo -e "${BOLD}Creating role: ${role}${NC}"
  echo "  Description: ${description}"

  payload=$(jq -n \
    --arg name "$role" \
    --arg desc "$description" \
    '{
      name: $name,
      description: $desc,
      composite: false,
      clientRole: false
    }')

  response=$(curl -s -w "\n%{http_code}" -X POST \
    "${KEYCLOAK_URL}/admin/realms/${REALM}/roles" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$payload")

  http_code=$(echo "$response" | tail -n1)

  if [ "$http_code" = "201" ]; then
    log_success "  Role created successfully\n"
    ((SUCCESS++))
  elif [ "$http_code" = "409" ]; then
    log_warning "  Role already exists\n"
    ((SKIPPED++))
  else
    log_error "  Failed to create role (HTTP ${http_code})\n"
  fi
done

# Summary
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  Summary${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"
echo "  Total roles: ${#ROLE_NAMES[@]}"
log_success "Created: ${SUCCESS}"
log_warning "Already existed: ${SKIPPED}"
echo

log_success "Role setup complete!\n"
