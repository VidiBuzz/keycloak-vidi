import Keycloak from 'keycloak-js';

// Keycloak configuration for Candid Studios
const keycloakConfig = {
  url: 'https://login.candidstudios.net/',
  realm: 'CandidStudios',
  clientId: 'dashboard', // This client will need to be created in Keycloak
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

/**
 * Initialize Keycloak authentication
 * @returns Promise that resolves to authenticated status
 */
export const initKeycloak = async (): Promise<boolean> => {
  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required', // Redirect to login if not authenticated
      checkLoginIframe: false, // Disable iframe check for better performance
      pkceMethod: 'S256', // Use PKCE for security
    });

    if (authenticated) {
      console.log('User authenticated successfully');
      console.log('Token:', keycloak.token);
      console.log('Refresh token:', keycloak.refreshToken);
    }

    return authenticated;
  } catch (error) {
    console.error('Keycloak initialization failed:', error);
    return false;
  }
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
