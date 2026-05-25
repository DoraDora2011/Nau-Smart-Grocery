"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AppImageButton } from "@/components/AppImageButton";
import { DesktopCategoryMenu } from "@/components/layout/DesktopCategoryMenu";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NotificationTextLink } from "@/components/notifications/NotificationNavButton";
import { useLanguage } from "@/components/providers/language-provider";
import { playUiSound } from "@/lib/utils/ui-sounds";

const MASCOT_PROFILE_STORAGE_KEY = "nau-smart-grocery:mascot-profile";

function DesktopMascotHeader() {
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

export function MascotDressUpPage() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const captureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    function handleMascotMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === "NAU_MASCOT_CAPTURED") {
        if (captureTimeoutRef.current) {
          clearTimeout(captureTimeoutRef.current);
          captureTimeoutRef.current = null;
        }

        localStorage.setItem(
          MASCOT_PROFILE_STORAGE_KEY,
          JSON.stringify({
            outfit: event.data.outfit ?? "default",
            imageDataUrl: event.data.imageDataUrl,
            savedAt: new Date().toISOString(),
          }),
        );

        setSaveMessage("Đã lưu mascot đại diện.");
        setIsSaving(false);
        router.push("/profile");
      }

      if (event.data?.type === "NAU_MASCOT_CAPTURE_FAILED") {
        if (captureTimeoutRef.current) {
          clearTimeout(captureTimeoutRef.current);
          captureTimeoutRef.current = null;
        }

        setSaveMessage("Chưa lưu được mascot. Bạn thử xác nhận lại giúp mình nhé.");
        setIsSaving(false);
      }
    }

    window.addEventListener("message", handleMascotMessage);

    return () => {
      window.removeEventListener("message", handleMascotMessage);

      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
      }
    };
  }, [router]);

  function handleConfirmMascot() {
    if (!iframeRef.current?.contentWindow) {
      setSaveMessage("Mascot chưa sẵn sàng để lưu.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("Đang lưu mascot đại diện...");
    iframeRef.current.contentWindow.postMessage(
      { type: "NAU_MASCOT_CAPTURE" },
      window.location.origin,
    );

    captureTimeoutRef.current = setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Mascot phản hồi hơi chậm. Bạn thử bấm xác nhận lại nhé.");
    }, 3000);
  }

  return (
    <>
      <style jsx global>{`
        @media (min-width: 1024px) {
          .mascot-page-shell {
            padding-top: clamp(122px, 9vh, 148px) !important;
          }

          .mascot-page-main,
          .mascot-page-back {
            max-width: none !important;
            width: min(calc(100vw - 160px), 1180px) !important;
          }

          .mascot-studio-card {
            margin-top: 18px !important;
            border-radius: 36px !important;
            padding: 32px !important;
          }

          .mascot-studio-frame {
            min-height: calc(100dvh - 360px) !important;
            height: min(760px, calc(100dvh - 260px)) !important;
          }
        }

        @media (min-width: 1280px) {
          .mascot-page-main,
          .mascot-page-back {
            width: min(calc(100vw - 220px), 1240px) !important;
          }

          .mascot-studio-frame {
            height: min(820px, calc(100dvh - 260px)) !important;
          }
        }
      `}</style>
      <DesktopMascotHeader />
      <div className="mascot-page-shell min-h-[100dvh] bg-[#FFF1AF] px-4 pb-8 pt-5 text-black lg:min-h-[calc(100dvh-100px)] lg:rounded-b-[36px] lg:px-[clamp(3rem,7vw,7.5rem)] lg:pb-[clamp(3rem,6vw,5.5rem)] lg:pt-[calc(100px+clamp(4.5rem,7vw,7rem))]">
      <div className="mascot-page-back mx-auto flex max-w-6xl justify-end lg:hidden">
        <AppImageButton
          buttonId="button-009"
          href="/profile"
          size={58}
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full text-black shadow-sm"
        />
      </div>

      <main className="mascot-page-main mx-auto mt-6 max-w-6xl space-y-7 lg:mt-0">
        <section className="mascot-studio-card rounded-[34px] bg-[linear-gradient(180deg,#ffffff_0%,#fff9d9_42%,#ffe467_100%)] p-4 shadow-[0_14px_28px_rgba(0,0,0,0.18)] lg:p-6">
          <div className="mb-4 px-2">
            <p className="text-sm font-black uppercase tracking-wide text-black/55">
              Mascot đại diện
            </p>
            <h1 className="mt-1 text-2xl font-black leading-tight sm:text-3xl lg:text-5xl">
              Phòng thay đồ của Nâu
            </h1>
          </div>

          <iframe
            ref={iframeRef}
            src="/mascot-3d/index.html"
            title="Phòng thay đồ mascot 3D"
            className="mascot-studio-frame min-h-[72dvh] w-full rounded-[28px] border-0 bg-transparent"
            allow="fullscreen"
          />

          <div className="mt-7 space-y-4 px-1">
            <button
              type="button"
              onClick={handleConfirmMascot}
              disabled={isSaving}
              className="w-full rounded-full bg-[#cd6cfd] px-5 py-3 text-sm font-black leading-tight text-white shadow-[0_10px_22px_rgba(0,0,0,0.22)] transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:px-8 sm:py-4 sm:text-base lg:text-lg"
            >
              {isSaving ? "Đang lưu..." : "Xác nhận"}
            </button>

            {saveMessage ? (
              <p className="rounded-2xl bg-white/80 px-4 py-3 text-center text-sm font-bold text-black/70">
                {saveMessage}
              </p>
            ) : null}
          </div>
        </section>
      </main>
    </div>
    </>
  );
}
