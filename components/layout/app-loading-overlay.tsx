"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const LOADING_VIDEO_SRC = "/models/Animation%20-%20Wave.webm";
const LOADING_DURATION_MS = 2400;
const FADE_DURATION_MS = 260;

export function AppLoadingOverlay() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const removeTimerRef = useRef<number | null>(null);
  const wasHiddenRef = useRef(false);
  const isHomePath = pathname === "/";

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (removeTimerRef.current) {
      window.clearTimeout(removeTimerRef.current);
      removeTimerRef.current = null;
    }
  }, []);

  const showLoader = useCallback(() => {
    if (!isHomePath) {
      return;
    }

    clearTimers();
    setIsLeaving(false);
    setIsVisible(true);

    window.requestAnimationFrame(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      video.currentTime = 0;
      void video.play().catch(() => {
        // Mobile browsers can occasionally delay autoplay; the overlay still times out.
      });
    });

    hideTimerRef.current = window.setTimeout(() => {
      setIsLeaving(true);

      removeTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
        setIsLeaving(false);
      }, FADE_DURATION_MS);
    }, LOADING_DURATION_MS);
  }, [clearTimers, isHomePath]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        wasHiddenRef.current = true;
        return;
      }

      if (document.visibilityState === "visible" && wasHiddenRef.current) {
        wasHiddenRef.current = false;
        showLoader();
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        showLoader();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimers();
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearTimers, showLoader]);

  useEffect(() => {
    if (isHomePath) {
      showLoader();
      return;
    }

    clearTimers();
    setIsVisible(false);
    setIsLeaving(false);
  }, [clearTimers, isHomePath, showLoader]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-[#ffe467] px-8 transition-opacity duration-300 ${
        isLeaving ? "opacity-0" : "opacity-100"
      }`}
      aria-live="polite"
      aria-label="Nấu loading"
    >
      <div className="relative h-[100dvh] w-full overflow-hidden text-center">
        <video
          ref={videoRef}
          src={LOADING_VIDEO_SRC}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[280vw] max-h-[1200px] min-h-[920px] w-[280vw] max-w-[1200px] min-w-[920px] -translate-x-1/2 -translate-y-[55%] object-contain saturate-[1.35] contrast-[1.08]"
          muted
          playsInline
          preload="auto"
          autoPlay
        />
        <p className="absolute inset-x-0 top-[77%] mx-auto w-full px-6 text-center text-[24px] font-black leading-tight text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.38)]">
          Let Nâu help you Nấu!
        </p>
      </div>
    </div>
  );
}
