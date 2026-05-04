"use client";

import { useRef, useState, type PointerEvent } from "react";
import { Heart, ShoppingBasket, Trash2 } from "lucide-react";

type RecipeIngredient = {
  name: string;
  amount: string;
  alternatives?: string[];
};

type RecipeResult = {
  isSafe?: boolean;
  dish: string;
  servings: number;
  allergyWarnings?: string[];
  conflictingIngredients?: string[];
  saferAlternatives?: string[];
  ingredients?: RecipeIngredient[];
  steps?: string[];
};

interface RecipeResultMobileProps {
  recipe: RecipeResult;
  reviewIngredients: RecipeIngredient[];
  isUnsafe: boolean;
  cartLoading: boolean;
  cartMessage: string | null;
  isConflictingIngredient: (ingredientName: string) => boolean;
  onRemoveIngredient: (ingredientName: string) => void;
  onAddReviewedIngredientsToCart: () => void;
  isRecipeFavorite: boolean;
  onToggleRecipeFavorite: () => void;
  onCollapse: () => void;
}

export function RecipeResultMobile({
  recipe,
  reviewIngredients,
  isUnsafe,
  cartLoading,
  cartMessage,
  isConflictingIngredient,
  onRemoveIngredient,
  onAddReviewedIngredientsToCart,
  isRecipeFavorite,
  onToggleRecipeFavorite,
  onCollapse
}: RecipeResultMobileProps) {
  const dragStartY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const youtubeSearchKeyword = recipe.dish || "công thức nấu ăn";
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `cách nấu ${youtubeSearchKeyword}`
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
      onCollapse();
    }

    dragStartY.current = null;
    setDragY(0);
  };

  return (
    <section className="min-h-[100dvh] bg-[#ebf1a0] px-0 pb-0 pt-8 text-black lg:hidden">
      <div
        className="min-h-[calc(100dvh-2rem)] rounded-t-[32px] bg-[#ffe467] px-6 pb-36 pt-3 shadow-[0_-16px_40px_rgba(0,0,0,0.18)]"
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
          aria-label="Kéo xuống để quay lại khung chat"
        >
          <span className="mx-auto mt-2 block h-1.5 w-16 rounded-full bg-white" />
        </button>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[26px] font-black leading-tight">
              Công thức nấu {recipe.dish || "(tên món ăn)"}
            </h1>
            <p className="mt-2 text-base font-bold">Dành cho {recipe.servings} người</p>
          </div>
          <button
            type="button"
            onClick={onToggleRecipeFavorite}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition active:scale-95"
            aria-label={isRecipeFavorite ? "Bỏ lưu công thức yêu thích" : "Lưu công thức yêu thích"}
          >
            <Heart
              className={`h-6 w-6 transition-all duration-200 ${
                isRecipeFavorite ? "animate-[favorite-pop_260ms_ease-out]" : ""
              }`}
              fill={isRecipeFavorite ? "#CD6CFD" : "none"}
              stroke={isRecipeFavorite ? "#CD6CFD" : "currentColor"}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {isUnsafe ? (
          <div className="mt-5 rounded-2xl bg-white/80 p-4 text-sm font-semibold text-[#7d3f23]">
            {(recipe.allergyWarnings ?? []).map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        ) : null}

        <div className="mt-7">
          <h2 className="text-xl font-black">Các loại nguyên liệu chính:</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {reviewIngredients.map((ingredient, index) => {
              const isConflict = isConflictingIngredient(ingredient.name);

              return (
                <article
                  key={`${ingredient.name}-${index}`}
                  className="min-h-[250px] rounded-[28px] bg-white p-3.5"
                >
                  <div className="flex aspect-square min-h-[130px] items-center justify-center rounded-[24px] bg-[#edc7ff] p-3 text-center text-xs font-black leading-tight">
                    {ingredient.name}
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm font-black leading-tight">{ingredient.name}</p>
                  <p className="mt-2 text-sm font-semibold text-black/70">{ingredient.amount}</p>
                  <div className="mt-4 flex items-center justify-between">
                    {isConflict ? (
                      <button
                        type="button"
                        onClick={() => onRemoveIngredient(ingredient.name)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff3ea] text-[#8c4d2b]"
                        aria-label={`Xóa ${ingredient.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6fbd7d] text-black"
                      aria-label="Thêm nguyên liệu"
                    >
                      <ShoppingBasket className="h-5 w-5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onAddReviewedIngredientsToCart}
          disabled={cartLoading || reviewIngredients.length === 0}
          className="mt-7 w-full rounded-full bg-[#6fbd7d] px-5 py-4 text-base font-black text-black disabled:opacity-60"
        >
          {cartLoading ? "Đang thêm vào giỏ..." : "Thêm danh sách vào giỏ hàng"}
        </button>

        {cartMessage ? (
          <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold">{cartMessage}</p>
        ) : null}

        <div className="mt-7">
          <h2 className="text-xl font-black">Cách làm</h2>
          <div className="mt-3 space-y-3">
            {recipe.steps?.map((step, index) => (
              <p key={`${step}-${index}`} className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold">
                {index + 1}. {step}
              </p>
            ))}
          </div>
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
        </div>
      </div>
    </section>
  );
}
