"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import { interpolate } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils/cn";

type GuideCardVisual = {
  target: string;
  image: string | StaticImageData;
  cardClassName: string;
  imageClassName: string;
};

const guideCardVisuals: GuideCardVisual[] = [
  {
    target: "scan-mvp",
    image: "/assets/buttons/scan-button-001.png",
    cardClassName: "bg-[#FFFFFF]",
    imageClassName: "h-[68px] w-[68px]"
  },
  {
    target: "recipe-mvp",
    image: "/assets/buttons/function1-button-002.png",
    cardClassName: "bg-[#FFFFFF]",
    imageClassName: "h-[62px] w-[62px]"
  },
  {
    target: "user-profile",
    image: "/assets/buttons/button-023.png",
    cardClassName: "bg-[#FFFFFF]",
    imageClassName: "h-[70px] w-[70px]"
  }
];

interface HomeOnboardingCarouselProps {
  onOpenGuide: (target: string) => void;
}

export function HomeOnboardingCarousel({ onOpenGuide }: HomeOnboardingCarouselProps) {
  const { dictionary } = useLanguage();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const pauseAutoSlideRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragBlockedClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToCard = useCallback((index: number) => {
    const container = scrollRef.current;
    const item = itemRefs.current[index];

    if (!container || !item) {
      return;
    }

    container.scrollTo({
      left: item.offsetLeft,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    let frame = 0;

    const updateActiveIndex = () => {
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      const nextIndex = itemRefs.current.reduce((nearestIndex, item, index) => {
        if (!item) {
          return nearestIndex;
        }

        const itemCenter = item.offsetLeft + item.clientWidth / 2;
        const nearestItem = itemRefs.current[nearestIndex];
        const nearestCenter = nearestItem
          ? nearestItem.offsetLeft + nearestItem.clientWidth / 2
          : itemCenter;

        return Math.abs(itemCenter - containerCenter) <
          Math.abs(nearestCenter - containerCenter)
          ? index
          : nearestIndex;
      }, 0);

      setActiveIndex(nextIndex);
    };

    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveIndex);
    };

    requestUpdate();
    container.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (pauseAutoSlideRef.current) {
        return;
      }

      scrollToCard((activeIndex + 1) % guideCardVisuals.length);
    }, 10000);

    return () => window.clearInterval(interval);
  }, [activeIndex, scrollToCard]);

  return (
    <div className="space-y-2" aria-label={dictionary.onboarding.carouselLabel}>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={(event) => {
          pauseAutoSlideRef.current = true;
          dragStartXRef.current = event.clientX;
          dragBlockedClickRef.current = false;
        }}
        onPointerMove={(event) => {
          if (Math.abs(event.clientX - dragStartXRef.current) > 8) {
            dragBlockedClickRef.current = true;
          }
        }}
        onPointerUp={() => {
          pauseAutoSlideRef.current = false;
          window.setTimeout(() => {
            dragBlockedClickRef.current = false;
          }, 0);
        }}
        onPointerCancel={() => {
          pauseAutoSlideRef.current = false;
          dragBlockedClickRef.current = false;
        }}
      >
        {guideCardVisuals.map((card, index) => {
          const copy = dictionary.onboarding.cards[index];

          return (
            <button
              key={card.target}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              className={cn(
                "grid min-w-full snap-center grid-cols-[82px_minmax(0,1fr)] items-center gap-3 rounded-[24px] px-4 py-4 text-left text-black active:scale-[0.99]",
                card.cardClassName
              )}
              onClick={() => {
                if (dragBlockedClickRef.current) {
                  return;
                }

                onOpenGuide(card.target);
              }}
            >
              <span className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full">
                <Image
                  src={card.image}
                  alt={copy.imageAlt}
                  width={76}
                  height={76}
                  className={cn("object-contain", card.imageClassName)}
                />
              </span>
              <span className="min-w-0 px-1 py-1">
                <span className="block text-[10px] font-black uppercase leading-tight text-[#4a7890]">
                  {copy.eyebrow}
                </span>
                <span className="mt-1 block text-[15px] font-black leading-tight">
                  {copy.title}
                </span>
                <span className="mt-2 block text-[11px] font-semibold leading-[1.45] text-black/72">
                  {copy.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2">
        {guideCardVisuals.map((card, index) => (
          <button
            key={card.target}
            type="button"
            aria-label={interpolate(dictionary.onboarding.carouselIndicator, { index: index + 1 })}
            onClick={() => scrollToCard(index)}
            className={cn(
              "h-2.5 rounded-full transition-all",
              activeIndex === index ? "w-7 bg-white" : "w-2.5 bg-white/35"
            )}
          />
        ))}
      </div>
    </div>
  );
}
