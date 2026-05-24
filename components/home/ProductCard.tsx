import Image from "next/image";
import { Heart, Minus, Plus } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import type { HomeProduct } from "@/data/home-products";
import { getLocalizedProductText } from "@/lib/i18n/products";
import { playUiSound } from "@/lib/utils/ui-sounds";

interface ProductCardProps {
  product: HomeProduct;
  isFavorite: boolean;
  quantity: number;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: HomeProduct) => void;
  onDecreaseQuantity: (productId: string) => void;
  desktop?: boolean;
}

function formatPrice(value: number, locale: string, suffix: string) {
  return new Intl.NumberFormat(locale).format(value) + suffix;
}

export function ProductCard({
  product,
  isFavorite,
  quantity,
  onToggleFavorite,
  onAddToCart,
  onDecreaseQuantity,
  desktop = false
}: ProductCardProps) {
  const { locale, dictionary } = useLanguage();
  const productText = getLocalizedProductText(product, locale);

  return (
    <article className="relative overflow-hidden rounded-[30px] bg-white p-2.5 pb-4 shadow-[0_16px_36px_rgba(46,46,18,0.08)]">
      <button
        type="button"
        onClick={() => {
          playUiSound("tap");
          onToggleFavorite(product.id);
        }}
        className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#6fbd7d] text-white ring-2 ring-white transition-transform duration-200 ${
          isFavorite ? "scale-110" : "scale-100"
        }`}
        aria-label={isFavorite ? dictionary.common.removeFavorite : dictionary.common.addFavorite}
      >
        <Heart
          className={`h-5 w-5 transition-all duration-200 ${
            isFavorite ? "animate-[favorite-pop_260ms_ease-out]" : ""
          }`}
          fill={isFavorite ? "#CD6CFD" : "none"}
          stroke={isFavorite ? "#CD6CFD" : "currentColor"}
        />
      </button>

      <div className="flex aspect-[1.15/1] items-center justify-center rounded-[26px] bg-[#EEEEEE] p-4">
        <Image
          src={product.image}
          alt={productText.name}
          className="h-full w-full object-contain"
          placeholder="blur"
        />
      </div>

      <div className="space-y-2 px-1.5 pt-4">
        <div>
          <h3 className="line-clamp-2 min-h-9 text-[13px] font-bold leading-snug text-black">
            {productText.name}
          </h3>
          <p className="mt-0.5 text-[11px] font-semibold text-black/70">{productText.detail}</p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="min-w-0">
            <p className={`${!desktop && quantity > 0 ? "text-base sm:text-lg" : "text-xl sm:text-2xl"} font-black leading-none text-black transition-[font-size]`}>
              {formatPrice(product.price, dictionary.common.currencyLocale, dictionary.common.currencySuffix)}
            </p>
            {product.oldPrice ? (
              <p className="mt-1 text-[11px] font-semibold text-black/45 line-through">
                {formatPrice(product.oldPrice, dictionary.common.currencyLocale, dictionary.common.currencySuffix)}
              </p>
            ) : null}
          </div>
          {quantity > 0 ? (
            <div className="flex h-10 w-[72px] shrink-0 items-center justify-between rounded-full bg-[#6fbd7d] px-1.5 text-black">
              <button
                type="button"
                onClick={() => {
                  playUiSound("tap");
                  onDecreaseQuantity(product.id);
                }}
                className="flex h-7 w-5 items-center justify-center rounded-full transition hover:bg-black/10"
                aria-label={`${dictionary.common.remove} ${productText.name}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-4 text-center text-sm font-black">{quantity}</span>
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="flex h-7 w-5 items-center justify-center rounded-full transition hover:bg-black/10"
                aria-label={`${dictionary.common.addToCart}: ${productText.name}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6fbd7d] text-black transition hover:scale-105"
              aria-label={`${dictionary.common.addToCart}: ${productText.name}`}
            >
              <Plus className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
