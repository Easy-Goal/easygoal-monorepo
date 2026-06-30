"use client";

import { useEgSession, useNotifications, useSSOLogin } from "@easygoal/packages/auth/client";
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Logo } from "../Logo";
import { NotificationBell } from "./NotificationBell";

// --- Interfaces ---
export interface HeaderNavLink {
  label: string;
  href: string;
}

export interface EasyHeaderProps {
  logoSuffix?: string;
  logoVariant?: "dark" | "light" | "theme";
  navLinks?: HeaderNavLink[];
  ctaSlot?: React.ReactNode;
  className?: string;
  config: {
    ssoUrl: string;
    apiKey: string;
    docsUrl?: string;
    appUrl?: string;
    /** Path do endpoint de notificações. Default: '/api/notifications' */
    notificationsPath?: string;
  };
}

// --- Componente Interno do Menu do Usuário ---
function HeaderUserMenu({ config }: { config: EasyHeaderProps["config"] }) {
  const { user, isReady } = useEgSession();
  const { logout } = useSSOLogin({
    ssoUrl: config.ssoUrl,
    apiKey: config.apiKey,
  });
  const { notifications, markAsRead, markAllAsRead, dismiss } = useNotifications({
    path: config.notificationsPath ?? '/api/notifications',
  });

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper para links absolutos
  const getAppUrl = (path: string) => {
    const baseUrl = config.appUrl || "https://app.easygoal.com.br";
    return `${baseUrl}${path}`;
  };

  if (!isReady || !user) return null;

  return (
    <div className="flex items-center gap-4">
      {/* Notificações Globais */}
      <NotificationBell
        notifications={notifications}
        onMarkRead={markAsRead}
        onMarkAllRead={markAllAsRead}
        onDelete={dismiss}
        allNotificationsUrl={getAppUrl("/notifications")}
      />

      <div ref={containerRef} className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-2 py-1.5 transition-colors hover:bg-foreground/5 rounded-lg">
          <div className="h-8 w-8 rounded-full border border-orange-500/20 bg-orange-500/10 overflow-hidden shrink-0">
            <img src={user.avatarUrl ?? ""} className="h-full w-full object-cover" alt="" />
          </div>
          <span className="hidden sm:block text-foreground/90 text-sm font-medium">{user.name?.split(" ")[0]}</span>
          <ChevronDown className="h-4 w-4 text-foreground/30" />
        </button>

        {isOpen && (
          /* CORREÇÃO DE TRANSPARÊNCIA: Adicionado bg sólido e shadow pesado */
          <div className="absolute right-0 top-full z-[100] mt-2 w-64 rounded-xl border border-border bg-popover p-1.5 shadow-lg">
            <div className="px-3 py-3 border-b border-border/50">
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
            </div>

            <div className="py-1">
              <a href={getAppUrl("/dashboard")} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-foreground/5">
                <LayoutDashboard className="h-4 w-4 opacity-50" /> Painel Principal
              </a>
              <a href={getAppUrl("/settings/profile")} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-foreground/5">
                <Settings className="h-4 w-4 opacity-50" /> Editar Perfil
              </a>
              <a href={config.docsUrl || "https://docs.easygoal.com.br"} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-foreground/5">
                <BookOpen className="h-4 w-4 opacity-50" /> Documentação
              </a>
            </div>

            <div className="border-t border-border/50 pt-1">
              <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-400/10">
                <LogOut className="h-4 w-4" /> Sair da conta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// --- Componente Principal EasyHeader ---
// packages/ui/src/components/Header/EasyHeader.tsx

export function EasyHeader({
  logoSuffix,
  logoVariant = "dark",
  navLinks = [],
  ctaSlot,
  className,
  config,
}: EasyHeaderProps) {
  const { user, isReady } = useEgSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      } ${className}`}>

      {/* 1. CONTAINER COM PADDING COERENTE (px-6 ou px-8) */}
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-8">

        {/* 2. LOGO COM ÁREA DE CLIQUE E RESPIRO */}
        <a href="/" className="flex items-center gap-3 no-underline shrink-0 mr-4">
          <Logo variant={logoVariant} width={108} />
          {logoSuffix && (
            <div className="flex items-center gap-2 font-mono text-sm border-l border-border/40 pl-3">
              <span className="opacity-40">{logoSuffix}</span>
            </div>
          )}
        </a>

        {/* 3. NAVEGAÇÃO COM FLEX E GAP REAL (gap-8 ou gap-10) */}
        {navLinks.length > 0 && (
          <nav className="hidden md:flex items-center justify-center gap-10 flex-1 px-4">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-foreground/55 no-underline transition-all hover:text-foreground hover:scale-105"
              >
                {label}
              </a>
            ))}
          </nav>
        )}

        {/* 4. LADO DIREITO (PERFIL / CTAS) */}
        <div className="flex items-center gap-4 shrink-0 ml-4">
          {user ? (
            <HeaderUserMenu config={config} />
          ) : (
            isReady && ctaSlot
          )}
        </div>
      </div>
    </header>
  );
}