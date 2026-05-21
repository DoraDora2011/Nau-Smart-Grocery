"use client";

import { AppImageButton } from "@/components/AppImageButton";
import { NotificationNavButton } from "@/components/notifications/NotificationNavButton";

interface RecipeMobileBottomNavProps {
  onScanClick?: () => void;
}

export function RecipeMobileBottomNav({ onScanClick }: RecipeMobileBottomNavProps) {
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
        {onScanClick ? (
          <AppImageButton
            buttonId="button-028"
            onClick={onScanClick}
            size={82}
            className="-mt-12 flex h-[82px] w-[82px] items-center justify-center rounded-full text-black shadow-[0_14px_28px_rgba(0,0,0,0.24)]"
          />
        ) : (
          <AppImageButton
            buttonId="button-003"
            href="/scan"
            size={82}
            className="-mt-12 flex h-[82px] w-[82px] items-center justify-center rounded-full text-black shadow-[0_14px_28px_rgba(0,0,0,0.24)]"
          />
        )}
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
