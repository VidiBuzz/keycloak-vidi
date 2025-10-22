import Keycloak from 'keycloak-js';

// Keycloak configuration for Candid Studios
const keycloakConfig = {
  url: 'https://login.candidstudios.net/',
  realm: 'CandidStudios',
  clientId: 'dashboard', // This client will need to be created in Keycloak
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Track initialization state
let isInitialized = false;
let initPromise: Promise<boolean> | null = null;

/**
 * Initialize Keycloak authentication
 * @returns Promise that resolves to authenticated status
 */
export const initKeycloak = async (): Promise<boolean> => {
  // If already initialized, return true
  if (isInitialized) {
    return keycloak.authenticated || false;
  }

  // If initialization is in progress, return the existing promise
  if (initPromise) {
    return initPromise;
  }

  // Start new initialization
  initPromise = (async () => {
    try {
      const authenticated = await keycloak.init({
        onLoad: 'login-required', // Redirect to login if not authenticated
        checkLoginIframe: false, // Disable iframe check for better performance
        pkceMethod: 'S256', // Use PKCE for security
      });

      isInitialized = true;

      if (authenticated) {
        console.log('User authenticated successfully');
        console.log('User roles:', getUserRoles());
        console.log('Token parsed:', keycloak.tokenParsed);
      }

      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      isInitialized = false;
      initPromise = null;
      return false;
    }
  })();

  return initPromise;
};

/**
 * Get user roles from Keycloak token
 * @returns Array of role names
 */
export const getUserRoles = (): string[] => {
  if (!keycloak.tokenParsed) return [];

  const roles = keycloak.tokenParsed.realm_access?.roles || [];
  return roles;
};

/**
 * Check if user has a specific role
 * @param role - Role name to check
 * @returns Boolean indicating if user has the role
 */
export const hasRole = (role: string): boolean => {
  return getUserRoles().includes(role);
};

/**
 * Get user information from Keycloak token
 * @returns User profile object
 */
export const getUserProfile = () => {
  if (!keycloak.tokenParsed) return null;

  return {
    id: keycloak.tokenParsed.sub,
    email: keycloak.tokenParsed.email,
    firstName: keycloak.tokenParsed.given_name,
    lastName: keycloak.tokenParsed.family_name,
    fullName: keycloak.tokenParsed.name,
    username: keycloak.tokenParsed.preferred_username,
    roles: getUserRoles(),
  };
};

/**
 * Logout user from Keycloak
 */
export const logout = () => {
  keycloak.logout({
    redirectUri: window.location.origin,
  });
};

/**
 * Update token if it's about to expire
 * @param minValidity - Minimum validity in seconds
 * @returns Promise that resolves to token update status
 */
export const updateToken = async (minValidity = 30): Promise<boolean> => {
  try {
    const refreshed = await keycloak.updateToken(minValidity);
    if (refreshed) {
      console.log('Token refreshed');
    }
    return refreshed;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};

export default keycloak;
