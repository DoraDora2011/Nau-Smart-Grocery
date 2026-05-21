import Image from "next/image";
import Link from "next/link";
import { BookOpen, ShoppingBasket } from "lucide-react";

import { AppImageButton } from "@/components/AppImageButton";
import { CategoryTabs } from "@/components/home/CategoryTabs";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { LocationBadgeIcon } from "@/components/home/LocationBadgeIcon";
import { ProductSection } from "@/components/home/ProductSection";
import type {
  HomeCategory,
  HomeCategoryKey,
  HomeProduct,
  HomeProductSection
} from "@/data/home-products";
import { homeBrandAssets } from "@/data/home-products";

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
  onChooseDeliveryAddress: () => void;
  onReplayOnboarding: () => void;
}

const desktopNavItems = [
  { label: "Trang Chủ", href: "/" },
  { label: "Yêu Thích", href: "/favorite" },
  { label: "Thông Báo", href: "#notification" },
  { label: "Chính Sách", href: "#policy" }
];

const footerLinks = [
  "Trung tâm dịch vụ",
  "Quy định hoàn trả",
  "Về chúng tôi",
  "Chính sách giao hàng",
  "Chính sách bảo mật",
  "Điều khoản sử dụng"
];

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
  return (
    <div className="hidden min-h-screen bg-[#FFF1AF] text-black lg:block">
      <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-10">
          <Link href="/" className="flex items-center">
            <Image
              src={homeBrandAssets.logoText}
              alt="Nấu Smart Grocery"
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-14 text-base font-bold text-black">
            {desktopNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition hover:-translate-y-0.5 hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <AppImageButton
              buttonId="button-023"
              href="/profile"
              size={48}
              className="flex h-12 w-12 items-center justify-center rounded-full text-black transition hover:scale-105"
              data-tour-id="user-profile"
            />
            <button
              type="button"
              onClick={onReplayOnboarding}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#ffe467] px-4 text-sm font-black leading-tight text-black transition hover:scale-105"
              aria-label="Xem lại hướng dẫn"
            >
              <BookOpen className="h-5 w-5" strokeWidth={2.6} />
              Hướng dẫn
            </button>
            <Link
              href="/cart"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe467] text-black transition hover:scale-105"
              aria-label="Mở giỏ hàng"
            >
              <ShoppingBasket className="h-6 w-6" />
            </Link>
          </div>
        </nav>
      </header>

      <section className="rounded-b-[110px] bg-[linear-gradient(135deg,#d7fdd9_0%,#edc7ff_100%)] px-10 pb-12 pt-32 text-black">
        <div className="mx-auto grid max-w-7xl grid-cols-[0.92fr_1.08fr] items-center gap-16">
          <div className="space-y-6 text-black">
            <div className="max-w-xl rounded-[32px] border-2 border-black bg-white/78 p-7 text-base font-semibold leading-8 text-black">
              Bạn không biết nên nấu món gì hoặc cần mua thêm nguyên liệu nào? Nấu giúp bạn
              quét ảnh nguyên liệu, gợi ý món ăn phù hợp, lập công thức cho nhiều người và tự
              động thêm nguyên liệu còn thiếu vào giỏ hàng.
            </div>

            <div className="flex min-h-24 items-start gap-2 text-black">
              <div className="group">
                <Link
                  href="/scan"
                  data-tour-id="scan-mvp"
                  className="inline-flex min-w-52 justify-center rounded-full bg-[linear-gradient(135deg,#cd6cfd,#ffffff)] px-8 py-4 text-base font-bold text-black transition hover:scale-105 hover:shadow-xl"
                >
                  Quét nguyên liệu
                </Link>
                <p className="mt-3 max-w-xs text-sm font-semibold leading-6 text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  (Tải ảnh nguyên liệu lên và khám phá những món bạn có thể nấu)
                </p>
              </div>

              <div className="group">
                <Link
                  href="/dish"
                  data-tour-id="recipe-mvp"
                  className="inline-flex min-w-52 justify-center rounded-full bg-[linear-gradient(135deg,#d7fdd9,#ffe467)] px-8 py-4 text-base font-bold text-black transition hover:scale-105 hover:shadow-xl"
                >
                  Hỏi Nâu đầu bếp
                </Link>
                <p className="mt-3 max-w-xs text-sm font-semibold leading-6 text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  (Nhập món ăn và số người, Nấu sẽ gợi ý công thức, khẩu phần và tự động tạo
                  giỏ hàng.)
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[420px] items-center justify-center">
            <div className="absolute inset-8 rounded-[56px] bg-white/15 blur-2xl" />
            <Image
              src={homeBrandAssets.logoMascot}
              alt="Mascot Nâu"
              className="relative h-[360px] w-auto object-contain"
              priority
            />
            <div className="absolute right-8 top-16 rounded-[999px] bg-white px-9 py-6 text-xl font-bold leading-snug shadow-sm xl:text-2xl">
              Chào nha,
              <br />
              mình là Nâu
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
            className="justify-center gap-14 [&_button]:min-w-28 [&_button]:text-sm [&_button_span:last-child]:max-w-28"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex items-center gap-5">
          <HomeSearchBar
            value={searchQuery}
            onChange={onSearchChange}
            className="flex-1"
          />
          <button
            type="button"
            onClick={onChooseDeliveryAddress}
            className="flex items-center gap-2 border-0 bg-transparent p-0 text-left text-sm font-bold text-black transition hover:scale-[1.02]"
            aria-label="Nhập địa chỉ giao hàng"
            title="Nhập địa chỉ giao hàng"
          >
            <LocationBadgeIcon className="h-10 w-10" />
            <span className="max-w-[210px] truncate">{deliveryAddress}</span>
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-16 px-6 pb-28 pt-12">
        {activeCategory ? (
          <ProductSection
            title={activeCategoryLabel ?? "Sản phẩm"}
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
            title="Kết quả tìm kiếm"
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
              title="Popular Items"
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
              title="Best deal"
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

      <footer className="rounded-t-[34px] bg-white px-10 py-12 text-black">
        <div className="mx-auto grid max-w-7xl grid-cols-[1.1fr_1.4fr_1.8fr] gap-12">
          <div className="space-y-5">
            <Image
              src={homeBrandAssets.logoText}
              alt="Nấu Smart Grocery"
              className="h-20 w-auto object-contain"
            />
            <p className="text-sm font-semibold">Liên hệ: (028) 3776 1300</p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm font-semibold">
            {footerLinks.map((link) => (
              <a key={link} href="#footer" className="hover:underline">
                {link}
              </a>
            ))}
          </div>

          <div className="space-y-2 text-right text-sm font-semibold leading-6">
            <p>Tên công ty: CÔNG TY TNHH Mô Tảo Thương Công</p>
            <p>Người đại diện: Mô Đào</p>
            <p>Mã số doanh nghiệp: 0123568888</p>
            <p>Địa chỉ: 702 Đường Nguyễn Văn Linh, TP. Hồ Chí Minh</p>
            <p>Bản quyền Mô Tảo Thương Công © 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
