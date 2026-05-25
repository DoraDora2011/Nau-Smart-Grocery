"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";

import { AppImageButton } from "@/components/AppImageButton";
import { DesktopFunctionHero } from "@/components/function/DesktopFunctionHero";
import { DesktopCategoryMenu } from "@/components/layout/DesktopCategoryMenu";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NotificationTextLink } from "@/components/notifications/NotificationNavButton";
import { RecipeWorkflow } from "@/components/recipe/recipe-workflow";
import { useLanguage } from "@/components/providers/language-provider";
import { homeBrandAssets } from "@/data/home-products";
import { playUiSound } from "@/lib/utils/ui-sounds";

function DesktopDishHeader() {
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

type DesktopDishHeroProps = {
  onOpenGuide: () => void;
};

function DesktopDishHero({ onOpenGuide }: DesktopDishHeroProps) {
  const { locale } = useLanguage();
  const copy =
    locale === "vi"
      ? {
          lead: "Bạn muốn nấu một món ăn cho gia đình, bạn bè hoặc một bữa ăn nhiều người?",
          highlight: "Chỉ cần nhập tên món và số người ăn,",
          body: "“Nấu” sẽ gợi ý công thức, chia khẩu phần nguyên liệu và tự động thêm những món cần mua vào giỏ hàng.",
          cta: "Hướng dẫn sử dụng"
        }
      : {
          lead: "Want to cook for family, friends, or a group meal?",
          highlight: "Just enter a dish name and serving count,",
          body: "“Nấu” will suggest a recipe, portion the ingredients, and add needed items to your cart.",
          cta: "How to use"
        };

  return (
    <DesktopFunctionHero
      iconSlot={
        <div className="flex h-[146px] w-[146px] shrink-0 items-center justify-center rounded-full bg-white shadow-sm xl:h-[158px] xl:w-[158px]">
          <Image
            src="/assets/buttons/chatbox-icon-desktop.png"
            alt=""
            width={92}
            height={92}
            className="h-[92px] w-[92px] object-contain xl:h-[100px] xl:w-[100px]"
            priority
          />
        </div>
      }
      intro={
        <>
          {copy.lead}
          <br />
          <span className="text-[#8A38F5]">{copy.highlight}</span> <span>{copy.body}</span>
        </>
      }
      ctaLabel={copy.cta}
      onCtaClick={() => {
        playUiSound("tap");
        onOpenGuide();
      }}
    />
  );
}

function DesktopDishGuideModal({ onClose }: { onClose: () => void }) {
  const { locale } = useLanguage();
  const copy =
    locale === "vi"
      ? {
          title: "Hướng dẫn sử dụng",
          understood: "Đã hiểu",
          steps: [
            {
              title: "Nhập món bạn muốn nấu",
              description: "Ví dụ: “mì Ý sốt bò bằm”, “lẩu Thái”, “cơm gà”, “bún bò”."
            },
            {
              title: "Nhập số người ăn",
              description: "“Nấu” sẽ tự động tính khẩu phần nguyên liệu phù hợp với số lượng người dùng bữa."
            },
            {
              title: "Xem công thức và nguyên liệu",
              description: "Bạn sẽ nhận được danh sách nguyên liệu, định lượng gợi ý và các bước nấu cơ bản."
            },
            {
              title: "Tạo giỏ hàng tự động",
              description: "Những nguyên liệu cần mua sẽ được thêm vào giỏ hàng để bạn có thể kiểm tra và điều chỉnh trước khi mua."
            }
          ]
        }
      : {
          title: "How to use",
          understood: "Got it",
          steps: [
            {
              title: "Enter the dish you want",
              description: "For example: spaghetti bolognese, Thai hotpot, chicken rice, or beef noodle soup."
            },
            {
              title: "Enter serving count",
              description: "Nấu will calculate ingredient portions that match the number of diners."
            },
            {
              title: "Review recipe and ingredients",
              description: "You will receive an ingredient list, suggested quantities, and basic cooking steps."
            },
            {
              title: "Create a cart automatically",
              description: "Ingredients to buy will be added to your cart so you can review and adjust them before checkout."
            }
          ]
        };

  return (
    <div
      className="fixed inset-0 z-[110] hidden items-center justify-center overflow-y-auto bg-black/40 px-8 py-10 text-black lg:flex"
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <div className="my-auto flex w-full max-w-[1120px] flex-col items-center">
        <div
          className="flex w-full flex-col items-center rounded-[24px] px-10 py-9 shadow-[0_20px_54px_rgba(0,0,0,0.22)] xl:px-12 xl:py-10"
          style={{ backgroundColor: "#ffe66b" }}
        >
          <h2
            className="text-center font-black"
            style={{ fontSize: "clamp(38px, 2.8vw, 48px)", lineHeight: 1.05 }}
          >
            {copy.title}
          </h2>
          <div className="mt-8 grid w-full grid-cols-2 gap-6 xl:mt-10 xl:grid-cols-4 xl:gap-7">
            {copy.steps.map((step, index) => (
              <article
                key={step.title}
                className="grid min-h-[330px] rounded-[18px] bg-white px-6 py-7 shadow-[0_10px_22px_rgba(0,0,0,0.14)] xl:min-h-[350px] xl:px-7 xl:py-8"
                style={{ gridTemplateRows: "150px 1fr" }}
              >
                <div className="flex flex-col items-start gap-5">
                  <span
                    className="shrink-0 text-black"
                    style={{
                      alignItems: "center",
                      backgroundColor: "#e9b8ff",
                      borderRadius: "9999px",
                      display: "flex",
                      fontSize: 30,
                      fontWeight: 900,
                      height: 56,
                      justifyContent: "center",
                      lineHeight: 1,
                      width: 56
                    }}
                  >
                    {index + 1}
                  </span>
                  <h3
                    className="font-extrabold"
                    style={{ fontSize: 23, lineHeight: 1.22 }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p
                  className="self-start pt-2 font-bold"
                  style={{ fontSize: 16.5, lineHeight: 1.55 }}
                >
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            playUiSound("tap");
            onClose();
          }}
          className="mt-7 w-full max-w-[19rem] rounded-full bg-white px-8 py-4 text-xl font-black text-black shadow-[0_6px_0_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_rgba(0,0,0,0.16)] active:translate-y-0.5 active:shadow-[0_4px_0_rgba(0,0,0,0.18)]"
        >
          {copy.understood}
        </button>
      </div>
    </div>
  );
}

function DesktopDishFooter() {
  const { dictionary } = useLanguage();

  return (
    <footer id="policy" className="hidden rounded-t-[34px] bg-white px-6 py-10 text-black lg:block xl:px-10 xl:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-[0.95fr_1.35fr_1.5fr] items-start gap-8 xl:grid-cols-[1.1fr_1.4fr_1.8fr] xl:gap-12">
        <div className="space-y-4">
          <Image
            src={homeBrandAssets.logoText}
            alt="Nấu Smart Grocery"
            className="h-32 w-auto object-contain xl:h-40"
          />
          <p className="text-sm font-bold leading-tight xl:text-[15px]">{dictionary.home.contact}</p>
        </div>

        <div className="grid content-start grid-cols-2 gap-x-8 gap-y-4 pt-6 text-sm font-bold leading-tight xl:gap-x-12 xl:gap-y-5 xl:pt-8 xl:text-[15px]">
          {dictionary.home.footerLinks.map((link) => (
            <a key={link} href="#policy" onClick={() => playUiSound("tap")} className="hover:underline">
              {link}
            </a>
          ))}
        </div>

        <div className="space-y-2.5 pt-6 text-right text-sm font-bold leading-tight xl:space-y-3 xl:pt-8 xl:text-[15px]">
          {dictionary.home.companyInfo.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function DishPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-[#FFF1AF] text-black">
      <DesktopDishHeader />
      <DesktopDishHero onOpenGuide={() => setIsGuideOpen(true)} />
      {isGuideOpen ? <DesktopDishGuideModal onClose={() => setIsGuideOpen(false)} /> : null}

      <section className="lg:px-[clamp(2rem,5vw,4rem)] lg:py-[clamp(3rem,5vw,4.5rem)]">
        <Suspense fallback={<p className="text-sm text-[var(--color-ink-soft)]">Đang mở công thức...</p>}>
          <RecipeWorkflow />
        </Suspense>
      </section>

      <DesktopDishFooter />
    </div>
  );
}
