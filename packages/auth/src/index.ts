// Providers
export { AuthProvider, useAuthSession } from './providers/AuthProvider';

// Types
export type {
  AuthProviderConfig,
  AuthContextValue,
  AuthUser,
  AuthCompany,
  AuthStats,
  AuthData,
  CallbackConfig,
  MiddlewareConfig,
} from './types';

// Callback
export { handleAuthCallback } from './callback/handler';
export { createCallbackRoute } from './callback/route';

// Middleware
export { updateSession, defaultMatcherConfig } from './middleware/updateSession';
