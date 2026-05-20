"use client";

import { useRouter } from "next/navigation";
import { Heart, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AppImageButton } from "@/components/AppImageButton";
import { ProductGrid } from "@/components/home/ProductGrid";
import { useFavorites } from "@/components/providers/favorite-provider";
import { useCart } from "@/components/providers/cart-provider";
import { homeProducts, type HomeProduct } from "@/data/home-products";
import type { CartItem } from "@/types";

type QuantityMap = Record<string, number>;

const suggestionItems = homeProducts
  .filter((product) => product.section === "best-deal")
  .slice(0, 6);

const CHECKOUT_SELECTION_STORAGE_KEY = "nau-smart-grocery:checkout-selection";

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function CartBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-14px_36px_rgba(0,0,0,0.18)] lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 items-center justify-items-center">
        <AppImageButton buttonId="button-004" href="/" size={28} className="flex justify-center text-black" />
        <AppImageButton
          buttonId="button-005"
          href="/favorite"
          size={28}
          className="flex justify-center text-black"
        />
        <AppImageButton
          buttonId="button-003"
          href="/scan"
          size={82}
          className="-mt-12 flex h-[82px] w-[82px] items-center justify-center rounded-full text-black shadow-[0_14px_28px_rgba(0,0,0,0.24)]"
        />
        <AppImageButton
          buttonId="button-006"
          href="#notification"
          size={28}
          className="flex justify-center text-black"
        />
        <AppImageButton
          buttonId="button-021"
          href="/cart"
          size={48}
          className="flex h-12 w-12 items-center justify-center justify-self-center rounded-full text-black"
        />
      </div>
    </nav>
  );
}

interface CartItemRowProps {
  item: CartItem;
  selected: boolean;
  favorite: boolean;
  onSelect: (id: string) => void;
  onIncrease: (id: string, quantity: number) => void;
  onDecrease: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

function CartItemRow({
  item,
  selected,
  favorite,
  onSelect,
  onIncrease,
  onDecrease,
  onRemove,
  onToggleFavorite
}: CartItemRowProps) {
  const subtotal = item.estimatedPrice * item.quantity;
  const hasImage = Boolean(item.image && !item.image.includes("fallback-product"));

  return (
    <article
      className={`grid grid-cols-[92px_1fr_auto] gap-3 rounded-[24px] p-2 transition ${
        selected ? "bg-[#fff7c6] shadow-[0_0_0_2px_rgba(0,0,0,0.08)]" : "bg-white"
      }`}
      onClick={() => onSelect(item.id)}
    >
      <div className="relative">
        <AppImageButton
          buttonId="button-015"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(item.id);
          }}
          size={26}
          className="absolute -left-1 -top-1 z-10 flex h-7 w-7 items-center justify-center"
        />
        <div className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#EEEEEE] p-2">
          {hasImage ? (
            <img src={item.image} alt={item.productName} className="h-full w-full object-contain" />
          ) : (
            <span className="px-2 text-center text-[11px] font-black leading-tight text-black">
              {item.productName}
            </span>
          )}
        </div>
      </div>

      <div className="min-w-0 py-1">
        <h2 className="line-clamp-1 text-[13px] font-black text-black">{item.productName}</h2>
        <p className="mt-0.5 text-[10px] font-bold text-black/70">{item.unit}</p>
        <div className="mt-2 flex h-8 w-[74px] items-center justify-between rounded-full bg-[#6fbd7d] px-2 text-black">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDecrease(item.id, item.quantity);
            }}
            className="flex h-6 w-5 items-center justify-center rounded-full"
            aria-label={`Giảm số lượng ${item.productName}`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-sm font-black">{item.quantity}</span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onIncrease(item.id, item.quantity);
            }}
            className="flex h-6 w-5 items-center justify-center rounded-full"
            aria-label={`Tăng số lượng ${item.productName}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex min-w-[90px] flex-col items-end justify-between py-1">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#6fbd7d] text-white ring-2 ring-white transition-transform duration-200 ${
            favorite ? "scale-110" : "scale-100"
          }`}
          aria-label={favorite ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-200 ${
              favorite ? "animate-[favorite-pop_260ms_ease-out]" : ""
            }`}
            fill={favorite ? "#CD6CFD" : "none"}
            stroke={favorite ? "#CD6CFD" : "currentColor"}
          />
        </button>
        <p className="text-right text-lg font-black leading-none text-black sm:text-xl">{formatPrice(subtotal)}</p>
      </div>
    </article>
  );
}

function EmptyCartState() {
  return (
    <div className="rounded-[24px] bg-white px-6 py-12 text-center shadow-[0_18px_36px_rgba(46,46,18,0.08)]">
      <p className="text-xl font-black leading-tight sm:text-2xl">Giỏ hàng đang trống</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-black/60">
        Sản phẩm bạn bấm thêm ở Trang chủ, mục Tất cả hoặc các Category sẽ tự xuất hiện tại đây.
      </p>
    </div>
  );
}

export function CartPageView() {
  const router = useRouter();
  const { addItems, clearCart, items, removeItem, updateQuantity } = useCart();
  const { addProduct, favoriteIds } = useFavorites();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [suggestionQuantities, setSuggestionQuantities] = useState<QuantityMap>({});

  useEffect(() => {
    setSelectedIds((current) => {
      const itemIds = new Set(items.map((item) => item.id));
      const next = new Set(Array.from(current).filter((id) => itemIds.has(id)));

      items.forEach((item) => {
        if (!current.has(item.id)) {
          next.add(item.id);
        }
      });

      return next;
    });
  }, [items]);

  const selectedQuantity = useMemo(
    () =>
      items.reduce(
        (total, item) => total + (selectedIds.has(item.id) ? item.quantity : 0),
        0
      ),
    [items, selectedIds]
  );
  const totalCartQuantity = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );
  const checkoutQuantity = selectedQuantity > 0 ? selectedQuantity : totalCartQuantity;

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const increaseCartQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity + 1);
    setSelectedIds((current) => new Set(current).add(id));
  };

  const decreaseCartQuantity = (id: string, quantity: number) => {
    updateQuantity(id, Math.max(quantity - 1, 1));
  };

  const toggleFavorite = (id: string) => {
    const cartItem = items.find((item) => item.id === id);
    const homeProduct = homeProducts.find((product) => product.id === id);

    if (cartItem) {
      addProduct({
        id: cartItem.id,
        productId: cartItem.productId,
        name: cartItem.productName,
        detail: cartItem.unit,
        price: cartItem.estimatedPrice,
        image: cartItem.image,
        category: cartItem.category
      });
      return;
    }

    if (homeProduct) {
      addProduct({
        id: homeProduct.id,
        productId: homeProduct.id,
        name: homeProduct.name,
        detail: homeProduct.detail,
        price: homeProduct.price,
        oldPrice: homeProduct.oldPrice ?? null,
        image: homeProduct.image.src,
        category: homeProduct.category
      });
    }
  };

  const addSuggestionToCart = (product: HomeProduct) => {
    setSuggestionQuantities((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1
    }));
    addItems([
      {
        id: product.id,
        productId: product.id,
        productName: product.name,
        brand: "Nấu Smart Grocery",
        category: product.category,
        quantity: 1,
        unit: product.detail,
        estimatedPrice: product.price,
        sourceIngredient: product.name,
        image: product.image.src,
        source: "catalog"
      }
    ]);
  };

  const decreaseSuggestionQuantity = (productId: string) => {
    setSuggestionQuantities((current) => {
      const nextQuantity = Math.max((current[productId] ?? 0) - 1, 0);
      const next = { ...current };

      if (nextQuantity === 0) {
        delete next[productId];
      } else {
        next[productId] = nextQuantity;
      }

      return next;
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  const handleClearCart = () => {
    clearCart();
    setSelectedIds(new Set());
  };

  const handleCheckout = () => {
    const selectedItems = items.filter((item) => selectedIds.has(item.id));
    const checkoutItems = selectedItems.length > 0 ? selectedItems : items;

    if (checkoutItems.length === 0) {
      return;
    }

    window.sessionStorage.setItem(
      CHECKOUT_SELECTION_STORAGE_KEY,
      JSON.stringify(checkoutItems.map((item) => item.id))
    );
    router.push("/checkout");
  };

  return (
    <div className="min-h-[100dvh] bg-[#FFF1AF] text-black lg:rounded-[36px] lg:px-8 lg:py-10">
      <main className="mx-auto max-w-md pt-6 lg:max-w-5xl">
        <div className="flex justify-end px-6">
          <AppImageButton
            buttonId="button-009"
            onClick={handleBack}
            size={58}
            className="flex h-[58px] w-[58px] items-center justify-center rounded-full text-black shadow-sm"
          />
        </div>

        <section className="mx-6 mt-7 max-h-[58vh] overflow-y-auto rounded-[16px] bg-white px-3 py-5 shadow-[0_18px_36px_rgba(46,46,18,0.08)] lg:max-h-none">
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  selected={selectedIds.has(item.id)}
                  favorite={favoriteIds.has(item.id)}
                  onSelect={toggleSelected}
                  onIncrease={increaseCartQuantity}
                  onDecrease={decreaseCartQuantity}
                  onRemove={removeItem}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <EmptyCartState />
          )}
        </section>

        <div className="sticky bottom-[104px] z-30 mt-8 flex items-center justify-between gap-4 px-6 lg:static">
          <button
            type="button"
            onClick={handleClearCart}
            disabled={items.length === 0}
            className="rounded-[20px] border-[3px] border-black bg-transparent px-4 py-2.5 text-sm font-black leading-tight text-black disabled:opacity-40 sm:px-5 sm:py-3 sm:text-base"
          >
            Xoá giỏ
          </button>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="rounded-[24px] bg-[#cd6cfd] px-6 py-3.5 text-base font-black leading-tight text-white shadow-[0_0_0_3px_#000000,0_14px_26px_rgba(0,0,0,0.16)] sm:px-8 sm:py-4 sm:text-lg"
          >
            Mua Hàng ({checkoutQuantity})
          </button>
        </div>

        <section className="mt-10 min-h-[calc(100dvh-8rem)] rounded-t-[28px] bg-[#ffe467] px-6 pb-48 pt-6 shadow-[0_-12px_30px_rgba(0,0,0,0.08)]">
          <h1 className="mb-6 text-center text-xl font-black leading-tight sm:text-2xl">Có thể bạn cần</h1>
          <ProductGrid
            products={suggestionItems}
            favoriteIds={favoriteIds}
            quantities={suggestionQuantities}
            onToggleFavorite={toggleFavorite}
            onAddToCart={addSuggestionToCart}
            onDecreaseQuantity={decreaseSuggestionQuantity}
          />
        </section>
      </main>

      <CartBottomNav />
    </div>
  );
}
