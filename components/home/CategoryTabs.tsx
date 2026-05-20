"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { HomeCategory, HomeCategoryKey } from "@/data/home-products";
import { cn } from "@/lib/utils/cn";

interface CategoryTabsProps {
  categories: HomeCategory[];
  activeCategory: HomeCategoryKey | null;
  onSelectCategory: (category: HomeCategoryKey | null) => void;
  className?: string;
}

const categoryButtonImageByKey: Record<HomeCategoryKey, string> = {
  vegetables: "/assets/buttons/vegetable-002.png",
  dairy: "/assets/buttons/dairy-002.png",
  "meat-seafood": "/assets/buttons/meat-002.png",
  grains: "/assets/buttons/carb-002.png",
  sauces: "/assets/buttons/seasoning-002.png"
};

const homeButtonImage = "/assets/buttons/bestdeal-002.png";

const circleClass =
  "flex h-14 w-14 items-center justify-center rounded-full text-sm font-black text-black shadow-sm transition-transform duration-300 ease-out";
const imageCircleClass =
  "flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-transparent transition-transform duration-300 ease-out";

export function CategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
  className
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorStep, setIndicatorStep] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const [scales, setScales] = useState<number[]>(() => Array(categories.length + 1).fill(1));

  const centerCategoryItem = (itemIndex: number) => {
    const container = scrollRef.current;
    const item = itemRefs.current[itemIndex];

    if (!container || !item) {
      return;
    }

    const maxScrollLeft = Math.max(container.scrollWidth - container.clientWidth, 0);
    const targetScrollLeft =
      item.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2;

    container.scrollTo({
      left: Math.min(Math.max(targetScrollLeft, 0), maxScrollLeft),
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    let frame = 0;

    const updateMotionState = () => {
      const maxScroll = Math.max(container.scrollWidth - container.clientWidth, 0);
      const progress = maxScroll > 0 ? container.scrollLeft / maxScroll : 0;
      const viewportCenter = container.scrollLeft + container.clientWidth / 2;

      setShowIndicator(maxScroll > 8);
      setIndicatorStep(Math.min(2, Math.round(progress * 2)));

      const nextScales = itemRefs.current.map((item) => {
        if (!item) {
          return 1;
        }

        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(itemCenter - viewportCenter);
        const influence = Math.max(0, 1 - distance / (container.clientWidth * 0.55));

        return Number((1 + influence * 0.16).toFixed(3));
      });

      setScales(nextScales);
    };

    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateMotionState);
    };

    requestUpdate();
    container.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [categories.length]);

  return (
    <div className="space-y-3">
      <div
        ref={scrollRef}
        className={cn(
          "home-category-tabs flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className
        )}
      >
        <button
          ref={(node) => {
            itemRefs.current[0] = node;
          }}
          type="button"
          onClick={() => {
            centerCategoryItem(0);
            onSelectCategory(null);
          }}
          className="group flex min-w-24 flex-col items-center justify-start gap-2.5 px-2 py-2 text-center text-sm font-semibold transition"
        >
          <span
            className={cn(
              circleClass,
              activeCategory === null
                ? "bg-[linear-gradient(135deg,#ffe467,#fff7ae)] shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                : "bg-[#ffe467]"
            )}
            style={{ transform: `scale(${scales[0] ?? 1})` }}
          >
            <Image
              src={homeButtonImage}
              alt="Best deal"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
          </span>
          <span className="leading-tight">{"Best deal"}</span>
        </button>

        {categories.map((category, index) => {
          const active = activeCategory === category.key;

          return (
            <button
              key={category.key}
              ref={(node) => {
                itemRefs.current[index + 1] = node;
              }}
              type="button"
              onClick={() => {
                centerCategoryItem(index + 1);
                onSelectCategory(category.key);
              }}
              className={cn(
                "group flex min-w-24 flex-col items-center justify-start gap-2.5 rounded-[28px] px-2 py-2 text-center text-sm font-semibold transition",
                active
                  ? "bg-white/45 shadow-[0_8px_18px_rgba(0,0,0,0.07)]"
                  : "hover:bg-white/25"
              )}
            >
              <span
                className={imageCircleClass}
                style={{ transform: `scale(${scales[index + 1] ?? 1})` }}
              >
                <Image
                  src={categoryButtonImageByKey[category.key]}
                  alt={category.label}
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                />
              </span>
              <span className="leading-tight">{category.label}</span>
            </button>
          );
        })}
      </div>

      {showIndicator ? (
        <div className="flex items-center justify-center gap-3 md:hidden">
          {[0, 1, 2].map((step) => {
            const active = step === indicatorStep;

            return (
              <span
                key={step}
                className={cn(
                  "block h-2.5 rounded-full transition-all duration-300 ease-out",
                  active ? "w-7 bg-[#cd6cfd]" : "w-2.5 bg-[#cd6cfd]/25"
                )}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
