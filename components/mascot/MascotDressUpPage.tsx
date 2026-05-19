"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AppImageButton } from "@/components/AppImageButton";

const MASCOT_PROFILE_STORAGE_KEY = "nau-smart-grocery:mascot-profile";

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
    <div className="min-h-[100dvh] bg-[#FFF1AF] px-4 pb-8 pt-5 text-black lg:px-8 lg:py-8">
      <div className="mx-auto flex max-w-6xl justify-end">
        <AppImageButton
          buttonId="button-009"
          href="/profile"
          size={58}
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full text-black shadow-sm"
        />
      </div>

      <main className="mx-auto mt-4 max-w-6xl space-y-5">
        <section className="rounded-[34px] bg-[linear-gradient(180deg,#ffffff_0%,#fff9d9_42%,#ffe467_100%)] p-4 shadow-[0_14px_28px_rgba(0,0,0,0.18)] lg:p-6">
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
            className="min-h-[72dvh] w-full rounded-[28px] border-0 bg-transparent"
            allow="fullscreen"
          />

          <div className="mt-5 space-y-3 px-1">
            <button
              type="button"
              onClick={handleConfirmMascot}
              disabled={isSaving}
              className="w-full rounded-full border-[3px] border-black bg-[#cd6cfd] px-5 py-3 text-sm font-black leading-tight text-white shadow-[0_10px_22px_rgba(0,0,0,0.22)] transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:px-8 sm:py-4 sm:text-base lg:text-lg"
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
  );
}
