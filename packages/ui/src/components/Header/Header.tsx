"use client";

import React, { useEffect, useState } from "react";
import { Logo } from "../Logo";
import { NotificationBell, HeaderNotification } from "./NotificationBell";
import { UserMenu, HeaderUser } from "./UserMenu";

export type { HeaderUser, HeaderNotification };

export interface HeaderNavLink {
  label: string;
  href: string;
}

export interface EasyHeaderProps {
  /** Sufixo após o logo, ex: "club", "afiliados" */
  logoSuffix?: string;
  /** Variante de cor do logo */
  logoVariant?: "dark" | "light";
  /** Links de navegação */
  navLinks?: HeaderNavLink[];

  /** Usuário autenticado (null/undefined = não logado) */
  user?: HeaderUser | null;
  /** URL de login (exibida quando não logado) */
  loginUrl?: string;
  /** URL de configurações / perfil do usuário */
  settingsUrl?: string;
  /** URL da documentação */
  docsUrl?: string;
  /** Callback de sign out */
  onSignOut?: () => void;

  /** Notificações (só exibido quando user está presente) */
  notifications?: HeaderNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
  allNotificationsUrl?: string;

  /** Slot direito customizável (mostrado quando não logado ou como override) */
  ctaSlot?: React.ReactNode;

  className?: string;
}

const S = {
  header: (scrolled: boolean): React.CSSProperties => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: "background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
    ...(scrolled
      ? {
          backgroundColor: "hsla(220, 50%, 12%, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }
      : {
          backgroundColor: "transparent",
        }),
  }),
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    textDecoration: "none",
  },
  suffix: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  slash: {
    fontFamily: "monospace",
    fontSize: 18,
    color: "rgba(255,255,255,0.2)",
    lineHeight: 1,
  },
  suffixText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 28,
  },
  navLink: {
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    textDecoration: "none",
    transition: "color 0.2s",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  loginLink: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    transition: "border-color 0.2s, color 0.2s",
  },
};

export function EasyHeader({
  logoSuffix,
  logoVariant = "dark",
  navLinks = [],
  user,
  loginUrl,
  settingsUrl,
  docsUrl,
  onSignOut,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onDeleteNotification,
  allNotificationsUrl,
  ctaSlot,
  className,
}: EasyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header style={S.header(scrolled)} className={className}>
      <div style={S.inner}>
        {/* Logo + sufixo */}
        <a href="/" style={S.logoWrap}>
          <Logo variant={logoVariant} width={108} />
          {logoSuffix && (
            <span style={S.suffix}>
              <span style={S.slash}>/</span>
              <span style={S.suffixText}>{logoSuffix}</span>
            </span>
          )}
        </a>

        {/* Nav links — hidden em mobile via minWidth */}
        {navLinks.length > 0 && (
          <nav
            style={{
              ...S.nav,
              // Esconde em telas pequenas
              display: "flex",
            }}
          >
            {navLinks.map(({ label, href }) => (
              <a key={href} href={href} style={S.navLink}>
                {label}
              </a>
            ))}
          </nav>
        )}

        {/* Right slot */}
        <div style={S.right}>
          {user ? (
            <>
              {/* Notification bell (só se notifications for fornecido) */}
              {notifications !== undefined && (
                <NotificationBell
                  notifications={notifications}
                  onMarkRead={onMarkNotificationRead}
                  onMarkAllRead={onMarkAllNotificationsRead}
                  onDelete={onDeleteNotification}
                  allNotificationsUrl={allNotificationsUrl}
                />
              )}

              {/* User menu */}
              <UserMenu
                user={user}
                onSignOut={onSignOut}
                settingsUrl={settingsUrl}
                docsUrl={docsUrl}
              />
            </>
          ) : (
            <>
              {ctaSlot ?? (
                loginUrl && (
                  <a href={loginUrl} style={S.loginLink}>
                    Entrar
                  </a>
                )
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
