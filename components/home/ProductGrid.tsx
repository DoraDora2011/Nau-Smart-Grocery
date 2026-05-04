import type { HomeProduct } from "@/data/home-products";

import { ProductCard } from "@/components/home/ProductCard";

interface ProductGridProps {
  products: HomeProduct[];
  favoriteIds: Set<string>;
  quantities: Record<string, number>;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: HomeProduct) => void;
  onDecreaseQuantity: (productId: string) => void;
  desktop?: boolean;
}

export function ProductGrid({
  products,
  favoriteIds,
  quantities,
  onToggleFavorite,
  onAddToCart,
  onDecreaseQuantity,
  desktop = false
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-[28px] bg-white/70 px-5 py-8 text-center text-sm font-semibold text-black/65">
        Chưa có sản phẩm phù hợp với bộ lọc hiện tại.
      </div>
    );
  }

  return (
    <div
      className={
        desktop
          ? "grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4"
          : "grid grid-cols-2 gap-5"
      }
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favoriteIds.has(product.id)}
          quantity={quantities[product.id] ?? 0}
          onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
          onDecreaseQuantity={onDecreaseQuantity}
          desktop={desktop}
        />
      ))}
    </div>
  );
}
