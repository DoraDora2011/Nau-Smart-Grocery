"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AppImageButton } from "@/components/AppImageButton";
import {
  countUnreadNotifications,
  fetchWebsiteNotifications,
  NOTIFICATION_SEEN_EVENT
} from "@/lib/utils/website-notifications";

interface NotificationNavButtonProps {
  size?: number;
  className?: string;
}

function useUnreadNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const notifications = await fetchWebsiteNotifications();

      setUnreadCount(countUnreadNotifications(notifications));
    } catch (error) {
      console.warn("Could not load website notifications.", error);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    void refreshUnreadCount();

    const refreshFromSeenState = () => void refreshUnreadCount();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void refreshUnreadCount();
      }
    };
    const interval = window.setInterval(() => void refreshUnreadCount(), 60000);

    window.addEventListener(NOTIFICATION_SEEN_EVENT, refreshFromSeenState);
    window.addEventListener("storage", refreshFromSeenState);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener(NOTIFICATION_SEEN_EVENT, refreshFromSeenState);
      window.removeEventListener("storage", refreshFromSeenState);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshUnreadCount]);

  return unreadCount;
}

function NotificationDot({ unreadCount }: { unreadCount: number }) {
  if (unreadCount === 0) {
    return null;
  }

  return (
    <span
      className="pointer-events-none absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ffe467] ring-2 ring-white"
      aria-hidden="true"
    />
  );
}

export function NotificationNavButton({ size = 28, className }: NotificationNavButtonProps) {
  const unreadCount = useUnreadNotificationCount();

  return (
    <span className="relative inline-flex shrink-0">
      <AppImageButton buttonId="button-006" href="/notifications" size={size} className={className} />
      <NotificationDot unreadCount={unreadCount} />
    </span>
  );
}

export function NotificationTextLink({ className }: { className?: string }) {
  const unreadCount = useUnreadNotificationCount();

  return (
    <Link href="/notifications" className={`relative inline-flex items-center gap-2 ${className ?? ""}`}>
      Thông Báo
      {unreadCount > 0 ? (
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffe467] ring-2 ring-white" aria-hidden="true" />
      ) : null}
    </Link>
  );
}
