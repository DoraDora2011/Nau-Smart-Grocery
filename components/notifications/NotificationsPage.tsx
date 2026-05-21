"use client";

import { useEffect, useMemo, useState } from "react";

import { AppImageButton } from "@/components/AppImageButton";
import { NotificationNavButton } from "@/components/notifications/NotificationNavButton";
import {
  fetchWebsiteNotifications,
  markNotificationsSeen,
  type WebsiteNotification
} from "@/lib/utils/website-notifications";

type NotificationGroup = {
  key: string;
  label: string;
  notifications: WebsiteNotification[];
};

function parseNotificationDate(notification: WebsiteNotification) {
  if (notification.sentAt) {
    const sentAt = new Date(notification.sentAt);

    if (!Number.isNaN(sentAt.getTime())) {
      return sentAt;
    }
  }

  if (notification.sendDate) {
    const directDate = new Date([notification.sendDate, notification.sendTime].filter(Boolean).join(" "));

    if (!Number.isNaN(directDate.getTime())) {
      return directDate;
    }

    const viDateParts = notification.sendDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (viDateParts) {
      const [, day, month, year] = viDateParts;
      const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  }

  return null;
}

function getDateKey(date: Date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
}

function isSameCalendarDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function getNotificationDateLabel(date: Date | null) {
  if (!date) {
    return "Thông báo khác";
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameCalendarDate(date, today)) {
    return "Hôm nay";
  }

  if (isSameCalendarDate(date, yesterday)) {
    return "Hôm qua";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric"
  }).format(date);
}

function getNotificationTimeLabel(notification: WebsiteNotification) {
  const notificationDate = parseNotificationDate(notification);

  if (notificationDate) {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(notificationDate);
  }

  return notification.sendTime;
}

function sortNotifications(notifications: WebsiteNotification[]) {
  return [...notifications].sort((first, second) => {
    const firstTime = parseNotificationDate(first)?.getTime() ?? 0;
    const secondTime = parseNotificationDate(second)?.getTime() ?? 0;

    if (Number.isNaN(firstTime) || Number.isNaN(secondTime)) {
      return 0;
    }

    return secondTime - firstTime;
  });
}

function groupNotifications(notifications: WebsiteNotification[]) {
  return notifications.reduce<NotificationGroup[]>((groups, notification) => {
    const notificationDate = parseNotificationDate(notification);
    const key = notificationDate ? getDateKey(notificationDate) : "undated";
    const existingGroup = groups.find((group) => group.key === key);

    if (existingGroup) {
      existingGroup.notifications.push(notification);
      return groups;
    }

    groups.push({
      key,
      label: getNotificationDateLabel(notificationDate),
      notifications: [notification]
    });

    return groups;
  }, []);
}

function NotificationsBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-14px_36px_rgba(0,0,0,0.18)] lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 items-center justify-items-center">
        <AppImageButton buttonId="button-004" href="/" size={28} className="flex justify-center text-black" />
        <AppImageButton
          buttonId="button-005"
          href="/favorite"
          size={28}
          className="flex justify-center text-black"
        />
        <AppImageButton
          buttonId="button-003"
          href="/scan"
          size={82}
          className="-mt-12 flex h-[82px] w-[82px] items-center justify-center rounded-full text-black shadow-[0_14px_28px_rgba(0,0,0,0.24)]"
        />
        <NotificationNavButton size={28} className="flex justify-center text-black" />
        <AppImageButton
          buttonId="button-021"
          href="/cart"
          size={48}
          className="flex h-12 w-12 items-center justify-center justify-self-center rounded-full text-black"
        />
      </div>
    </nav>
  );
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<WebsiteNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      try {
        const nextNotifications = await fetchWebsiteNotifications();

        if (!active) {
          return;
        }

        setNotifications(nextNotifications);
        setError(null);
        markNotificationsSeen(nextNotifications);
      } catch (loadError) {
        console.warn("Could not open website notifications.", loadError);

        if (active) {
          setError("Chưa thể tải thông báo lúc này. Vui lòng thử lại sau.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadNotifications();

    return () => {
      active = false;
    };
  }, []);

  const visibleNotifications = useMemo(() => sortNotifications(notifications), [notifications]);
  const notificationGroups = useMemo(() => groupNotifications(visibleNotifications), [visibleNotifications]);

  return (
    <div className="min-h-[100dvh] bg-[#FFF1AF] text-black lg:rounded-[36px] lg:px-8 lg:py-10">
      <main className="mx-auto w-full max-w-md px-6 pb-32 pt-[calc(2rem+env(safe-area-inset-top))] lg:max-w-4xl lg:pb-16 lg:pt-4">
        <div className="flex justify-end">
          <AppImageButton
            buttonId="button-009"
            href="/"
            size={56}
            className="flex h-14 w-14 items-center justify-center rounded-full text-black shadow-sm"
          />
        </div>

        <header className="mt-14">
          <p className="text-xs font-black uppercase leading-tight text-[#4a7890]">Nấu gửi bạn</p>
          <h1 className="mt-3 text-[28px] font-black leading-none sm:text-4xl">Thông báo</h1>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-black/62 sm:text-base">
            Phản hồi và cập nhật mới từ nhà phát hành sẽ xuất hiện tại đây.
          </p>
        </header>

        <section className="mt-9">
          {loading ? (
            <div className="rounded-[28px] bg-white/85 px-6 py-8 text-sm font-bold text-black/62 shadow-[0_16px_34px_rgba(46,46,18,0.08)]">
              Đang tải thông báo...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[28px] bg-white/85 px-6 py-8 text-sm font-bold leading-6 text-black shadow-[0_16px_34px_rgba(46,46,18,0.08)]">
              {error}
            </div>
          ) : null}

          {!loading && !error && visibleNotifications.length === 0 ? (
            <div className="rounded-[30px] bg-white/80 px-6 py-10 text-center shadow-[0_16px_34px_rgba(46,46,18,0.08)]">
              <div className="mx-auto h-14 w-14 rounded-full bg-[#ffe467]" />
              <h2 className="mt-5 text-lg font-black leading-tight sm:text-xl">Chưa có thông báo mới</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-black/65">
                Khi Nấu có cập nhật dành cho bạn, thông báo sẽ hiện ở đây.
              </p>
            </div>
          ) : null}

          {!loading && !error && notificationGroups.length > 0 ? (
            <div className="space-y-7">
              {notificationGroups.map((group) => (
                <section key={group.key}>
                  <h2 className="mb-3 px-1 text-sm font-black leading-tight text-black/55 sm:text-base">
                    {group.label}
                  </h2>
                  <div className="space-y-3">
                    {group.notifications.map((notification) => {
                      const timeLabel = getNotificationTimeLabel(notification);

                      return (
                        <article
                          key={notification.id}
                          className="rounded-[24px] bg-white/88 px-4 py-4 shadow-[0_14px_30px_rgba(48,44,17,0.08)] sm:px-5"
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-[#ffe467]"
                              aria-hidden="true"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <h3 className="min-w-0 text-[15px] font-black leading-snug sm:text-lg">
                                  {notification.title}
                                </h3>
                                {timeLabel ? (
                                  <time className="shrink-0 text-right text-[11px] font-bold leading-4 text-black/44 sm:text-xs">
                                    {timeLabel}
                                  </time>
                                ) : null}
                              </div>
                              {notification.message ? (
                                <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-black/68 sm:text-base">
                                  {notification.message}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : null}
        </section>
      </main>

      <NotificationsBottomNav />
    </div>
  );
}
