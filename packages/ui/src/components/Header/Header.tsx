"use client";

import { useEgSession, useSSOLogin } from "@easygoal/packages/auth/client";
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  Lock,
  LogOut,
  Settings
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Logo } from "../Logo";

export interface HeaderNavLink {
  label: string;
  href: string;
}

export interface EasyHeaderProps {
  logoSuffix?: string;
  logoVariant?: "dark" | "light";
  navLinks?: HeaderNavLink[];
  ctaSlot?: React.ReactNode;
  className?: string;
  config: {
    ssoUrl: string;
    apiKey: string;
    docsUrl?: string;
    appUrl?: string; // Fundamental para o redirecionamento centralizado
  };
}

function HeaderUserMenu({ config }: { config: EasyHeaderProps["config"] }) {
  const { user, isReady } = useEgSession();
  const { login, logout } = useSSOLogin({
    ssoUrl: config.ssoUrl,
    apiKey: config.apiKey,
    logoutPath: "/api/auth/signout",
  });

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper para garantir que links de perfil sempre apontem para o App Principal
  const getAppUrl = (path: string) => {
    const baseUrl = config.appUrl || "https://app.easygoal.com.br";
    return `${baseUrl}${path}`;
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isReady) return <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />;

  if (!user) {
    return (
      <button
        onClick={login}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
      >
        Entrar
      </button>
    );
  }

  const isOAuthUser = user.provider && user.provider !== "email";
  const initials = user.name
    ? user.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
    : (user.email?.[0] ?? "?").toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20 overflow-hidden shrink-0">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} className="h-full w-full object-cover" alt="" />
          ) : (
            <span className="text-[10px] font-bold text-orange-500">{initials}</span>
          )}
        </div>
        <span className="hidden max-w-[100px] truncate font-medium sm:block text-white/90">
          {user.name?.split(" ")[0]}
        </span>
        <ChevronDown className={`h-4 w-4 text-white/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/10 bg-[#1e2536] p-1.5 shadow-2xl">
          {/* Identidade */}
          <div className="px-3 py-3 border-b border-white/5">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-[11px] text-white/40">{user.email}</p>
          </div>

          {/* Navegação de Ecossistema */}
          <div className="py-1 border-b border-white/5">
            <a href={getAppUrl("/dashboard")} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors">
              <LayoutDashboard className="h-4 w-4 opacity-50" /> Painel Principal
            </a>
          </div>

          {/* Configurações Centrais */}
          <div className="py-1 border-b border-white/5">
            <div className="px-3 py-1.5 text-[10px] font-bold text-white/20 uppercase tracking-wider">
              Configurações
            </div>
            <a href={getAppUrl("/settings/profile")} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5">
              <Settings className="h-4 w-4 opacity-50" /> Editar Perfil
            </a>
            {!isOAuthUser && (
              <a href={getAppUrl("/settings/security")} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5">
                <Lock className="h-4 w-4 opacity-50" /> Segurança
              </a>
            )}
            {isOAuthUser && (
              <div className="px-3 py-2 text-[10px] font-bold uppercase text-white/10">via {user.provider}</div>
            )}
          </div>

          {/* Ajuda e Sair */}
          <div className="py-1">
            <a href={config.docsUrl || "https://docs.easygoal.com.br"} target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5">
              <BookOpen className="h-4 w-4 opacity-50" /> Documentação
            </a>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors">
              <LogOut className="h-4 w-4" /> Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function EasyHeader({
  logoSuffix,
  logoVariant = "dark",
  navLinks = [],
  ctaSlot,
  className,
  config
}: EasyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? "bg-[#0d1117]/95 backdrop-blur-md border-b border-white/5" : "bg-transparent"} ${className}`}>
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <a href="/" className="flex items-center gap-1.5 no-underline shrink-0">
          <Logo variant={logoVariant} width={108} />
          {logoSuffix && (
            <div className="flex items-center gap-1 font-mono text-sm">
              <span className="text-lg opacity-20">/</span>
              <span className="opacity-40">{logoSuffix}</span>
            </div>
          )}
        </a>

        {/* Corrigido o espaçamento dos links centrais com gap-8 */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, href }) => (
            <a key={href} href={href} className="text-sm text-white/55 no-underline transition-colors hover:text-white">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <HeaderUserMenu config={config} />
          {ctaSlot}
        </div>
      </div>
    </header>
  );
}