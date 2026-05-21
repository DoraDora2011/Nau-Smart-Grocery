"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { AppImageButton } from "@/components/AppImageButton";
import {
  countUnreadNotifications,
  fetchWebsiteNotifications,
  NOTIFICATION_SEEN_EVENT,
  readSeenNotificationIds
} from "@/lib/utils/website-notifications";

interface NotificationNavButtonProps {
  size?: number;
  className?: string;
}

const NOTIFICATION_SOUND_SRC = "/assets/sound%20effects/notification-sound-001.mp3";
const NOTIFICATION_SOUND_STORAGE_KEY = "nau-smart-grocery:sounded-notifications";
const soundedNotificationIds = new Set<string>();

function readSoundedNotificationIds() {
  if (typeof window === "undefined") {
    return new Set(soundedNotificationIds);
  }

  try {
    const storedIds = JSON.parse(window.localStorage.getItem(NOTIFICATION_SOUND_STORAGE_KEY) ?? "[]");

    if (Array.isArray(storedIds)) {
      storedIds.forEach((id) => {
        if (typeof id === "string") {
          soundedNotificationIds.add(id);
        }
      });
    }
  } catch {
    // In-memory sound state still prevents repeats for this open session.
  }

  return new Set(soundedNotificationIds);
}

function markNotificationSounded(notificationIds: string[]) {
  notificationIds.forEach((id) => soundedNotificationIds.add(id));

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      NOTIFICATION_SOUND_STORAGE_KEY,
      JSON.stringify(Array.from(soundedNotificationIds))
    );
  } catch {
    // In-memory sound state still prevents repeats for this open session.
  }
}

function useUnreadNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingSoundIdsRef = useRef<string[]>([]);
  const removeSoundRetryListenersRef = useRef<(() => void) | null>(null);

  const clearNotificationSoundRetry = useCallback(() => {
    removeSoundRetryListenersRef.current?.();
    removeSoundRetryListenersRef.current = null;
  }, []);

  const queueNotificationSoundRetry = useCallback(
    (notificationIds: string[]) => {
      pendingSoundIdsRef.current = notificationIds;

      if (removeSoundRetryListenersRef.current) {
        return;
      }

      const retrySound = () => {
        const audio = audioRef.current;
        const pendingNotificationIds = pendingSoundIdsRef.current;

        if (!audio || pendingNotificationIds.length === 0) {
          clearNotificationSoundRetry();
          return;
        }

        audio.currentTime = 0;
        void audio.play().then(() => {
          markNotificationSounded(pendingNotificationIds);
          pendingSoundIdsRef.current = [];
          clearNotificationSoundRetry();
        }).catch(() => undefined);
      };

      window.addEventListener("pointerdown", retrySound, { passive: true });
      window.addEventListener("touchstart", retrySound, { passive: true });
      window.addEventListener("keydown", retrySound);

      removeSoundRetryListenersRef.current = () => {
        window.removeEventListener("pointerdown", retrySound);
        window.removeEventListener("touchstart", retrySound);
        window.removeEventListener("keydown", retrySound);
      };
    },
    [clearNotificationSoundRetry]
  );

  const playNotificationSound = useCallback((notificationIds: string[]) => {
    if (!audioRef.current) {
      const audio = new Audio(NOTIFICATION_SOUND_SRC);
      audio.preload = "auto";
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    audio.currentTime = 0;
    void audio.play().then(() => {
      markNotificationSounded(notificationIds);
      pendingSoundIdsRef.current = [];
      clearNotificationSoundRetry();
    }).catch(() => queueNotificationSoundRetry(notificationIds));
  }, [clearNotificationSoundRetry, queueNotificationSoundRetry]);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const notifications = await fetchWebsiteNotifications();
      const nextUnreadCount = countUnreadNotifications(notifications);
      const seenNotificationIds = readSeenNotificationIds();
      const soundedIds = readSoundedNotificationIds();
      const unsoundedUnreadNotificationIds = notifications
        .filter((notification) => !seenNotificationIds.has(notification.id) && !soundedIds.has(notification.id))
        .map((notification) => notification.id);

      if (unsoundedUnreadNotificationIds.length > 0) {
        playNotificationSound(unsoundedUnreadNotificationIds);
      }

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
      clearNotificationSoundRetry();
    };
  }, [clearNotificationSoundRetry, refreshUnreadCount]);

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
