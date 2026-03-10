import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';

export interface AuthProviderConfig {
  /** SSO login URL (e.g. https://sso.easygoal.com.br) */
  loginUrl: string;
  /** This app's public URL */
  appUrl: string;
  /** Path for auth callback (default: /auth/callback) */
  callbackPath?: string;
  /** Default redirect after login (default: /dashboard) */
  defaultRedirect?: string;
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Future: API key for third-party app authentication */
  apiKey?: string;
  /** Future: Requested scopes */
  scopes?: string[];
}

export interface AuthContextValue {
  session: Session | null;
  isReady: boolean;
  signOut: () => Promise<void>;
}

// ─── Tipos de domínio EasyGoal ─────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role_id: string | null;
  role_name: string | null;
  permissions: string[];
  is_super_admin: boolean;
  is_producer: boolean;
  producer_id: string | null;
  provider: string | null;
  phone_number: string | null;
}

export interface AuthCompany {
  id: string;
  name: string;
  cnpj: string | null;
  plan: string | null;
}

export interface AuthStats {
  saas_products_count: number;
  active_services_count: number;
}

export interface AuthData {
  user: AuthUser;
  company: AuthCompany | null;
  stats: AuthStats | null;
}

// ─── Notificações (Header UI) ──────────────────────────────────────────────────

/**
 * Formato canônico consumido pelo componente NotificationBell do @easygoal/ui.
 * Mapeado a partir do NotificationRow do banco via useNotifications.
 */
export interface HeaderNotification {
  id: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
  actionUrl?: string | null;
}

export interface CallbackConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  ssoUrl?: string;
  appUrl?: string;
  /** Server-side API key para verificar eg_token via SSO /auth/verify */
  apiKey?: string;
}

export interface MiddlewareConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}
