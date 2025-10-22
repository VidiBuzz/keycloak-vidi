#!/bin/bash
###############################################################################
# Candid Studios Bulk Staff Import Script
#
# This script imports all active staff from Employees.csv into Keycloak,
# creates user accounts, and sends invitation emails with the beautiful
# custom email theme.
#
# Usage:
#   ./scripts/bulk-import-staff.sh [options]
#
# Options:
#   --dry-run     Preview what would be imported without making changes
#   --test-only   Import only test user (ryanmayiras@gmail.com)
#
# Requirements:
#   - curl
#   - jq (install: brew install jq)
#   - Employees.csv in Downloads folder
###############################################################################

set -e  # Exit on error

# Configuration
KEYCLOAK_URL="https://login.candidstudios.net"
REALM="CandidStudios"
ADMIN_USER="admin"
ADMIN_PASSWORD="2468VidiSmart."
CSV_FILE="$HOME/Downloads/Employees.csv"

# Parse arguments
DRY_RUN=false
TEST_ONLY=false

for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --test-only)
      TEST_ONLY=true
      shift
      ;;
  esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
}

log_header() {
  echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
  echo -e "${BOLD}  $1${NC}"
  echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"
}

# Check dependencies
check_dependencies() {
  log_info "Checking dependencies..."

  if ! command -v curl &> /dev/null; then
    log_error "curl is not installed"
    exit 1
  fi

  if ! command -v jq &> /dev/null; then
    log_error "jq is not installed. Install it with: brew install jq"
    exit 1
  fi

  if [ ! -f "$CSV_FILE" ]; then
    log_error "CSV file not found: $CSV_FILE"
    exit 1
  fi

  log_success "All dependencies found"
}

# Get admin access token
get_token() {
  log_info "Authenticating with Keycloak..."

  local response=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    --data-urlencode "username=${ADMIN_USER}" \
    --data-urlencode "password=${ADMIN_PASSWORD}" \
    --data-urlencode "grant_type=password" \
    --data-urlencode "client_id=admin-cli")

  local token=$(echo "$response" | jq -r '.access_token')

  if [ "$token" = "null" ] || [ -z "$token" ]; then
    log_error "Authentication failed"
    echo "$response" | jq '.'
    exit 1
  fi

  log_success "Authentication successful"
  echo "$token"
}

# Map category to roles
get_roles_for_category() {
  local category="$1"

  case "$category" in
    "Photo")
      echo "photographer"
      ;;
    "Video")
      echo "videographer"
      ;;
    "Photo, Video"|"Video, Photo")
      echo "photographer videographer"
      ;;
    "Photo, Video, Drone"|"Video, Photo, Drone")
      echo "photographer videographer"
      ;;
    "Video, Drone")
      echo "videographer"
      ;;
    "Sales")
      echo "manager"
      ;;
    *)
      echo ""
      ;;
  esac
}

# Create user
create_user() {
  local token="$1"
  local first_name="$2"
  local last_name="$3"
  local email="$4"
  local work_email="$5"
  local category="$6"
  local phone="$7"
  local location="$8"

  local username="${work_email%%@*}"
  local roles=$(get_roles_for_category "$category")

  echo -e "\n${BOLD}Creating user: ${first_name} ${last_name}${NC}"
  echo "  Email: ${email}"
  echo "  Work Email: ${work_email}"
  echo "  Username: ${username}"
  echo "  Category: ${category}"
  echo "  Roles: ${roles:-none (default user)}"
  echo "  Location: ${location}"

  if [ "$DRY_RUN" = true ]; then
    log_warning "  [DRY RUN] Would create user"
    return 0
  fi

  # Create user payload
  local payload=$(jq -n \
    --arg username "$username" \
    --arg email "$work_email" \
    --arg firstName "$first_name" \
    --arg lastName "$last_name" \
    --arg personalEmail "$email" \
    --arg category "$category" \
    --arg phone "$phone" \
    --arg location "$location" \
    '{
      username: $username,
      email: $email,
      firstName: $firstName,
      lastName: $lastName,
      enabled: true,
      emailVerified: false,
      requiredActions: ["VERIFY_EMAIL"],
      attributes: {
        personalEmail: [$personalEmail],
        category: [$category],
        phone: [$phone],
        location: [$location]
      }
    }')

  # Create user
  local response=$(curl -s -w "\n%{http_code}" -X POST \
    "${KEYCLOAK_URL}/admin/realms/${REALM}/users" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "$payload")

  local http_code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "201" ]; then
    log_success "  User created successfully"

    # Get user ID from location header or search
    local user_id=$(curl -s -X GET \
      "${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${username}&exact=true" \
      -H "Authorization: Bearer ${token}" | jq -r '.[0].id')

    if [ -n "$user_id" ] && [ "$user_id" != "null" ]; then
      # Send verification email
      curl -s -X PUT \
        "${KEYCLOAK_URL}/admin/realms/${REALM}/users/${user_id}/send-verify-email" \
        -H "Authorization: Bearer ${token}"

      log_success "  Verification email sent"
    fi

    echo "1"  # Success
  elif [ "$http_code" = "409" ]; then
    log_warning "  User already exists"
    echo "0"  # Already exists
  else
    log_error "  Failed to create user (HTTP ${http_code})"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo "0"  # Failed
  fi
}

# Main execution
main() {
  log_header "Candid Studios Bulk Staff Import"

  if [ "$DRY_RUN" = true ]; then
    log_warning "DRY RUN MODE - No changes will be made\n"
  fi

  if [ "$TEST_ONLY" = true ]; then
    log_warning "TEST MODE - Only test user will be imported\n"
  fi

  # Check dependencies
  check_dependencies

  # Get admin token
  TOKEN=$(get_token)

  # Parse CSV and import users
  log_info "Reading CSV file..."

  local total=0
  local success=0
  local failed=0
  local skipped=0

  # Skip header line and process each row
  while IFS=',' read -r full_name active location meeting_link first_name last_name email work_email category mobile ghl_phone rest; do
    # Clean up fields (remove quotes and trim)
    first_name=$(echo "$first_name" | sed 's/"//g' | xargs)
    last_name=$(echo "$last_name" | sed 's/"//g' | xargs)
    email=$(echo "$email" | sed 's/"//g' | xargs)
    work_email=$(echo "$work_email" | sed 's/"//g' | xargs)
    category=$(echo "$category" | sed 's/"//g' | xargs)
    active=$(echo "$active" | sed 's/"//g' | xargs)
    location=$(echo "$location" | sed 's/"//g' | xargs)
    mobile=$(echo "$mobile" | sed 's/"//g' | xargs)

    # Skip if not active or no email
    if [ "$active" != "Yes" ] || [ -z "$email" ]; then
      continue
    fi

    # Test mode filter
    if [ "$TEST_ONLY" = true ] && [[ ! "$email" =~ "ryanmayiras@gmail.com" ]]; then
      continue
    fi

    ((total++))

    # Create user
    result=$(create_user "$TOKEN" "$first_name" "$last_name" "$email" "$work_email" "$category" "$mobile" "$location")

    if [ "$result" = "1" ]; then
      ((success++))
    elif [ "$result" = "0" ]; then
      ((skipped++))
    else
      ((failed++))
    fi

    # Small delay to avoid rate limiting
    sleep 0.5

  done < <(tail -n +2 "$CSV_FILE")  # Skip header

  # Summary
  log_header "Import Summary"
  echo "  Total employees: ${total}"
  log_success "Successful: ${success}"
  log_warning "Skipped (already exist): ${skipped}"
  log_error "Failed: ${failed}"
  echo

  if [ "$DRY_RUN" = false ] && [ "$success" -gt 0 ]; then
    log_success "Import complete! Users will receive beautiful invitation emails.\n"
  fi
}

# Run main function
main
