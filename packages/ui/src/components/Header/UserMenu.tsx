"use client";

import React, { useEffect, useRef, useState } from "react";
import { RankBadge } from "./RankBadge";

export interface HeaderUser {
  id: string;
  name: string | null;
  email?: string;
  avatarUrl?: string | null;
  rankName?: string | null;
}

interface UserMenuProps {
  user: HeaderUser;
  onSignOut?: () => void;
  appUrl?: string;
  settingsUrl?: string;
  docsUrl?: string;
}

const S = {
  wrap: { position: "relative" as const },
  trigger: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 8px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "inherit",
    fontSize: 14,
    fontWeight: 500,
  },
  avatar: (hasImage: boolean): React.CSSProperties => ({
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: "rgba(249,115,22,0.15)",
    border: "1.5px solid rgba(249,115,22,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    color: "hsl(18 100% 62%)",
    overflow: "hidden",
    flexShrink: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    ...(hasImage ? {} : {}),
  }),
  chevron: {
    opacity: 0.5,
    display: "flex",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute" as const,
    right: 0,
    top: "calc(100% + 8px)",
    width: 224,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "hsl(220 45% 17%)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    zIndex: 100,
    overflow: "hidden",
    padding: "4px 0",
  },
  userInfo: {
    padding: "10px 14px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: "hsl(0 0% 100%)",
    margin: "0 0 2px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  userEmail: {
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  section: {
    padding: "4px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "8px 14px",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "left" as const,
  },
  menuItemDanger: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "8px 14px",
    fontSize: 13,
    color: "#f87171",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "left" as const,
  },
};

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const DashboardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const LogOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export function UserMenu({ user, onSignOut, appUrl, settingsUrl, docsUrl }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : (user.email?.[0] ?? "?").toUpperCase();

  const firstName = user.name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Usuário";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={S.wrap} ref={ref}>
      <button style={S.trigger} onClick={() => setIsOpen((o) => !o)}>
        {/* Avatar */}
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name ?? "Avatar"}
            style={{ ...S.avatar(true), objectFit: "cover" }}
            width={30}
            height={30}
          />
        ) : (
          <span style={S.avatar(false)}>{initials}</span>
        )}

        {/* Rank badge (when present) */}
        {user.rankName && (
          <RankBadge rankName={user.rankName} size="sm" showLabel={false} />
        )}

        {/* Name — hidden on small screens via inline style media query workaround */}
        <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, fontSize: 13 }}>
          {firstName}
        </span>

        <span style={S.chevron}>
          <ChevronDown />
        </span>
      </button>

      {isOpen && (
        <div style={S.dropdown}>
          {/* User info */}
          <div style={S.userInfo}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              {user.rankName && <RankBadge rankName={user.rankName} size="sm" showLabel />}
            </div>
            <p style={S.userName}>{user.name ?? user.email}</p>
            {user.email && <p style={S.userEmail}>{user.email}</p>}
          </div>

          {/* Links */}
          <div style={S.section}>
            {appUrl && (
              <a href={`${appUrl}/dashboard`} style={S.menuItem} onClick={() => setIsOpen(false)}>
                <DashboardIcon /> Painel Principal
              </a>
            )}
            {settingsUrl && (
              <a href={settingsUrl} style={S.menuItem} onClick={() => setIsOpen(false)}>
                <UserIcon /> Editar Perfil
              </a>
            )}
            {docsUrl && (
              <a href={docsUrl} target="_blank" rel="noopener noreferrer" style={S.menuItem} onClick={() => setIsOpen(false)}>
                <BookIcon /> Documentação
              </a>
            )}
          </div>

          {/* Sign out */}
          <div style={{ padding: "4px 0" }}>
            {onSignOut && (
              <button style={S.menuItemDanger} onClick={() => { setIsOpen(false); onSignOut(); }}>
                <LogOutIcon /> Sair
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
