import type { HomeProduct } from "@/data/home-products";

import { ProductGrid } from "@/components/home/ProductGrid";

interface ProductSectionProps {
  title: string;
  products: HomeProduct[];
  favoriteIds: Set<string>;
  quantities: Record<string, number>;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: HomeProduct) => void;
  onDecreaseQuantity: (productId: string) => void;
  desktop?: boolean;
  isExpanded?: boolean;
  onToggleViewAll?: () => void;
}

export function ProductSection({
  title,
  products,
  favoriteIds,
  quantities,
  onToggleFavorite,
  onAddToCart,
  onDecreaseQuantity,
  desktop,
  isExpanded,
  onToggleViewAll
}: ProductSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold leading-tight text-black sm:text-2xl">{title}</h2>
        {onToggleViewAll ? (
          <button
            type="button"
            onClick={onToggleViewAll}
            className="text-sm font-bold text-black transition hover:opacity-70"
          >
            {isExpanded ? "Thu gọn" : "Xem tất cả"}
          </button>
        ) : null}
      </div>
      {products.length > 0 ? (
        <ProductGrid
          products={products}
          favoriteIds={favoriteIds}
          quantities={quantities}
          onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
          onDecreaseQuantity={onDecreaseQuantity}
          desktop={desktop}
        />
      ) : (
        <div className="rounded-[28px] bg-white/70 px-5 py-8 text-center text-sm font-semibold text-black/70 shadow-sm">
          Không tìm thấy sản phẩm phù hợp.
        </div>
      )}
    </section>
  );
}
