/**
 * @easygoal/auth - Client entry (browser-safe)
 */

// SSO Session Provider
export { EgSessionProvider, useEgSession } from './providers/EgSessionProvider';
export type { EgSessionUser, EgSessionContextValue, EgSessionConfig } from './providers/EgSessionProvider';

// SSO Login/Logout hook
export { useSSOLogin } from './hooks/useSSOLogin';
export type { SSOLoginConfig } from './hooks/useSSOLogin';

// Notifications hook
export { useNotifications } from './hooks/useNotifications';
export type { UseNotificationsConfig, UseNotificationsReturn } from './hooks/useNotifications';

// Notification types
export type { HeaderNotification } from './types';

// Supabase-based Auth Provider (opcional)
export { AuthProvider, useAuthSession } from './providers/AuthProvider';
