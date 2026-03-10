'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { HeaderNotification } from '../types';

export interface UseNotificationsConfig {
  /** Path do endpoint de notificações. Default: '/api/notifications' */
  path?: string;
  /** Intervalo de polling em ms. Default: 30_000 (30s). 0 = desabilita. */
  pollInterval?: number;
}

export interface UseNotificationsReturn {
  notifications: HeaderNotification[];
  unreadCount: number;
  hasUnread: boolean;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismiss: (id: string) => Promise<void>;
  refetch: () => void;
}

/** Mapeia a resposta da API para o formato HeaderNotification usado pelo componente UI. */
function mapRow(row: Record<string, unknown>): HeaderNotification {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    message: String(row.message ?? ''),
    readAt: (row.read_at as string | null) ?? null,
    createdAt: String(row.created_at ?? ''),
    actionUrl: (row.action_url as string | null) ?? null,
  };
}

export function useNotifications({
  path = '/api/notifications',
  pollInterval = 30_000,
}: UseNotificationsConfig = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(path, { credentials: 'include' });
      if (!res.ok) return;
      const data: Record<string, unknown>[] = await res.json();
      setNotifications(Array.isArray(data) ? data.map(mapRow) : []);
    } catch {
      // fail silently — network error
    } finally {
      setIsLoading(false);
    }
  }, [path]);

  // Initial fetch + polling
  useEffect(() => {
    fetchNotifications();
    if (pollInterval > 0) {
      timerRef.current = setInterval(fetchNotifications, pollInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchNotifications, pollInterval]);

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
    await fetch(path, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => null);
  }, [path]);

  const markAllAsRead = useCallback(async () => {
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => (n.readAt ? n : { ...n, readAt: now }))
    );
    await fetch(path, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    }).catch(() => null);
  }, [path]);

  const dismiss = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await fetch(path, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => null);
  }, [path]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return {
    notifications,
    unreadCount,
    hasUnread: unreadCount > 0,
    isLoading,
    markAsRead,
    markAllAsRead,
    dismiss,
    refetch: fetchNotifications,
  };
}
