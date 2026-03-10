/**
 * @easygoal/core — UserProfile
 *
 * Interface unificada de perfil de usuário para consumo em todos os apps
 * do ecossistema EasyGoal. Não depende de @supabase/supabase-js.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'admin' | 'producer' | 'member' | 'guest';

export type PlanTier = 'free' | 'basic' | 'pro' | 'enterprise';

// ─── Sub-entidades ─────────────────────────────────────────────────────────────

export interface UserCompany {
  id: string;
  name: string;
  cnpj: string | null;
  plan: PlanTier | null;
}

export interface UserStats {
  saas_products_count: number;
  active_services_count: number;
}

export interface UserPermissions {
  role: UserRole;
  role_id: string | null;
  permissions: string[];
  is_super_admin: boolean;
  is_producer: boolean;
}

// ─── UserProfile (interface unificada) ────────────────────────────────────────

/**
 * Perfil canônico do usuário. É a fonte de verdade que todos os apps devem
 * usar. Gerado pelo @easygoal/auth a partir do payload do SSO.
 */
export interface UserProfile {
  // Identidade
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  phone_number: string | null;
  provider: string | null;

  // Acesso e papéis
  access: UserPermissions;

  // Contexto de negócio
  company: UserCompany | null;
  stats: UserStats | null;

  // Metadados de sessão
  producer_id: string | null;
}

// ─── Helpers de tipo ──────────────────────────────────────────────────────────

/** Guard: usuário tem permissão específica */
export function hasPermission(profile: UserProfile, permission: string): boolean {
  return (
    profile.access.is_super_admin ||
    profile.access.permissions.includes(permission)
  );
}

/** Guard: usuário é produtor */
export function isProducer(profile: UserProfile): boolean {
  return profile.access.is_producer;
}

/** Guard: usuário é super admin */
export function isSuperAdmin(profile: UserProfile): boolean {
  return profile.access.is_super_admin;
}
