"use client";

import React, { useEffect, useRef, useState } from "react";

export interface HeaderNotification {
  id: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
  actionUrl?: string | null;
}

interface NotificationBellProps {
  notifications?: HeaderNotification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDelete?: (id: string) => void;
  /** URL for "ver todas" footer link */
  allNotificationsUrl?: string;
}

function formatTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Agora";
  if (mins < 60) return `${mins}min`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString("pt-BR");
}

const S = {
  wrap: {
    position: "relative" as const,
  },
  btn: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "inherit",
    padding: 0,
  },
  badge: {
    position: "absolute" as const,
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
    lineHeight: 1,
  },
  dropdown: {
    position: "absolute" as const,
    right: 0,
    top: "calc(100% + 8px)",
    width: 320,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "hsl(220 45% 17%)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    zIndex: 100,
    overflow: "hidden",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
    color: "hsl(0 0% 100%)",
  },
  markAllBtn: {
    fontSize: 11,
    color: "hsl(18 100% 62%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  list: {
    maxHeight: 360,
    overflowY: "auto" as const,
  },
  empty: {
    padding: "24px 16px",
    textAlign: "center" as const,
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
  },
  item: (isUnread: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "10px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    backgroundColor: isUnread ? "rgba(249,115,22,0.06)" : "transparent",
    cursor: "pointer",
    textDecoration: "none",
  }),
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    backgroundColor: "hsl(18 100% 62%)",
    flexShrink: 0,
    marginTop: 5,
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: (isUnread: boolean): React.CSSProperties => ({
    fontSize: 13,
    fontWeight: isUnread ? 600 : 400,
    color: "hsl(0 0% 100%)",
    margin: 0,
    lineHeight: 1.4,
  }),
  itemMsg: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    margin: "2px 0 0",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },
  itemTime: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    margin: "3px 0 0",
  },
  actions: {
    display: "flex",
    gap: 2,
    flexShrink: 0,
    marginTop: 1,
  },
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 3,
    borderRadius: 4,
    color: "rgba(255,255,255,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: "8px 16px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center" as const,
  },
  footerLink: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textDecoration: "none",
  },
};

// Simple inline SVG icons (no external dependency)
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

export function NotificationBell({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onDelete,
  allNotificationsUrl,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.readAt);
  const unreadCount = unread.length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={S.wrap} ref={ref}>
      <button
        style={S.btn}
        onClick={() => setIsOpen((o) => !o)}
        aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ""}`}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span style={S.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div style={S.dropdown}>
          <div style={S.dropdownHeader}>
            <p style={S.dropdownTitle}>Notificações</p>
            {unreadCount > 0 && onMarkAllRead && (
              <button style={S.markAllBtn} onClick={() => onMarkAllRead()}>
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div style={S.list}>
            {notifications.length === 0 ? (
              <p style={S.empty}>Nenhuma notificação</p>
            ) : (
              notifications.slice(0, 10).map((n) => {
                const isUnread = !n.readAt;
                const inner = (
                  <>
                    {isUnread && <span style={S.dot} />}
                    <div style={S.itemContent}>
                      <p style={S.itemTitle(isUnread)}>{n.title}</p>
                      <p style={S.itemMsg}>{n.message}</p>
                      <p style={S.itemTime}>{formatTimeAgo(n.createdAt)}</p>
                    </div>
                    <div style={S.actions}>
                      {isUnread && onMarkRead && (
                        <button
                          style={S.actionBtn}
                          title="Marcar como lida"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMarkRead(n.id); }}
                        >
                          <CheckIcon />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          style={S.actionBtn}
                          title="Remover"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(n.id); }}
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </>
                );

                return n.actionUrl ? (
                  <a key={n.id} href={n.actionUrl} style={S.item(isUnread)} onClick={() => setIsOpen(false)}>
                    {inner}
                  </a>
                ) : (
                  <div key={n.id} style={S.item(isUnread)} onClick={() => { if (isUnread && onMarkRead) onMarkRead(n.id); }}>
                    {inner}
                  </div>
                );
              })
            )}
          </div>

          {allNotificationsUrl && notifications.length > 10 && (
            <div style={S.footer}>
              <a href={allNotificationsUrl} style={S.footerLink} onClick={() => setIsOpen(false)}>
                Ver todas as notificações
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
