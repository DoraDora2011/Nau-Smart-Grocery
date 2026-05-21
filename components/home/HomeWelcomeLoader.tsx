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
const HOME_WELCOME_SOUND_SRC = "/assets/sound%20effects/welcome-sound-002.mp3";

export function HomeWelcomeLoader() {
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const removeSoundRetryListenersRef = useRef<(() => void) | null>(null);
  const replayWhenVisibleRef = useRef(false);

  const clearWelcomeSoundRetry = useCallback(() => {
    removeSoundRetryListenersRef.current?.();
    removeSoundRetryListenersRef.current = null;
  }, []);

  const stopWelcomeSound = useCallback(() => {
    const audio = audioRef.current;

    clearWelcomeSoundRetry();

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  }, [clearWelcomeSoundRetry]);

  const retryWelcomeSoundAfterGesture = useCallback(() => {
    if (removeSoundRetryListenersRef.current) {
      return;
    }

    const retrySound = () => {
      const audio = audioRef.current;

      if (!audio) {
        clearWelcomeSoundRetry();
        return;
      }

      audio.currentTime = 0;
      void audio.play().then(clearWelcomeSoundRetry).catch(() => undefined);
    };

    window.addEventListener("pointerdown", retrySound, { passive: true });
    window.addEventListener("touchstart", retrySound, { passive: true });
    window.addEventListener("keydown", retrySound);

    removeSoundRetryListenersRef.current = () => {
      window.removeEventListener("pointerdown", retrySound);
      window.removeEventListener("touchstart", retrySound);
      window.removeEventListener("keydown", retrySound);
    };
  }, [clearWelcomeSoundRetry]);

  const playWelcomeSound = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(HOME_WELCOME_SOUND_SRC);
      audio.autoplay = true;
      audio.preload = "auto";
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    audio.currentTime = 0;

    // Browsers can block audible autoplay until the page receives a user gesture.
    void audio.play().then(clearWelcomeSoundRetry).catch(retryWelcomeSoundAfterGesture);
  }, [clearWelcomeSoundRetry, retryWelcomeSoundAfterGesture]);

  const handleWelcomeInteraction = useCallback(() => {
    const audio = audioRef.current;

    if (audio && !audio.paused && !audio.ended) {
      clearWelcomeSoundRetry();
      return;
    }

    playWelcomeSound();
  }, [clearWelcomeSoundRetry, playWelcomeSound]);

  const playWelcome = useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    markHomeWelcomeSeenThisVisit();
    setIsVisible(true);
    playWelcomeSound();
    hideTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      stopWelcomeSound();
      hideTimerRef.current = null;
    }, HOME_WELCOME_DURATION_MS);
  }, [playWelcomeSound, stopWelcomeSound]);

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

      stopWelcomeSound();
    };
  }, [playWelcome, stopWelcomeSound]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[125] flex items-center justify-center overflow-hidden bg-[#FFF1AF] px-8 home-welcome-screen"
      role="status"
      onPointerDown={handleWelcomeInteraction}
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
