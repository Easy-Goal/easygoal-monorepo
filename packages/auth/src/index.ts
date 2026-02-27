// ===============================
// CLIENT ENTRY (React only)
// ===============================

// Providers
export { AuthProvider, useAuthSession } from './providers/AuthProvider';

// Types (seguros para client)
export type {
  AuthCompany, AuthContextValue, AuthData, AuthProviderConfig, AuthStats, AuthUser
} from './types';
