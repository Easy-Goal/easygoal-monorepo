import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { A as AuthProviderConfig, a as AuthContextValue } from './server-WNGamoLv.js';
export { b as AuthCompany, c as AuthData, d as AuthStats, e as AuthUser, C as CallbackConfig, M as MiddlewareConfig, f as createCallbackRoute, g as defaultMatcherConfig, h as handleAuthCallback, u as updateSession } from './server-WNGamoLv.js';
import 'next/server';

declare function useAuthSession(): AuthContextValue;
interface AuthProviderProps {
    children: ReactNode;
    config: AuthProviderConfig;
    supabaseClient: SupabaseClient;
}
declare function AuthProvider({ children, config, supabaseClient }: AuthProviderProps): react_jsx_runtime.JSX.Element;

export { AuthContextValue, AuthProvider, AuthProviderConfig, useAuthSession };
