// Server/Edge-safe exports only — sem React, sem createContext
// Use este entry point no Next.js middleware e em route handlers

export { handleAuthCallback } from './callback/handler';
export { createCallbackRoute } from './callback/route';
export { updateSession, defaultMatcherConfig } from './middleware/updateSession';

export type {
  CallbackConfig,
  MiddlewareConfig,
  AuthUser,
  AuthCompany,
  AuthStats,
  AuthData,
} from './types';
