export const USER_PROFILE_STORAGE_KEY = "nau_user_profile";
export const USER_PROFILE_UPDATED_EVENT = "nau-smart-grocery:user-profile-updated";
export const ONBOARDING_SEEN_STORAGE_KEY = "nau_onboarding_seen";

export type StoredUserProfile = {
  name: string;
  address: string;
  email: string;
  createdAt: string;
  hasReceivedNotification: boolean;
};

function isStoredUserProfile(value: unknown): value is StoredUserProfile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const profile = value as Partial<StoredUserProfile>;

  return (
    typeof profile.name === "string" &&
    typeof profile.address === "string" &&
    typeof profile.email === "string" &&
    typeof profile.createdAt === "string" &&
    typeof profile.hasReceivedNotification === "boolean"
  );
}

export function readStoredUserProfile() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedProfile = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);

    if (!storedProfile) {
      return null;
    }

    const parsedProfile = JSON.parse(storedProfile) as unknown;

    return isStoredUserProfile(parsedProfile) ? parsedProfile : null;
  } catch {
    return null;
  }
}

export function saveStoredUserProfile(profile: StoredUserProfile) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent(USER_PROFILE_UPDATED_EVENT));

    return true;
  } catch {
    return false;
  }
}

export function clearAnonymousOnboardingState() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(ONBOARDING_SEEN_STORAGE_KEY);
  } catch {
    // Storage can be unavailable; the current session can still continue as a new user.
  }
}

export function updateStoredUserProfileAddress(address: string) {
  const nextAddress = address.trim();
  const profile = readStoredUserProfile();

  if (!nextAddress || !profile) {
    return false;
  }

  return saveStoredUserProfile({
    ...profile,
    address: nextAddress
  });
}
