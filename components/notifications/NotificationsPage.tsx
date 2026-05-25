"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppImageButton } from "@/components/AppImageButton";
import { DesktopCategoryMenu } from "@/components/layout/DesktopCategoryMenu";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NotificationNavButton, NotificationTextLink } from "@/components/notifications/NotificationNavButton";
import { useLanguage } from "@/components/providers/language-provider";
import { uiLabels } from "@/lib/i18n/ui-labels";
import { playUiSound } from "@/lib/utils/ui-sounds";
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

function DesktopNotificationsHeader() {
  const { dictionary } = useLanguage();

  return (
    <header className="fixed inset-x-0 top-0 z-50 hidden rounded-b-[28px] bg-white shadow-sm lg:block">
      <nav className="mx-auto flex h-[100px] max-w-[1480px] items-center justify-between gap-10 px-14">
        <DesktopCategoryMenu />

        <div className="flex flex-1 items-center justify-center gap-[clamp(2rem,5vw,6.25rem)] text-base font-bold leading-none text-black">
          <Link href="/" onClick={() => playUiSound("tap")} className="whitespace-nowrap transition hover:-translate-y-0.5 hover:text-black">
            {dictionary.nav.home}
          </Link>
          <Link href="/favorite" onClick={() => playUiSound("tap")} className="whitespace-nowrap transition hover:-translate-y-0.5 hover:text-black">
            {dictionary.nav.favorite}
          </Link>
          <NotificationTextLink className="whitespace-nowrap transition hover:-translate-y-0.5 hover:text-black" />
          <a href="#policy" onClick={() => playUiSound("tap")} className="whitespace-nowrap transition hover:-translate-y-0.5 hover:text-black">
            {dictionary.nav.policy}
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-7">
          <LanguageSwitcher />
          <AppImageButton
            buttonId="button-021"
            href="/cart"
            size={58}
            className="flex h-[58px] w-[58px] items-center justify-center transition hover:scale-105"
          />
          <AppImageButton
            buttonId="button-023"
            href="/profile"
            size={58}
            className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full text-black transition hover:scale-105"
          />
        </div>
      </nav>
    </header>
  );
}

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

function getNotificationDateLabel(date: Date | null, locale: "vi" | "en") {
  const labels = uiLabels[locale].notifications;

  if (!date) {
    return labels.fallbackGroup;
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameCalendarDate(date, today)) {
    return labels.today;
  }

  if (isSameCalendarDate(date, yesterday)) {
    return labels.yesterday;
  }

  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric"
  }).format(date);
}

function getNotificationTimeLabel(notification: WebsiteNotification, locale: "vi" | "en") {
  const notificationDate = parseNotificationDate(notification);

  if (notificationDate) {
    return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
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

function groupNotifications(notifications: WebsiteNotification[], locale: "vi" | "en") {
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
      label: getNotificationDateLabel(notificationDate, locale),
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
  const { locale } = useLanguage();
  const labels = uiLabels[locale].notifications;
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
          setError(labels.loadError);
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
  }, [labels.loadError]);

  const visibleNotifications = useMemo(() => sortNotifications(notifications), [notifications]);
  const notificationGroups = useMemo(
    () => groupNotifications(visibleNotifications, locale),
    [locale, visibleNotifications]
  );

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .notifications-page-shell {
            padding-top: clamp(160px, 12vh, 200px) !important;
            min-height: 100dvh !important;
          }

          .notifications-page-main {
            max-width: none !important;
            width: min(calc(100vw - 160px), 1180px) !important;
          }

          .notifications-page-content {
            max-width: none !important;
            width: min(100%, 1040px) !important;
          }

          .notifications-page-heading {
            margin-top: 44px !important;
          }

          .notifications-page-list {
            margin-top: 40px !important;
          }
        }

        @media (min-width: 1280px) {
          .notifications-page-main {
            width: min(calc(100vw - 220px), 1240px) !important;
          }

          .notifications-page-content {
            width: min(100%, 1120px) !important;
          }
        }
      `}</style>
      <DesktopNotificationsHeader />
      <div className="notifications-page-shell min-h-[100dvh] bg-[#FFF1AF] text-black lg:min-h-[100dvh] lg:rounded-b-[36px] lg:px-[clamp(3rem,7vw,7.5rem)] lg:pb-[clamp(3rem,6vw,5.5rem)] lg:pt-[calc(100px+clamp(4.5rem,7vw,7rem))]">
      <main className="notifications-page-main mx-auto w-full max-w-md px-6 pb-32 pt-[calc(2rem+env(safe-area-inset-top))] lg:max-w-[1120px] lg:px-0 lg:pb-16 lg:pt-0">
        <div className="flex justify-end lg:hidden">
          <AppImageButton
            buttonId="button-009"
            href="/"
            size={56}
            className="flex h-14 w-14 items-center justify-center rounded-full text-black shadow-sm"
          />
        </div>

        <header className="notifications-page-heading mx-auto mt-14 w-full lg:max-w-none">
          <h1 className="text-[28px] font-black leading-none sm:text-4xl">{labels.title}</h1>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-black/62 sm:text-base">
            {labels.description}
          </p>
        </header>

        <section className="notifications-page-list mx-auto mt-9 w-full lg:mt-10">
          {loading ? (
            <div className="notifications-page-content mx-auto rounded-[28px] bg-white/85 px-6 py-8 text-sm font-bold text-black/62 shadow-[0_16px_34px_rgba(46,46,18,0.08)]">
              {labels.loading}
            </div>
          ) : null}

          {error ? (
            <div className="notifications-page-content mx-auto rounded-[28px] bg-white/85 px-6 py-8 text-sm font-bold leading-6 text-black shadow-[0_16px_34px_rgba(46,46,18,0.08)]">
              {error}
            </div>
          ) : null}

          {!loading && !error && visibleNotifications.length === 0 ? (
            <div className="notifications-page-content mx-auto rounded-[30px] bg-white/80 px-6 py-10 text-center shadow-[0_16px_34px_rgba(46,46,18,0.08)] lg:min-h-[300px] lg:px-10 lg:py-14">
              <div className="mx-auto h-14 w-14 rounded-full bg-[#ffe467]" />
              <h2 className="mt-5 text-lg font-black leading-tight sm:text-xl">{labels.emptyTitle}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-black/65">
                {labels.emptyDescription}
              </p>
            </div>
          ) : null}

          {!loading && !error && notificationGroups.length > 0 ? (
            <div className="notifications-page-content mx-auto space-y-7">
              {notificationGroups.map((group) => (
                <section key={group.key}>
                  <h2 className="mb-3 px-1 text-sm font-black leading-tight text-black/55 sm:text-base">
                    {group.label}
                  </h2>
                  <div className="space-y-3">
                    {group.notifications.map((notification) => {
                      const timeLabel = getNotificationTimeLabel(notification, locale);

                      return (
                        <article
                          key={notification.id}
                          className="rounded-[24px] bg-white/88 px-4 py-4 shadow-[0_14px_30px_rgba(48,44,17,0.08)] sm:px-5 lg:px-7 lg:py-5"
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
    </>
  );
}
