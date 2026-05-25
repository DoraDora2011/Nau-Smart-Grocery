"use client";

import type { ReactNode } from "react";

type DesktopFunctionHeroProps = {
  iconSlot: ReactNode;
  intro: ReactNode;
  ctaLabel: string;
  onCtaClick: () => void;
};

export function DesktopFunctionHero({
  iconSlot,
  intro,
  ctaLabel,
  onCtaClick,
}: DesktopFunctionHeroProps) {
  return (
    <section className="hidden rounded-b-[56px] bg-[linear-gradient(180deg,#f4dff8_0%,#d78cf4_58%,#c766f3_100%)] px-8 pb-20 pt-[calc(100px+4rem)] text-black lg:block">
      <div className="mx-auto flex max-w-[1240px] items-center gap-[clamp(3rem,6vw,6rem)]">
        {iconSlot}
        <div className="max-w-[860px]">
          <p className="text-[clamp(1.35rem,1.9vw,1.85rem)] font-black leading-[1.45]">{intro}</p>
          <button
            type="button"
            onClick={onCtaClick}
            className="mt-10 inline-flex h-14 min-w-[278px] items-center justify-center rounded-[20px] bg-white px-8 text-lg font-black text-black shadow-[0_6px_12px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
