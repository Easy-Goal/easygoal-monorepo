'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { AuthProviderConfig, AuthContextValue } from '../types';

const AuthContext = createContext<AuthContextValue>({
  session: null,
  isReady: false,
  signOut: async () => {},
});

export function useAuthSession() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
  config: AuthProviderConfig;
  supabaseClient: SupabaseClient;
}

export function AuthProvider({ children, config, supabaseClient }: AuthProviderProps) {
  const {
    loginUrl,
    appUrl,
    callbackPath = '/auth/callback',
    defaultRedirect = '/dashboard',
    loadingComponent,
  } = config;

  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  const redirectToLogin = useCallback(
    (next?: string) => {
      const redirectTarget = next || defaultRedirect;
      const callbackUrl = `${appUrl}${callbackPath}?next=${encodeURIComponent(redirectTarget)}`;
      const url = `${loginUrl}/auth/login?redirect_to=${encodeURIComponent(callbackUrl)}`;
      window.location.href = url;
    },
    [loginUrl, appUrl, callbackPath, defaultRedirect]
  );

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        setSession(currentSession);
        setIsReady(true);
      } else {
        redirectToLogin(window.location.pathname);
      }
    });
  }, [supabaseClient.auth, redirectToLogin]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(currentSession);
        setIsReady(true);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        redirectToLogin();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient.auth, redirectToLogin]);

  const signOut = useCallback(async () => {
    await supabaseClient.auth.signOut();
    redirectToLogin();
  }, [supabaseClient.auth, redirectToLogin]);

  if (!isReady) {
    return (
      <>
        {loadingComponent || (
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
      </>
    );
  }

  return (
    <AuthContext.Provider value={{ session, isReady, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
