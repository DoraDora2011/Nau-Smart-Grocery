"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const ONBOARDING_STORAGE_KEY = "nau_onboarding_seen";

declare global {
  interface Window {
    NauOnboarding?: {
      replay: () => void;
      reset: () => void;
    };
  }
}

type TourStep = {
  target: string;
  title: string;
  description: string;
};

const steps: TourStep[] = [
  {
    target: "scan-mvp",
    title: "Quét nguyên liệu còn lại",
    description:
      "Chụp ảnh hoặc tải ảnh nguyên liệu bạn đang có. Nấu sẽ nhận diện thực phẩm và gợi ý những món có thể nấu ngay, giúp bạn tận dụng đồ ăn còn lại và giảm lãng phí."
  },
  {
    target: "recipe-mvp",
    title: "Nấu món bạn muốn cho nhiều người",
    description:
      "Nhập tên món ăn và số người dùng bữa. AI sẽ gợi ý công thức, tự điều chỉnh định lượng nguyên liệu và hỗ trợ thêm danh sách cần mua vào giỏ hàng."
  },
  {
    target: "user-profile",
    title: "Cá nhân hoá nhân vật của bạn",
    description:
      "Vào User Profile để chọn outfit cho character đại diện của bạn. Bạn có thể thay đổi phong cách nhân vật để trải nghiệm mua sắm trở nên vui hơn và cá nhân hơn."
  }
];

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function getVisibleTarget(targetId: string) {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-tour-id="${targetId}"]`)
  );

  return candidates.find((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) !== 0
    );
  });
}

function getPaddedRect(rect: DOMRect): HighlightRect {
  const padding = 8;
  const top = Math.max(8, rect.top - padding);
  const left = Math.max(8, rect.left - padding);
  const right = Math.min(window.innerWidth - 8, rect.right + padding);
  const bottom = Math.min(window.innerHeight - 8, rect.bottom + padding);

  return {
    top,
    left,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  };
}

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<HighlightRect | null>(null);
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const openTour = useCallback(() => {
    setCurrentStep(0);
    setTargetRect(null);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const replayTour = () => {
      try {
        window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      } catch {
        // Storage can be unavailable in private contexts; replay still works for this session.
      }

      openTour();
    };

    window.NauOnboarding = {
      replay: replayTour,
      reset: replayTour
    };
    window.addEventListener("nau-smart-grocery:replay-onboarding", replayTour);

    const url = new URL(window.location.href);
    const shouldReplayFromUrl =
      url.searchParams.get("onboarding") === "1" || url.searchParams.get("tour") === "1";

    if (shouldReplayFromUrl) {
      url.searchParams.delete("onboarding");
      url.searchParams.delete("tour");
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
      replayTour();

      return () => {
        window.removeEventListener("nau-smart-grocery:replay-onboarding", replayTour);
        delete window.NauOnboarding;
      };
    }

    try {
      if (window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true") {
        return () => {
          window.removeEventListener("nau-smart-grocery:replay-onboarding", replayTour);
          delete window.NauOnboarding;
        };
      }

      openTour();
    } catch {
      openTour();
    }

    return () => {
      window.removeEventListener("nau-smart-grocery:replay-onboarding", replayTour);
      delete window.NauOnboarding;
    };
  }, [openTour]);

  const updateTargetRect = useCallback(() => {
    if (!step) {
      setTargetRect(null);
      return;
    }

    const target = getVisibleTarget(step.target);

    if (!target) {
      setTargetRect(null);
      return;
    }

    setTargetRect(getPaddedRect(target.getBoundingClientRect()));
  }, [step]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(updateTargetRect);
    const delayedUpdate = window.setTimeout(updateTargetRect, 120);

    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(delayedUpdate);
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect, true);
    };
  }, [isOpen, updateTargetRect]);

  const finishTour = useCallback(() => {
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch {
      // If storage is unavailable, still close the tour for this session.
    }

    setIsOpen(false);
  }, []);

  const popupStyle = useMemo(() => {
    if (!targetRect) {
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
      };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = Math.min(360, viewportWidth - 32);
    const gap = 14;
    const estimatedPopupHeight = 360;
    const canPlaceBelow = targetRect.top + targetRect.height + gap + estimatedPopupHeight < viewportHeight;
    const top = canPlaceBelow
      ? targetRect.top + targetRect.height + gap
      : Math.max(16, targetRect.top - estimatedPopupHeight - gap);
    const left = Math.min(
      Math.max(16, targetRect.left + targetRect.width / 2 - popupWidth / 2),
      viewportWidth - popupWidth - 16
    );

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${popupWidth}px`,
      transform: "none"
    };
  }, [targetRect]);

  if (!isOpen || !step) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] text-black" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      {targetRect ? (
        <>
          <div
            className="fixed inset-0 bg-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none fixed rounded-[26px] border-[3px] border-white"
            style={{
              ...targetRect,
              boxShadow:
                "0 0 0 9999px rgba(0,0,0,0.45), 0 0 0 4px rgba(255,228,103,0.95), 0 18px 45px rgba(0,0,0,0.26)"
            }}
          />
        </>
      ) : (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px]" />
      )}

      <div
        className="fixed max-w-[calc(100vw-2rem)] rounded-[26px] border-2 border-black bg-white px-5 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:px-6"
        style={popupStyle}
      >
        <div className="mb-4 flex items-center gap-2">
          {steps.map((item, index) => (
            <span
              key={item.target}
              className={`h-2.5 rounded-full transition-all ${
                index === currentStep ? "w-8 bg-[#cd6cfd]" : "w-2.5 bg-black/18"
              }`}
            />
          ))}
        </div>

        <p className="text-xs font-black uppercase leading-tight text-[#4a7890]">
          Bước {currentStep + 1} / {steps.length}
        </p>
        <h2 id="onboarding-title" className="mt-2 text-xl font-black leading-tight sm:text-2xl">
          {step.title}
        </h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-black/68">
          {step.description}
        </p>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={finishTour}
            className="rounded-full border-2 border-black bg-white px-5 py-2.5 text-sm font-black leading-tight text-black transition active:scale-[0.98]"
          >
            Bỏ qua hướng dẫn
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLastStep) {
                finishTour();
                return;
              }

              setCurrentStep((current) => Math.min(current + 1, steps.length - 1));
            }}
            className="rounded-full border-2 border-black bg-[#ffe467] px-5 py-2.5 text-sm font-black leading-tight text-black shadow-[0_6px_0_rgba(0,0,0,0.16)] transition active:translate-y-0.5 active:shadow-[0_4px_0_rgba(0,0,0,0.16)]"
          >
            {isLastStep ? "Hoàn tất" : "Tiếp theo"}
          </button>
        </div>
      </div>
    </div>
  );
}
