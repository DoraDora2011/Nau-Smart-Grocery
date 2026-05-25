"use client";

import Image from "next/image";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useLanguage } from "@/components/providers/language-provider";
import { homeCategories, type HomeCategoryKey } from "@/data/home-products";
import { playUiSound } from "@/lib/utils/ui-sounds";

const categoryButtonImageByKey: Record<HomeCategoryKey, string> = {
  vegetables: "/assets/buttons/vegetable-002.png",
  dairy: "/assets/buttons/dairy-002.png",
  "meat-seafood": "/assets/buttons/meat-002.png",
  grains: "/assets/buttons/carb-002.png",
  sauces: "/assets/buttons/seasoning-002.png",
};

const homeButtonImage = "/assets/buttons/bestdeal-002.png";
const HOME_CATEGORY_ANCHOR = "home-category-section";
const HOME_CATEGORY_EVENT = "nau-smart-grocery:select-home-category";

type CategoryMenuItem = {
  key: HomeCategoryKey | null;
  label: string;
  image: string;
};

function buildCategoryHref(category: HomeCategoryKey | null) {
  const value = category ?? "all";

  return `/?category=${value}#${HOME_CATEGORY_ANCHOR}`;
}

export function DesktopCategoryMenu() {
  const { dictionary } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const items: CategoryMenuItem[] = [
    {
      key: null,
      label: dictionary.categories.all,
      image: homeButtonImage,
    },
    ...homeCategories.map((category) => ({
      key: category.key,
      label: dictionary.categories[category.key],
      image: categoryButtonImageByKey[category.key],
    })),
  ];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectCategory = (category: HomeCategoryKey | null) => {
    playUiSound("tap");
    setIsOpen(false);

    if (pathname === "/") {
      window.history.pushState(null, "", buildCategoryHref(category));
      window.dispatchEvent(
        new CustomEvent(HOME_CATEGORY_EVENT, {
          detail: { category },
        })
      );
      return;
    }

    router.push(buildCategoryHref(category) as Route);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          playUiSound("tap");
          setIsOpen((current) => !current);
        }}
        className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#edc7ff] text-black transition hover:scale-105"
        aria-label={isOpen ? "Đóng danh mục sản phẩm" : "Mở danh mục sản phẩm"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-8 w-8" strokeWidth={2.4} /> : <Menu className="h-8 w-8" strokeWidth={2.4} />}
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-[92px] z-40 cursor-default bg-transparent xl:top-[100px]"
            aria-label="Đóng danh mục sản phẩm"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed left-0 top-[92px] z-50 hidden h-[calc(100dvh-92px)] w-[208px] overflow-y-auto bg-[#edc7ff] px-5 py-8 text-black shadow-[14px_16px_34px_rgba(0,0,0,0.08)] lg:block xl:top-[100px] xl:h-[calc(100dvh-100px)]">
            <h2 className="mb-7 text-center text-base font-black leading-tight">
              {dictionary.shop.categories}
            </h2>
            <div className="flex flex-col items-center gap-7">
              {items.map((item) => (
                <button
                  key={item.key ?? "all"}
                  type="button"
                  onClick={() => handleSelectCategory(item.key)}
                  className="group flex w-full flex-col items-center gap-2 text-center text-sm font-bold leading-tight text-black transition hover:-translate-y-0.5"
                >
                  <span className="flex h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-full bg-[#d7fdd9] shadow-sm transition group-hover:scale-105">
                    <Image
                      src={item.image}
                      alt=""
                      width={62}
                      height={62}
                      className="h-[62px] w-[62px] object-contain contrast-[1.08] saturate-[1.05] [image-rendering:-webkit-optimize-contrast]"
                    />
                  </span>
                  <span className="max-w-[145px]">{item.label}</span>
                </button>
              ))}
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}

export { HOME_CATEGORY_ANCHOR, HOME_CATEGORY_EVENT };
