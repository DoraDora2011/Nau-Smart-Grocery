"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { AppImageButton } from "@/components/AppImageButton";

const MASCOT_PROFILE_STORAGE_KEY = "nau-smart-grocery:mascot-profile";

type MascotProfilePreview = {
  outfit: string;
  imageDataUrl: string;
  savedAt?: string;
};

const profileMenuItems = [
  { label: "Danh sách yêu thích", href: "/favorite?from=profile" },
  { label: "Thông tin cá nhân", href: "#personal-info" },
  { label: "Mật khẩu và bảo mật", href: "#security" },
  { label: "Cẩm nang của Nấu", href: "#guide" },
  { label: "Chính sách và hỗ trợ", href: "#support" },
  { label: "Ngôn ngữ và khu vực", href: "#language-region" },
] as const;

function ProfileBottomNav() {
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
        <AppImageButton
          buttonId="button-006"
          href="#notification"
          size={28}
          className="flex justify-center text-black"
        />
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

export function UserProfilePage() {
  const [mascotPreview, setMascotPreview] = useState<MascotProfilePreview | null>(null);
  const mascotPreviewSrc = `/mascot-3d/index.html?preview=1&outfit=${encodeURIComponent(
    mascotPreview?.outfit ?? "default",
  )}`;

  useEffect(() => {
    try {
      const savedPreview = localStorage.getItem(MASCOT_PROFILE_STORAGE_KEY);

      if (!savedPreview) {
        return;
      }

      const parsedPreview = JSON.parse(savedPreview) as MascotProfilePreview;

      if (parsedPreview.imageDataUrl) {
        setMascotPreview(parsedPreview);
      }
    } catch {
      setMascotPreview(null);
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#FFF1AF] text-black lg:px-8 lg:py-10">
      <main className="mx-auto max-w-md px-0 pb-32 lg:max-w-3xl">
        <div className="px-1 pt-2">
          <section
            className="rounded-b-[42px] rounded-t-[48px] bg-[linear-gradient(180deg,#d7fdd9_0%,#edc7ff_52%,#cd6cfd_100%)] px-2 pb-3 pt-5 shadow-[0_10px_18px_rgba(0,0,0,0.24)] lg:rounded-b-[54px] lg:rounded-t-[88px] lg:px-4 lg:pb-5 lg:pt-8"
            aria-label="Mở phòng thay đồ mascot 3D"
          >
            <div className="flex min-h-[235px] items-center justify-center lg:min-h-[360px]">
              <iframe
                src={mascotPreviewSrc}
                title={`Mascot Nâu ${mascotPreview?.outfit ?? "default"}`}
                className="h-[235px] w-full border-0 bg-transparent lg:h-[360px]"
              />
            </div>
          </section>
        </div>

        <section className="space-y-8 px-5 pt-8 lg:px-8 lg:pt-10">
          <Link
            href="/mascot"
            className="mx-auto flex min-h-[58px] w-full max-w-[320px] items-center justify-center rounded-full bg-[#ffe467] px-8 py-3 text-center text-[15px] font-black leading-snug text-black shadow-[0_8px_18px_rgba(0,0,0,0.2)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-black active:scale-[0.98] lg:min-h-[66px] lg:max-w-[420px] lg:px-10 lg:text-lg"
            aria-label="Mở phòng thay đồ mascot 3D"
          >
            Nhấn vào đây để thay đồ cho bé Nâu của bạn nhé!
          </Link>

          <Link
            href="#membership"
            className="group flex min-h-10 items-center justify-between rounded-full bg-[linear-gradient(100deg,#ffffff_0%,#edc7ff_36%,#cd6cfd_100%)] px-5 text-lg font-black leading-tight shadow-sm transition duration-200 hover:brightness-110 hover:shadow-[0_10px_22px_rgba(205,108,253,0.26)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#cd6cfd] active:scale-[0.99] active:brightness-110 sm:px-7 sm:text-[22px] lg:min-h-20 lg:px-8 lg:text-[26px]"
          >
            Membership
            <ChevronRight className="h-7 w-7 stroke-[2.3] transition group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:h-10 lg:w-10" />
          </Link>

          <div className="space-y-4 px-0 lg:space-y-5 lg:px-4">
            {profileMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex min-h-12 items-center justify-between rounded-full px-5 text-[17px] font-black leading-tight transition duration-200 hover:bg-[linear-gradient(100deg,#ffffff_0%,#f5f8bd_48%,#ffe467_100%)] hover:shadow-[0_10px_22px_rgba(255,228,103,0.24)] focus-visible:bg-[linear-gradient(100deg,#ffffff_0%,#f5f8bd_48%,#ffe467_100%)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ffe467] active:scale-[0.99] active:bg-[linear-gradient(100deg,#ffffff_0%,#f5f8bd_48%,#ffe467_100%)] sm:px-7 sm:text-xl lg:min-h-16 lg:text-[26px]"
              >
                <span>{item.label}</span>
                <ChevronRight className="h-7 w-7 shrink-0 stroke-[2.4] transition group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:h-9 lg:w-9" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed right-6 top-6 z-40">
        <AppImageButton
          buttonId="button-009"
          href="/"
          size={58}
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full text-black shadow-sm"
        />
      </div>

      <ProfileBottomNav />
    </div>
  );
}
