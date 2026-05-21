"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

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

const NOTIFICATION_SOUND_SRC = "/assets/sound%20effects/notification-sound-001.mp3";
let knownNotificationIdsSnapshot: Set<string> | null = null;
const soundedNotificationIds = new Set<string>();

function useUnreadNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNotificationSound = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(NOTIFICATION_SOUND_SRC);
      audio.preload = "auto";
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const notifications = await fetchWebsiteNotifications();
      const nextUnreadCount = countUnreadNotifications(notifications);
      const nextNotificationIds = new Set(notifications.map((notification) => notification.id));
      const knownNotificationIds = knownNotificationIdsSnapshot;

      if (knownNotificationIds) {
        const freshUnreadNotifications = notifications.filter(
          (notification) =>
            !knownNotificationIds.has(notification.id) &&
            !soundedNotificationIds.has(notification.id)
        );

        if (freshUnreadNotifications.length > 0 && nextUnreadCount > 0) {
          freshUnreadNotifications.forEach((notification) => {
            soundedNotificationIds.add(notification.id);
          });
          playNotificationSound();
        }
      }

      knownNotificationIdsSnapshot = nextNotificationIds;
      setUnreadCount(nextUnreadCount);
    } catch (error) {
      console.warn("Could not load website notifications.", error);
      setUnreadCount(0);
    }
  }, [playNotificationSound]);

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
