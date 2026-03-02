// ===============================
// CLIENT ENTRY (React only)
// ===============================

// Providers
export { AuthProvider, useAuthSession } from './providers/AuthProvider';

// Hooks
export { useSSOLogin } from './hooks/useSSOLogin';
export type { SSOLoginConfig } from './hooks/useSSOLogin';

// Types (seguros para client)
export type {
  AuthCompany, AuthContextValue, AuthData, AuthProviderConfig, AuthStats, AuthUser
} from './types';
