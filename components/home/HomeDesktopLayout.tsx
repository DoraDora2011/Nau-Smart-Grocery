import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useState } from "react";

import { AppImageButton } from "@/components/AppImageButton";
import { CategoryTabs } from "@/components/home/CategoryTabs";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { LocationBadgeIcon } from "@/components/home/LocationBadgeIcon";
import { NotificationTextLink } from "@/components/notifications/NotificationNavButton";
import { ProductSection } from "@/components/home/ProductSection";
import { useLanguage } from "@/components/providers/language-provider";
import type {
  HomeCategory,
  HomeCategoryKey,
  HomeProduct,
  HomeProductSection
} from "@/data/home-products";
import { homeBrandAssets } from "@/data/home-products";
import { cn } from "@/lib/utils/cn";
import { playUiSound } from "@/lib/utils/ui-sounds";

const desktopGuideVisuals = [
  {
    image: "/assets/buttons/scan-button-001.png",
    imageClassName: "h-[82px] w-[82px]"
  },
  {
    image: "/assets/buttons/function1-button-002.png",
    imageClassName: "h-[78px] w-[78px]"
  },
  {
    image: "/assets/buttons/button-023.png",
    imageClassName: "h-[86px] w-[86px]"
  }
];

const desktopGuideTargets = ["scan-mvp", "recipe-mvp", "user-profile"];

function DesktopGuideSlider({ onOpenGuide }: { onOpenGuide: (target: string) => void }) {
  const { dictionary, locale } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const guideCards =
    locale === "en"
      ? [
          {
            eyebrow: "FEATURE 1 / 3",
            title: "Scan ingredients",
            description:
              "Take or upload a photo of the ingredients you have. Nau will detect food and suggest dishes you can cook right away.",
            imageAlt: "Scan feature"
          },
          {
            eyebrow: "FEATURE 2 / 3",
            title: "Dish lookup",
            description:
              "Enter a dish and serving count. Nau will suggest a recipe, portions, and automatically create a cart.",
            imageAlt: "Dish lookup feature"
          },
          {
            eyebrow: "PERSONALIZE 3 / 3",
            title: "Your profile",
            description:
              "Customize the mascot, save favorite dishes, and manage the shopping experience your own way.",
            imageAlt: "User profile feature"
          }
        ]
      : [
          {
            eyebrow: "CHỨC NĂNG 1 / 3",
            title: "Quét nguyên liệu",
            description:
              "Chụp hoặc tải ảnh nguyên liệu bạn đang có. Nấu sẽ nhận diện thực phẩm và gợi ý món có thể nấu ngay.",
            imageAlt: "Chức năng quét nguyên liệu"
          },
          {
            eyebrow: "CHỨC NĂNG 2 / 3",
            title: "Tra cứu món ăn",
            description:
              "Nhập món ăn và số người, Nấu sẽ gợi ý công thức, khẩu phần và tự động tạo giỏ hàng.",
            imageAlt: "Chức năng tra cứu món ăn"
          },
          {
            eyebrow: "CÁ NHÂN HOÁ 3 / 3",
            title: "Hồ sơ của bạn",
            description:
              "Tuỳ chỉnh mascot, lưu món yêu thích và quản lý trải nghiệm mua sắm theo cách riêng của bạn.",
            imageAlt: "Chức năng hồ sơ người dùng"
          }
        ];
  const activeCard = guideCards[activeIndex];
  const activeVisual = desktopGuideVisuals[activeIndex];
  const activeTarget = desktopGuideTargets[activeIndex];
  const showPreviousCard = () => {
    playUiSound("tap");
    setActiveIndex((activeIndex + guideCards.length - 1) % guideCards.length);
  };
  const showNextCard = () => {
    playUiSound("tap");
    setActiveIndex((activeIndex + 1) % guideCards.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-[560px] xl:max-w-[620px]">
        <button
          type="button"
          aria-label="Xem hướng dẫn trước"
          onClick={showPreviousCard}
          className="absolute -left-7 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_20px_rgba(58,44,23,0.18)] transition hover:scale-105 xl:-left-12"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.6} />
        </button>
        <button
          type="button"
          onClick={() => {
            playUiSound("tap");
            onOpenGuide(activeTarget);
          }}
          className="grid min-h-[180px] w-full grid-cols-[96px_minmax(0,1fr)] items-center gap-4 rounded-[32px] bg-white px-6 py-6 text-left text-black shadow-[0_10px_26px_rgba(58,44,23,0.1)] ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(58,44,23,0.14)] xl:min-h-[196px] xl:grid-cols-[116px_minmax(0,1fr)] xl:gap-5 xl:px-8 xl:py-7"
        >
          <span className="flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-full">
            <Image
              src={activeVisual.image}
              alt={activeCard.imageAlt}
              width={96}
              height={96}
              className={cn("object-contain", activeVisual.imageClassName)}
              priority={activeIndex === 0}
            />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-black uppercase leading-tight tracking-normal text-[#4a7890]">
              {activeCard.eyebrow}
            </span>
            <span className="mt-1.5 block text-2xl font-black leading-tight">
              {activeCard.title}
            </span>
            <span className="mt-3 block text-base font-semibold leading-7 text-black/72">
              {activeCard.description}
            </span>
          </span>
        </button>
        <button
          type="button"
          aria-label="Xem hướng dẫn tiếp theo"
          onClick={showNextCard}
          className="absolute -right-7 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_20px_rgba(58,44,23,0.18)] transition hover:scale-105 xl:-right-12"
        >
          <ChevronRight className="h-6 w-6" strokeWidth={2.6} />
        </button>
      </div>

      <div className="flex w-full max-w-[560px] items-center justify-center gap-2 xl:max-w-[620px]">
        {desktopGuideVisuals.map((visual, index) => (
          <button
            key={visual.image}
            type="button"
            aria-label={`${dictionary.onboarding.carouselLabel} ${index + 1}`}
            onClick={() => {
              playUiSound("tap");
              setActiveIndex(index);
            }}
            className={cn(
              "h-3 rounded-full transition-all",
              activeIndex === index ? "w-8 bg-white" : "w-3 bg-white/45"
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface HomeDesktopLayoutProps {
  categories: HomeCategory[];
  activeCategory: HomeCategoryKey | null;
  searchQuery: string;
  popularProducts: HomeProduct[];
  bestDealProducts: HomeProduct[];
  categoryProducts: HomeProduct[];
  searchResultProducts: HomeProduct[];
  activeCategoryLabel: string | null;
  favoriteIds: Set<string>;
  quantities: Record<string, number>;
  onSelectCategory: (category: HomeCategoryKey | null) => void;
  onSearchChange: (value: string) => void;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: HomeProduct) => void;
  onDecreaseQuantity: (productId: string) => void;
  expandedSections: Set<HomeProductSection>;
  onToggleSection: (section: HomeProductSection) => void;
  deliveryAddress: string;
  customerName: string;
  onChooseDeliveryAddress: () => void;
  onReplayOnboarding: (target?: string) => void;
}

export function HomeDesktopLayout({
  categories,
  activeCategory,
  searchQuery,
  popularProducts,
  bestDealProducts,
  categoryProducts,
  searchResultProducts,
  activeCategoryLabel,
  favoriteIds,
  quantities,
  onSelectCategory,
  onSearchChange,
  onToggleFavorite,
  onAddToCart,
  onDecreaseQuantity,
  expandedSections,
  onToggleSection,
  deliveryAddress,
  onChooseDeliveryAddress,
  onReplayOnboarding
}: HomeDesktopLayoutProps) {
  const { dictionary } = useLanguage();
  return (
    <div className="hidden min-h-screen bg-[#FFF1AF] text-black lg:block">
      <header className="fixed inset-x-0 top-0 z-50 rounded-b-[28px] bg-white shadow-sm">
        <nav className="mx-auto flex h-[92px] max-w-[1480px] items-center justify-between gap-6 px-8 xl:h-[100px] xl:gap-10 xl:px-14">
          <button
            type="button"
            onClick={() => playUiSound("tap")}
            className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#edc7ff] text-black transition hover:scale-105"
            aria-label="Menu"
          >
            <Menu className="h-8 w-8" strokeWidth={2.4} />
          </button>

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

          <div className="flex shrink-0 items-center gap-5 xl:gap-7">
            <LanguageSwitcher />
            <Link
              href="/cart"
              onClick={() => playUiSound("tap")}
              className="flex h-[58px] w-[58px] items-center justify-center transition hover:scale-105"
              aria-label="Mở giỏ hàng"
            >
              <Image
                src="/assets/buttons/button-021.png"
                alt=""
                width={53}
                height={53}
                className="h-[53px] w-[53px] object-contain contrast-[1.08] saturate-[1.05] [image-rendering:-webkit-optimize-contrast]"
              />
            </Link>
            <AppImageButton
              buttonId="button-023"
              href="/profile"
              size={58}
              className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full text-black transition hover:scale-105"
              data-tour-id="user-profile"
            />
          </div>
        </nav>
      </header>

      <section className="relative z-0 flex min-h-[calc(100vh-130px)] overflow-hidden rounded-b-[90px] bg-[linear-gradient(180deg,#ffffff_0%,#edc7ff_42%,#cd6cfd_100%)] px-6 pb-10 pt-[116px] text-black xl:min-h-[calc(100vh-210px)] xl:rounded-b-[110px] xl:px-10 xl:pb-14 xl:pt-[154px]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:gap-16">
          <div className="space-y-6 text-black xl:space-y-8">
            <DesktopGuideSlider onOpenGuide={onReplayOnboarding} />

            <div className="grid max-w-[560px] grid-cols-2 items-stretch gap-5 text-black xl:max-w-[620px] xl:gap-7">
              <div className="group flex min-w-0 flex-col">
                <Link
                  href="/scan"
                  data-tour-id="scan-mvp"
                  onClick={() => playUiSound("scan")}
                  className="flex h-[150px] w-full flex-none flex-col overflow-hidden rounded-[22px] bg-[#FFE76A] text-black shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="relative flex flex-1 flex-col px-5 pb-3 pt-5">
                    <span className="block pr-20 text-sm font-bold leading-tight text-black/38">
                      {dictionary.home.featureLabel}
                    </span>
                    <span className="mt-1 block pr-20 text-xl font-black leading-tight">
                      {dictionary.home.scanIngredients}
                    </span>
                    <Image
                      src="/assets/buttons/function%202-icon-002.png"
                      alt=""
                      width={88}
                      height={88}
                      className="absolute right-4 top-1/2 h-16 w-16 -translate-y-[20%] object-contain"
                    />
                  </span>
                  <span className="flex h-11 items-center justify-between bg-[#ffef9d] px-5 text-xs font-bold leading-none">
                    {dictionary.home.tapHere}
                    <span className="text-3xl font-normal leading-none" aria-hidden="true">
                      ›
                    </span>
                  </span>
                </Link>
                <p className="mt-3 max-w-[260px] text-sm font-semibold leading-6 text-black/65 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {dictionary.home.scanHint}
                </p>
              </div>

              <div className="group flex min-w-0 flex-col">
                <Link
                  href="/dish"
                  data-tour-id="recipe-mvp"
                  onClick={() => playUiSound("tap")}
                  className="flex h-[150px] w-full flex-none flex-col overflow-hidden rounded-[22px] bg-white text-black shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="relative flex flex-1 flex-col px-5 pb-3 pt-5">
                    <span className="block pr-20 text-sm font-bold leading-tight text-black/38">
                      {dictionary.home.featureLabel}
                    </span>
                    <span className="mt-1 block pr-20 text-xl font-black leading-tight">
                      {dictionary.home.dishLookup}
                    </span>
                    <Image
                      src="/assets/buttons/function%201-icon-002.png"
                      alt=""
                      width={88}
                      height={88}
                      className="absolute right-4 top-1/2 h-16 w-16 -translate-y-[20%] object-contain"
                    />
                  </span>
                  <span className="flex h-11 items-center justify-between bg-[#f3f3f3] px-5 text-xs font-bold leading-none">
                    {dictionary.home.tapHere}
                    <span className="text-3xl font-normal leading-none" aria-hidden="true">
                      ›
                    </span>
                  </span>
                </Link>
                <p className="mt-3 max-w-[260px] text-sm font-semibold leading-6 text-black/65 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {dictionary.home.chefHint}
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[430px] items-start justify-center pt-2 xl:min-h-[520px]">
            <div className="absolute inset-8 rounded-[56px] bg-white/15 blur-2xl" />
            <video
              className="pointer-events-none relative h-[340px] w-full max-w-[390px] translate-y-10 scale-[2.05] bg-transparent object-contain brightness-[1.08] saturate-[1.2] xl:h-[360px] xl:max-w-[430px] xl:translate-y-7 xl:scale-[2.57] 2xl:translate-y-6 2xl:scale-[3]"
              src="/models/Animation - Wave.webm"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-label="Nấu mascot waving animation"
            />
            <div className="home-mascot-chat-bubble absolute -right-6 top-16 rounded-[999px] bg-white px-7 py-5 text-lg font-bold leading-snug shadow-sm xl:-right-8 xl:top-[4.5rem] xl:px-9 xl:py-6 xl:text-2xl 2xl:-right-6 2xl:top-20">
              {dictionary.home.mascotGreeting.split("\n").map((line, index) => (
                <span key={line}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-4 pt-10">
        <h2 className="mb-8 text-xl font-bold leading-tight text-black sm:text-2xl">{dictionary.home.shoppingCategories}</h2>
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          className="justify-center gap-14 [&_button]:min-w-28 [&_button]:text-sm [&_button_span:last-child]:max-w-28"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex items-center gap-5">
          <HomeSearchBar
            value={searchQuery}
            onChange={onSearchChange}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => {
              playUiSound("tap");
              onChooseDeliveryAddress();
            }}
            className="flex items-center gap-2 border-0 bg-transparent p-0 text-left text-sm font-bold text-black transition hover:scale-[1.02]"
            aria-label={dictionary.home.inputAddress}
            title={dictionary.home.inputAddress}
          >
            <LocationBadgeIcon className="h-10 w-10" />
            <span className="max-w-[210px] truncate">{deliveryAddress}</span>
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-16 px-6 pb-28 pt-8">
        {activeCategory ? (
          <ProductSection
            title={activeCategoryLabel ?? dictionary.common.product}
            products={categoryProducts}
            favoriteIds={favoriteIds}
            quantities={quantities}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            onDecreaseQuantity={onDecreaseQuantity}
            desktop
          />
        ) : searchQuery.trim() ? (
          <ProductSection
            title={dictionary.common.searchResults}
            products={searchResultProducts}
            favoriteIds={favoriteIds}
            quantities={quantities}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            onDecreaseQuantity={onDecreaseQuantity}
            desktop
          />
        ) : (
          <>
            <ProductSection
              title={dictionary.home.popularItems}
              products={popularProducts}
              favoriteIds={favoriteIds}
              quantities={quantities}
              onToggleFavorite={onToggleFavorite}
              onAddToCart={onAddToCart}
              onDecreaseQuantity={onDecreaseQuantity}
              desktop
              isExpanded={expandedSections.has("popular")}
              onToggleViewAll={() => onToggleSection("popular")}
            />
            <ProductSection
              title={dictionary.home.bestDeal}
              products={bestDealProducts}
              favoriteIds={favoriteIds}
              quantities={quantities}
              onToggleFavorite={onToggleFavorite}
              onAddToCart={onAddToCart}
              onDecreaseQuantity={onDecreaseQuantity}
              desktop
              isExpanded={expandedSections.has("best-deal")}
              onToggleViewAll={() => onToggleSection("best-deal")}
            />
          </>
        )}
      </section>

      <footer className="rounded-t-[34px] bg-white px-6 py-10 text-black xl:px-10 xl:py-12">
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
              <a key={link} href="#footer" onClick={() => playUiSound("tap")} className="hover:underline">
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
    </div>
  );
}
