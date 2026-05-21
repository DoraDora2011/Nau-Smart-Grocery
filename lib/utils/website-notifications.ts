export const NOTIFICATION_SEEN_STORAGE_KEY = "nau-smart-grocery:seen-notifications";
export const NOTIFICATION_SEEN_EVENT = "nau-smart-grocery:notifications-seen";

export type WebsiteNotification = {
  id: string;
  title: string;
  message: string;
  sendDate: string;
  sendTime: string;
  status: string;
  sentAt: string;
};

type NotificationRecord = Partial<Record<keyof WebsiteNotification, unknown>>;

function toNotificationString(value: unknown) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function normalizeNotification(value: unknown, index: number): WebsiteNotification | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as NotificationRecord;
  const title = toNotificationString(record.title);
  const message = toNotificationString(record.message);

  if (!title && !message) {
    return null;
  }

  const sendDate = toNotificationString(record.sendDate);
  const sendTime = toNotificationString(record.sendTime);
  const sentAt = toNotificationString(record.sentAt);
  const fallbackId = [title, message, sendDate, sendTime, sentAt, index].filter(Boolean).join("|");

  return {
    id: toNotificationString(record.id) || fallbackId,
    title: title || "Thông báo từ Nấu",
    message,
    sendDate,
    sendTime,
    status: toNotificationString(record.status),
    sentAt
  };
}

function extractNotifications(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const notifications = (payload as { notifications?: unknown }).notifications;

    if (Array.isArray(notifications)) {
      return notifications;
    }
  }

  return [];
}

export async function fetchWebsiteNotifications() {
  const webhookUrl = process.env.NEXT_PUBLIC_USER_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Notification Sheet webhook is not configured.");
  }

  const url = new URL(webhookUrl);
  url.searchParams.set("action", "notifications");

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Notification Sheet request returned ${response.status}.`);
  }

  const responseText = await response.text();
  let payload: unknown;

  try {
    payload = JSON.parse(responseText);
  } catch {
    throw new Error("Notification Sheet response is not JSON.");
  }

  return extractNotifications(payload)
    .map(normalizeNotification)
    .filter((notification): notification is WebsiteNotification => Boolean(notification));
}

export function readSeenNotificationIds() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const storedIds = JSON.parse(window.localStorage.getItem(NOTIFICATION_SEEN_STORAGE_KEY) ?? "[]");

    return new Set(Array.isArray(storedIds) ? storedIds.filter((id): id is string => typeof id === "string") : []);
  } catch {
    return new Set<string>();
  }
}

export function markNotificationsSeen(notifications: WebsiteNotification[]) {
  if (typeof window === "undefined" || notifications.length === 0) {
    return;
  }

  const nextSeenIds = new Set(readSeenNotificationIds());

  notifications.forEach((notification) => {
    nextSeenIds.add(notification.id);
  });

  window.localStorage.setItem(NOTIFICATION_SEEN_STORAGE_KEY, JSON.stringify(Array.from(nextSeenIds)));
  window.dispatchEvent(new CustomEvent(NOTIFICATION_SEEN_EVENT));
}

export function countUnreadNotifications(notifications: WebsiteNotification[]) {
  const seenIds = readSeenNotificationIds();

  return notifications.filter((notification) => !seenIds.has(notification.id)).length;
}
