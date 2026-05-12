import Image from "next/image";
import Link from "next/link";

import { AppImageButton } from "@/components/AppImageButton";
import { CategoryTabs } from "@/components/home/CategoryTabs";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { HomeOnboardingCarousel } from "@/components/home/HomeOnboardingCarousel";
import { LocationBadgeIcon } from "@/components/home/LocationBadgeIcon";
import { ProductSection } from "@/components/home/ProductSection";
import type {
  HomeCategory,
  HomeCategoryKey,
  HomeProduct,
  HomeProductSection
} from "@/data/home-products";
import { homeBrandAssets } from "@/data/home-products";

interface HomeMobileLayoutProps {
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
  onChooseDeliveryAddress: () => void;
  onReplayOnboarding: () => void;
}

export function HomeMobileLayout({
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
}: HomeMobileLayoutProps) {
  return (
    <div className="min-h-screen bg-[#ebf1a0] pb-28 lg:hidden">
      <section className="mx-1 rounded-b-[58px] rounded-t-[48px] bg-[linear-gradient(180deg,#ffffff_0%,#f2dcff_36%,#cd6cfd_100%)] px-5 pb-6 pt-5 text-black shadow-sm">
        <div className="mx-auto flex max-w-sm justify-center">
          <Image
            src={homeBrandAssets.logoText}
            alt="Nấu Smart Grocery"
            className="h-20 w-auto object-contain"
            priority
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onChooseDeliveryAddress}
            className="flex min-w-0 items-center gap-2 border-0 bg-transparent p-0 text-left text-black active:scale-[0.98]"
            aria-label="Nhập địa chỉ giao hàng"
            title="Nhập địa chỉ giao hàng"
          >
            <LocationBadgeIcon className="h-11 w-11" />
            <span className="min-w-0 max-w-[170px] truncate text-base font-bold leading-tight">{deliveryAddress}</span>
          </button>
          <div className="flex shrink-0 items-center gap-2">
            <AppImageButton
              buttonId="button-023"
              href="/profile"
              size={56}
              className="flex h-14 w-14 items-center justify-center rounded-full text-black"
              data-tour-id="user-profile"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Image
            src={homeBrandAssets.logoMascotBigsize}
            alt="Mascot Nâu"
            className="h-16 w-16 object-contain"
            priority
          />
          <Link
            href="/dish"
            data-tour-id="recipe-mvp"
            className="flex min-h-14 flex-1 items-center gap-3 rounded-full border-0 bg-white px-4 text-sm font-bold shadow-[0_0_0_2.5px_#000000] transition active:scale-[0.98]"
          >
            <Image
              src={homeBrandAssets.mealIcon}
              alt=""
              className="h-8 w-8 shrink-0 object-contain"
            />
            Bạn muốn nấu món gì hôm nay?
          </Link>
        </div>

        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          className="mt-5"
        />
      </section>

      <section className="space-y-5 px-5 pb-12 pt-5">
        <HomeOnboardingCarousel onOpenGuide={onReplayOnboarding} />
        <HomeSearchBar value={searchQuery} onChange={onSearchChange} />

        {activeCategory ? (
          <ProductSection
            title={activeCategoryLabel ?? "Sản phẩm"}
            products={categoryProducts}
            favoriteIds={favoriteIds}
            quantities={quantities}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            onDecreaseQuantity={onDecreaseQuantity}
          />
        ) : searchQuery.trim() ? (
          <ProductSection
            title="Kết quả tìm kiếm"
            products={searchResultProducts}
            favoriteIds={favoriteIds}
            quantities={quantities}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            onDecreaseQuantity={onDecreaseQuantity}
          />
        ) : (
          <>
            <ProductSection
              title="Popular Items"
              products={popularProducts}
              favoriteIds={favoriteIds}
              quantities={quantities}
              onToggleFavorite={onToggleFavorite}
              onAddToCart={onAddToCart}
              onDecreaseQuantity={onDecreaseQuantity}
              isExpanded={expandedSections.has("popular")}
              onToggleViewAll={() => onToggleSection("popular")}
            />
            <ProductSection
              title="Best deal"
              products={bestDealProducts}
              favoriteIds={favoriteIds}
              quantities={quantities}
              onToggleFavorite={onToggleFavorite}
              onAddToCart={onAddToCart}
              onDecreaseQuantity={onDecreaseQuantity}
              isExpanded={expandedSections.has("best-deal")}
              onToggleViewAll={() => onToggleSection("best-deal")}
            />
          </>
        )}
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white px-6 py-4 shadow-[0_-14px_36px_rgba(0,0,0,0.18)]">
        <div className="mx-auto grid max-w-md grid-cols-5 items-center justify-items-center">
          <AppImageButton
            buttonId="button-004"
            href="/"
            size={28}
            className="flex flex-col items-center gap-1 text-black"
          />
          <AppImageButton
            buttonId="button-005"
            href="/favorite"
            size={28}
            className="flex flex-col items-center gap-1 text-black"
          />
          <AppImageButton
            buttonId="button-003"
            href="/scan"
            size={82}
            className="-mt-12 flex h-[82px] w-[82px] items-center justify-center rounded-full text-black shadow-[0_14px_28px_rgba(0,0,0,0.24)]"
            data-tour-id="scan-mvp"
          />
          <AppImageButton
            buttonId="button-006"
            href="#notification"
            size={28}
            className="flex flex-col items-center gap-1 text-black"
          />
          <AppImageButton
            buttonId="button-021"
            href="/cart"
            size={48}
            className="flex h-12 w-12 items-center justify-center justify-self-center rounded-full text-black"
          />
        </div>
      </nav>
    </div>
  );
}
