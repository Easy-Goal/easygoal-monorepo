// ===============================
// SERVER ENTRY (Edge-safe)
// ===============================

// Callback
export { handleAuthCallback } from './callback/handler';
export { createCallbackRoute } from './callback/route';

// Middleware
export { defaultMatcherConfig, updateSession } from './middleware/updateSession';

// Types (seguros)
export type {
  AuthCompany, AuthData, AuthStats, AuthUser, CallbackConfig,
  MiddlewareConfig
} from './types';
