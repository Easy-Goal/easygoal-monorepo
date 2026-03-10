/**
 * @easygoal/auth - Client entry (browser-safe)
 */

// SSO Session Provider
export { EgSessionProvider, useEgSession } from './providers/EgSessionProvider';
export type { EgSessionUser, EgSessionContextValue, EgSessionConfig } from './providers/EgSessionProvider';

// SSO Login/Logout hook
export { useSSOLogin } from './hooks/useSSOLogin';
export type { SSOLoginConfig } from './hooks/useSSOLogin';

// Supabase-based Auth Provider (opcional)
export { AuthProvider, useAuthSession } from './providers/AuthProvider';
