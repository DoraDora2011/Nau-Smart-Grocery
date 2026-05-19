"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";

import { AppImageButton } from "@/components/AppImageButton";
import { useCart } from "@/components/providers/cart-provider";
import {
  type FavoriteProduct,
  type FavoriteRecipe,
  useFavorites
} from "@/components/providers/favorite-provider";
import type { CartItem } from "@/types";

type FavoriteTab = "products" | "recipes";
type QuantityMap = Record<string, number>;

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function EmptyFavoriteState({ type }: { type: FavoriteTab }) {
  return (
    <div className="rounded-[28px] bg-white/80 px-6 py-10 text-center shadow-[0_16px_34px_rgba(46,46,18,0.08)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe467] text-black">
        <Heart className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-lg font-black leading-tight sm:text-xl">
        Chưa có {type === "products" ? "sản phẩm" : "công thức"} yêu thích
      </h2>
      <p className="mt-3 text-sm font-semibold leading-6 text-black/65">
        Khi bạn bấm biểu tượng trái tim, mục đã lưu sẽ xuất hiện ở đây để xem lại nhanh.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full border-2 border-black bg-white px-6 py-3 text-sm font-bold"
      >
        Quay về mua sắm
      </Link>
    </div>
  );
}

interface FavoriteProductCardProps {
  product: FavoriteProduct;
  quantity: number;
  onRemove: (id: string) => void;
  onAddToCart: (product: FavoriteProduct) => void;
  onDecreaseQuantity: (id: string) => void;
}

function FavoriteProductCard({
  product,
  quantity,
  onRemove,
  onAddToCart,
  onDecreaseQuantity
}: FavoriteProductCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[30px] bg-white p-2.5 pb-4 shadow-[0_16px_36px_rgba(46,46,18,0.08)]">
      <button
        type="button"
        onClick={() => onRemove(product.id)}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#6fbd7d] text-white ring-2 ring-white"
        aria-label={`Xoá ${product.name} khỏi yêu thích`}
      >
        <Trash2 className="h-4.5 w-4.5" />
      </button>

      <div className="flex aspect-[1.15/1] items-center justify-center rounded-[26px] bg-[#EEEEEE] p-4">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
        ) : (
          <span className="px-2 text-center text-xs font-black leading-tight">{product.name}</span>
        )}
      </div>

      <div className="space-y-2 px-1.5 pt-4">
        <div>
          <h3 className="line-clamp-2 min-h-9 text-[13px] font-bold leading-snug text-black">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[11px] font-semibold text-black/70">{product.detail}</p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="min-w-0">
            <p className="text-xl font-black leading-none text-black sm:text-2xl">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice ? (
              <p className="mt-1 text-[11px] font-semibold text-black/45 line-through">
                {formatPrice(product.oldPrice)}
              </p>
            ) : null}
          </div>
          {quantity > 0 ? (
            <div className="flex h-10 w-[72px] shrink-0 items-center justify-between rounded-full bg-[#6fbd7d] px-1.5 text-black">
              <button
                type="button"
                onClick={() => onDecreaseQuantity(product.id)}
                className="flex h-7 w-5 items-center justify-center rounded-full"
                aria-label={`Giảm số lượng ${product.name}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-4 text-center text-sm font-black">{quantity}</span>
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="flex h-7 w-5 items-center justify-center rounded-full"
                aria-label={`Tăng số lượng ${product.name}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6fbd7d] text-black"
              aria-label={`Thêm ${product.name} vào giỏ`}
            >
              <Plus className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function RecipeFavoriteCard({
  recipe,
  onOpen,
  onRemove
}: {
  recipe: FavoriteRecipe;
  onOpen: (recipe: FavoriteRecipe) => void;
  onRemove: (id: string) => void;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(recipe);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(recipe)}
      onKeyDown={handleKeyDown}
      className="relative cursor-pointer rounded-[24px] bg-white px-5 py-4 text-black shadow-[0_16px_34px_rgba(46,46,18,0.08)] transition active:scale-[0.99]"
      aria-label={`Mở lại công thức ${recipe.name}`}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onRemove(recipe.id);
        }}
        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#6fbd7d] text-white ring-2 ring-white"
        aria-label={`Xoá công thức ${recipe.name} khỏi yêu thích`}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <h2 className="pr-8 text-xl font-black leading-tight sm:text-2xl">{recipe.name}</h2>
      <div className="mt-3 space-y-1 text-[11px] font-semibold leading-5 text-black/55">
        <p>Mô tả món ăn:</p>
        <p className="line-clamp-2">{recipe.description}</p>
        <p className="line-clamp-1">Nguyên liệu chính: {recipe.ingredients}</p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {[
          ["Calories", recipe.calories],
          ["Carbs", recipe.carbs],
          ["Protein", recipe.protein],
          ["Fat", recipe.fat]
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border-2 border-black px-2 py-2 text-center text-[10px] font-bold leading-tight"
          >
            <p className="text-sm font-black">{value}</p>
            <p>{label}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function FavoriteRecipeOverlay({
  recipe,
  onClose
}: {
  recipe: FavoriteRecipe;
  onClose: () => void;
}) {
  const dragStartY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const ingredients = recipe.ingredients
    .split(",")
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `cách nấu ${recipe.name}`
  )}`;

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    dragStartY.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragStartY.current === null) {
      return;
    }

    setDragY(Math.max(0, event.clientY - dragStartY.current));
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);

    if (dragY > 90) {
      onClose();
    }

    dragStartY.current = null;
    setDragY(0);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#FFF1AF] text-black lg:flex lg:items-start lg:justify-center">
      <section
        className="min-h-[100dvh] bg-[#ffe467] px-6 pb-32 pt-3 shadow-[0_-16px_40px_rgba(0,0,0,0.18)] lg:mt-8 lg:min-h-0 lg:w-full lg:max-w-xl lg:rounded-[36px]"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 180ms ease-out"
        }}
      >
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="mx-auto block h-7 w-28 touch-none rounded-full"
          aria-label="Kéo xuống để đóng công thức"
        >
          <span className="mx-auto mt-2 block h-1.5 w-16 rounded-full bg-white" />
        </button>

        <div className="mt-5">
          <h1 className="text-2xl font-black leading-tight sm:text-[26px]">Công thức nấu {recipe.name}</h1>
          {recipe.servings ? (
            <p className="mt-2 text-base font-bold">Dành cho {recipe.servings} người</p>
          ) : null}
          <p className="mt-4 rounded-2xl bg-white/80 px-4 py-3 text-sm font-bold leading-6">
            {recipe.description}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          {[
            ["Calories", recipe.calories],
            ["Carbs", recipe.carbs],
            ["Protein", recipe.protein],
            ["Fat", recipe.fat]
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border-2 border-black bg-white/70 px-2 py-2 text-center text-[10px] font-bold leading-tight"
            >
              <p className="text-sm font-black">{value}</p>
              <p>{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <h2 className="text-lg font-black leading-tight sm:text-xl">Các loại nguyên liệu chính:</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {(ingredients.length > 0 ? ingredients : ["Chưa có danh sách nguyên liệu"]).map(
              (ingredient, index) => (
                <article
                  key={`${ingredient}-${index}`}
                  className="min-h-[190px] rounded-[28px] bg-white p-3.5"
                >
                  <div className="flex aspect-square min-h-[105px] items-center justify-center rounded-[24px] bg-[#EEEEEE] p-3 text-center text-xs font-black leading-tight">
                    {ingredient}
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm font-black leading-tight">{ingredient}</p>
                </article>
              )
            )}
          </div>
        </div>

        {recipe.steps && recipe.steps.length > 0 ? (
          <div className="mt-7">
            <h2 className="text-lg font-black leading-tight sm:text-xl">Cách làm</h2>
            <div className="mt-3 space-y-3">
              {recipe.steps.map((step, index) => (
                <p
                  key={`${step}-${index}`}
                  className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold"
                >
                  {index + 1}. {step}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        <p className="mt-5 rounded-2xl bg-white/85 px-4 py-3 text-sm font-bold leading-6">
          Tham khảo thêm các công thức đa dạng hơn nếu bạn muốn:{" "}
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-2 underline-offset-4"
          >
            xem video hướng dẫn trên YouTube
          </a>
        </p>
      </section>
    </div>
  );
}

function FavoriteBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white px-6 py-4 shadow-[0_-14px_36px_rgba(0,0,0,0.18)] lg:hidden">
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

export function FavoritePage() {
  const searchParams = useSearchParams();
  const { addItems, removeItem, updateQuantity } = useCart();
  const { products, recipes, removeProduct, removeRecipe } = useFavorites();
  const [activeTab, setActiveTab] = useState<FavoriteTab>("products");
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<FavoriteRecipe | null>(null);
  const backHref = searchParams.get("from") === "profile" ? "/profile" : "/";

  const addFavoriteProductToCart = (product: FavoriteProduct) => {
    setQuantities((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1
    }));

    const cartItem: CartItem = {
      id: product.id,
      productId: product.productId,
      productName: product.name,
      brand: "Nấu Smart Grocery",
      category: product.category ?? "Sản phẩm",
      quantity: 1,
      unit: product.detail,
      estimatedPrice: product.price,
      sourceIngredient: product.name,
      image: product.image ?? "/catalog/fallback-product.png",
      source: "catalog"
    };

    addItems([cartItem]);
    setCartMessage("Đã thêm vào giỏ hàng ✓");
  };

  const decreaseQuantity = (productId: string) => {
    setQuantities((current) => {
      const nextQuantity = Math.max((current[productId] ?? 0) - 1, 0);
      const next = { ...current };

      if (nextQuantity === 0) {
        delete next[productId];
        removeItem(productId);
      } else {
        next[productId] = nextQuantity;
        updateQuantity(productId, nextQuantity);
      }

      return next;
    });
  };

  return (
    <div className="min-h-[100dvh] bg-[#FFF1AF] text-black lg:rounded-[36px] lg:px-8 lg:py-10">
      {cartMessage ? (
        <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full bg-white px-5 py-3 text-center text-sm font-semibold shadow-lg">
          {cartMessage}
        </div>
      ) : null}

      <main className="mx-auto max-w-md px-6 pb-32 pt-6 lg:max-w-4xl">
        <div className="flex justify-end">
          <AppImageButton
            buttonId="button-009"
            href={backHref}
            size={56}
            className="flex h-14 w-14 items-center justify-center rounded-full text-black shadow-sm"
          />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            style={{
              borderColor: activeTab === "products" ? "#000000" : "#cfd9a0",
              boxShadow: activeTab === "products" ? "0 2px 0 rgba(0,0,0,0.18)" : "none"
            }}
            className={`h-11 rounded-full border-[3px] px-4 text-sm font-bold transition ${
              activeTab === "products"
                ? "bg-[#ffe467]"
                : "bg-transparent"
            }`}
          >
            Sản phẩm
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recipes")}
            style={{
              borderColor: activeTab === "recipes" ? "#000000" : "#cfd9a0",
              boxShadow: activeTab === "recipes" ? "0 2px 0 rgba(0,0,0,0.18)" : "none"
            }}
            className={`h-11 rounded-full border-[3px] px-4 text-sm font-bold transition ${
              activeTab === "recipes"
                ? "bg-[#ffe467]"
                : "bg-transparent"
            }`}
          >
            Công thức nấu ăn
          </button>
        </div>

        <section className="mt-10">
          {activeTab === "products" ? (
            products.length > 0 ? (
              <div className="grid grid-cols-2 gap-5">
                {products.map((product) => (
                  <FavoriteProductCard
                    key={product.id}
                    product={product}
                    quantity={quantities[product.id] ?? 0}
                    onRemove={removeProduct}
                    onAddToCart={addFavoriteProductToCart}
                    onDecreaseQuantity={decreaseQuantity}
                  />
                ))}
              </div>
            ) : (
              <EmptyFavoriteState type="products" />
            )
          ) : recipes.length > 0 ? (
            <div className="space-y-7">
              {recipes.map((recipe) => (
                <RecipeFavoriteCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={setSelectedRecipe}
                  onRemove={removeRecipe}
                />
              ))}
            </div>
          ) : (
            <EmptyFavoriteState type="recipes" />
          )}
        </section>
      </main>

      {selectedRecipe ? (
        <FavoriteRecipeOverlay recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      ) : null}

      <FavoriteBottomNav />
    </div>
  );
}
