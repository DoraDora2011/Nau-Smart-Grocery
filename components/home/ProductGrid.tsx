import type { HomeProduct } from "@/data/home-products";

import { ProductCard } from "@/components/home/ProductCard";
import { useLanguage } from "@/components/providers/language-provider";

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
  const { dictionary } = useLanguage();

  if (products.length === 0) {
    return (
      <div className="rounded-[28px] bg-white/70 px-5 py-8 text-center text-sm font-semibold text-black/65">
        {dictionary.common.noProducts}
      </div>
    );
  }

  return (
    <div
      className={
        desktop
          ? "grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4"
          : "grid grid-cols-2 gap-x-5 gap-y-7"
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
