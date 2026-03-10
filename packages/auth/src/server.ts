// ===============================
// SERVER ENTRY (Edge-safe)
// ===============================

// Callback
export { handleAuthCallback } from './callback/handler';
export { createCallbackRoute } from './callback/route';

// Signout
export { createSignoutRoute, handleSignout } from './signout/handler';

// Session
export { handleSession } from './session/handler';
export { createSessionRoute } from './session/route';

// Middleware
export { defaultMatcherConfig, updateSession } from './middleware/updateSession';

// Types (seguros)
export type {
  AuthCompany, AuthData, AuthStats, AuthUser, CallbackConfig,
  MiddlewareConfig
} from './types';
