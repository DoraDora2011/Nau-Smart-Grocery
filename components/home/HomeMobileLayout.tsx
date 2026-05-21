import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  customerName: string;
  onUpdateDeliveryAddress: (address: string) => void;
  onReplayOnboarding: (target?: string) => void;
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
  customerName,
  onUpdateDeliveryAddress,
  onReplayOnboarding
}: HomeMobileLayoutProps) {
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState(deliveryAddress);

  const openLocationPopup = () => {
    setAddressDraft(deliveryAddress);
    setIsLocationPopupOpen(true);
  };

  const closeLocationPopup = () => {
    setIsLocationPopupOpen(false);
  };

  const saveLocationPopup = () => {
    const nextAddress = addressDraft.trim();

    if (!nextAddress) {
      return;
    }

    onUpdateDeliveryAddress(nextAddress);
    closeLocationPopup();
  };

  return (
    <div className="min-h-screen bg-[#FFF1AF] pb-[calc(7rem+env(safe-area-inset-bottom))] lg:hidden">
      <section className="rounded-b-[30px] bg-[linear-gradient(180deg,#ffffff_0%,#f2dcff_36%,#cd6cfd_100%)] px-5 pb-5 pt-[calc(2rem+env(safe-area-inset-top))] text-black shadow-sm">
        <div className="flex flex-row-reverse items-center justify-between gap-4">
          <button
            type="button"
            onClick={openLocationPopup}
            className="flex shrink-0 items-center border-0 bg-transparent p-0 text-black active:scale-[0.98]"
            aria-label="Nhập địa chỉ giao hàng"
            title="Nhập địa chỉ giao hàng"
          >
            <LocationBadgeIcon className="h-11 w-11" />
          </button>
          <div className="flex min-w-0 shrink items-center gap-3">
            <AppImageButton
              buttonId="button-023"
              href="/profile"
              size={56}
              className="flex h-14 w-14 items-center justify-center rounded-full text-black"
              data-tour-id="user-profile"
            />
            {customerName ? (
              <span className="max-w-[9rem] truncate text-base font-black leading-tight">{customerName}</span>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/dish"
            data-tour-id="recipe-mvp"
            className="flex min-h-[136px] flex-col overflow-hidden rounded-[16px] bg-white text-black transition active:scale-[0.98]"
          >
            <span className="relative flex flex-1 flex-col px-3.5 pb-2 pt-4">
              <span className="block pr-14 text-sm font-bold leading-tight text-black/38">
                Chức năng
              </span>
              <span className="mt-0.5 block pr-14 text-base font-black leading-[1.05]">
                Tra cứu món ăn
              </span>
              <Image
                src="/assets/buttons/function%201-icon-002.png"
                alt=""
                width={72}
                height={72}
                className="absolute right-2 top-1/2 h-14 w-14 -translate-y-[12%] object-contain"
              />
            </span>
            <span className="flex h-10 items-center justify-between bg-[#f3f3f3] px-3.5 text-xs font-bold leading-none">
              Nhấn vào đây
              <span className="text-2xl font-normal leading-none" aria-hidden="true">
                ›
              </span>
            </span>
          </Link>
          <Link
            href="/scan"
            data-tour-id="scan-mvp"
            className="flex min-h-[136px] flex-col overflow-hidden rounded-[16px] bg-[#FFE76A] text-black transition active:scale-[0.98]"
          >
            <span className="relative flex flex-1 flex-col px-3.5 pb-2 pt-4">
              <span className="block pr-14 text-sm font-bold leading-tight text-black/38">
                Chức năng
              </span>
              <span className="mt-0.5 block pr-14 text-base font-black leading-[1.05]">
                Scan nguyên liệu
              </span>
              <Image
                src="/assets/buttons/function%202-icon-002.png"
                alt=""
                width={72}
                height={72}
                className="absolute right-2 top-1/2 h-14 w-14 -translate-y-[12%] object-contain"
              />
            </span>
            <span className="flex h-10 items-center justify-between bg-[#ffef9d] px-3.5 text-xs font-bold leading-none">
              Nhấn vào đây
              <span className="text-2xl font-normal leading-none" aria-hidden="true">
                ›
              </span>
            </span>
          </Link>
        </div>

        <div className="mt-6">
          <HomeOnboardingCarousel onOpenGuide={onReplayOnboarding} />
        </div>
      </section>

      {isLocationPopupOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-5">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-5 text-black shadow-[0_18px_48px_rgba(0,0,0,0.24)]">
            <h2 className="text-lg font-black leading-tight">Địa chỉ giao hàng</h2>
            <p className="mt-2 text-sm font-semibold leading-5 text-black/60">
              Kiểm tra hoặc chỉnh sửa địa chỉ giao hàng của bạn.
            </p>
            <label className="mt-5 block text-xs font-black uppercase leading-tight text-black/55">
              Địa chỉ hiện tại
            </label>
            <input
              value={addressDraft}
              onChange={(event) => setAddressDraft(event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border-2 border-black bg-white px-4 text-sm font-bold outline-none focus:border-[#cd6cfd]"
              autoFocus
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeLocationPopup}
                className="rounded-full bg-[#eeeeee] px-5 py-2.5 text-sm font-black leading-tight text-black"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={saveLocationPopup}
                className="rounded-full bg-[#6fbd7d] px-5 py-2.5 text-sm font-black leading-tight text-black"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="space-y-7 px-5 pb-12 pt-7">
        <h2 className="text-xl font-bold leading-tight text-black sm:text-2xl">Danh mục mua sắm</h2>
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />
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

      <nav className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-14px_36px_rgba(0,0,0,0.18)]">
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
