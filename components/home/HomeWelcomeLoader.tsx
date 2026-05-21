"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import logoText from "@/assets/brand_logo/logo-text.png";
import {
  hasSeenHomeWelcomeThisVisit,
  markHomeWelcomeSeenThisVisit,
  resetHomeWelcomeForNextReturn
} from "@/lib/utils/home-welcome";

const HOME_WELCOME_DURATION_MS = 3000;

export function HomeWelcomeLoader() {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const replayWhenVisibleRef = useRef(false);

  const playWelcome = useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    markHomeWelcomeSeenThisVisit();
    setIsVisible(true);
    hideTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      hideTimerRef.current = null;
    }, HOME_WELCOME_DURATION_MS);
  }, []);

  useEffect(() => {
    if (!hasSeenHomeWelcomeThisVisit()) {
      playWelcome();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        replayWhenVisibleRef.current = true;
        resetHomeWelcomeForNextReturn();
        return;
      }

      if (document.visibilityState === "visible" && replayWhenVisibleRef.current) {
        replayWhenVisibleRef.current = false;
        playWelcome();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, [playWelcome]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[125] flex items-center justify-center overflow-hidden bg-[#FFF1AF] px-8 home-welcome-screen"
      role="status"
      aria-label="Chào mừng đến với Nấu Smart Grocery"
    >
      <Image
        src={logoText}
        alt="Nấu Smart Grocery"
        priority
        loading="eager"
        className="h-auto w-[min(72vw,22rem)] object-contain home-welcome-logo"
      />
    </div>
  );
}
