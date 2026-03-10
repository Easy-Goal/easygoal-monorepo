// ─── UserProfile ──────────────────────────────────────────────────────────────
export type {
  UserRole,
  PlanTier,
  UserCompany,
  UserStats,
  UserPermissions,
  UserProfile,
} from './types/user-profile';

export {
  hasPermission,
  isProducer,
  isSuperAdmin,
} from './types/user-profile';

// ─── Notifications ────────────────────────────────────────────────────────────
export type {
  NotificationType,
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  NotificationCategory,
  NotificationRow,
  Notification,
  CreateNotificationPayload,
  NotificationFilter,
  NotificationState,
  NotificationActions,
  NotificationStore,
} from './types/notifications';
