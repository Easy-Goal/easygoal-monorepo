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

// Notifications (server)
export { createNotificationsRoute } from './notifications/route';
export { handleGetNotifications, handleMarkNotificationsRead, handleDeleteNotification } from './notifications/handler';
export type { NotificationsConfig } from './notifications/handler';

// Types (seguros)
export type {
  AuthCompany, AuthData, AuthStats, AuthUser, CallbackConfig,
  MiddlewareConfig, HeaderNotification
} from './types';
