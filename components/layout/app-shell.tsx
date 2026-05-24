"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ShoppingBasket, Store } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserLoginOnboardingModal } from "@/components/onboarding/UserLoginOnboardingModal";
import { useLanguage } from "@/components/providers/language-provider";
import { resetHomeWelcomeForNextReturn } from "@/lib/utils/home-welcome";

export function AppShell({ children }: { children: ReactNode }) {
  const { dictionary } = useLanguage();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isDishPage = pathname === "/dish";
  const isScanPage = pathname === "/scan";
  const isFavoritePage = pathname === "/favorite";
  const isCartPage = pathname === "/cart";
  const isCheckoutPage = pathname === "/checkout";
  const isProfilePage = pathname === "/profile";
  const isMascotPage = pathname === "/mascot";
  const isNotificationsPage = pathname === "/notifications";
  const isFullScreenAppPage =
    isDishPage ||
    isScanPage ||
    isFavoritePage ||
    isCartPage ||
    isCheckoutPage ||
    isProfilePage ||
    isMascotPage ||
    isNotificationsPage;

  useEffect(() => {
    const resetWelcomeAfterLeavingTab = () => {
      if (document.visibilityState === "hidden") {
        resetHomeWelcomeForNextReturn();
      }
    };

    document.addEventListener("visibilitychange", resetWelcomeAfterLeavingTab);

    return () => {
      document.removeEventListener("visibilitychange", resetWelcomeAfterLeavingTab);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-ink)]">
      <div
        className={
          isHomePage
            ? "flex min-h-screen flex-col"
            : isProfilePage || isMascotPage
              ? "flex min-h-screen flex-col"
            : isFullScreenAppPage
              ? "flex min-h-screen flex-col lg:mx-auto lg:max-w-6xl lg:px-8 lg:pb-28 lg:pt-4"
            : "mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 lg:px-8"
        }
      >
        <header className={`${isHomePage || isProfilePage || isMascotPage ? "hidden" : isFullScreenAppPage ? "hidden lg:flex" : "flex"} mb-6 items-center justify-between rounded-[32px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(235,245,234,0.9))] px-5 py-4 shadow-[0_16px_40px_rgba(24,52,41,0.08)]`}>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-base leading-tight sm:text-lg">{dictionary.common.appName}</p>
              <p className="text-xs text-[var(--color-ink-soft)]">
                {dictionary.header.tagline}
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-card)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] ring-1 ring-[var(--color-border)]"
            >
              <Store className="h-4 w-4" />
              {dictionary.header.shop}
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-card)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] ring-1 ring-[var(--color-border)]"
            >
              <ShoppingBasket className="h-4 w-4" />
              {dictionary.header.cart}
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {isHomePage ? null : isFullScreenAppPage ? (
        <div className="fixed left-5 top-5 z-[95] lg:left-8 lg:top-8">
          <LanguageSwitcher />
        </div>
      ) : null}
      {isHomePage || isFullScreenAppPage ? null : <MobileNav />}
      <UserLoginOnboardingModal />
    </div>
  );
}
