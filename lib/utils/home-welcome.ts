export const HOME_WELCOME_SESSION_KEY = "nau_home_welcome_seen";

export function hasSeenHomeWelcomeThisVisit() {
  try {
    return window.sessionStorage.getItem(HOME_WELCOME_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export function markHomeWelcomeSeenThisVisit() {
  try {
    window.sessionStorage.setItem(HOME_WELCOME_SESSION_KEY, "true");
  } catch {
    // The welcome screen can still finish normally if storage is unavailable.
  }
}

export function resetHomeWelcomeForNextReturn() {
  try {
    window.sessionStorage.removeItem(HOME_WELCOME_SESSION_KEY);
  } catch {
    // The Home loader still has its in-memory visibility replay path.
  }
}
