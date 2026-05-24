"use client";

import { useRef, useState, type PointerEvent } from "react";
import { ChevronDown, Heart, Minus, ShoppingBasket } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import { interpolate } from "@/lib/i18n/translations";
import { uiLabels } from "@/lib/i18n/ui-labels";

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
  const { locale } = useLanguage();
  const labels = uiLabels[locale].recipeMobile;
  const dragStartY = useRef<number | null>(null);
  const didDragHandle = useRef(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(false);
  const youtubeSearchKeyword = recipe.dish || labels.fallbackSearch;
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${labels.youtubeQueryPrefix} ${youtubeSearchKeyword}`
  )}`;

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    dragStartY.current = event.clientY;
    didDragHandle.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragStartY.current === null) {
      return;
    }

    const nextDragY = Math.max(0, event.clientY - dragStartY.current);

    if (nextDragY > 8) {
      didDragHandle.current = true;
    }

    setDragY(nextDragY);
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
    <section className="min-h-[100dvh] bg-[#FFF1AF] px-0 pb-0 pt-8 text-black lg:hidden">
      <div
        className="min-h-[calc(100dvh-2rem)] rounded-t-[32px] bg-[#ffe467] px-6 pb-36 pt-3 shadow-[0_-16px_40px_rgba(0,0,0,0.18)]"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 180ms ease-out"
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (didDragHandle.current) {
              didDragHandle.current = false;
              return;
            }

            onCollapse();
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="-mx-2 flex h-12 w-[calc(100%+1rem)] touch-none items-start justify-center rounded-t-[28px] pt-2"
          aria-label={labels.dragChat}
        >
          <span className="block h-1.5 w-16 rounded-full bg-white" />
        </button>

        <div className="mt-0 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-black leading-tight sm:text-[26px]">
              {interpolate(labels.recipeTitle, { dish: recipe.dish || labels.unnamedDish })}
            </h1>
            <p className="mt-2 text-sm font-bold leading-snug sm:text-base">
              {interpolate(labels.servingsFor, { servings: recipe.servings })}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleRecipeFavorite}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition active:scale-95"
            aria-label={isRecipeFavorite ? labels.unsaveRecipe : labels.saveRecipe}
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
          <h2 className="text-lg font-black leading-tight sm:text-xl">{labels.ingredientsTitle}</h2>
          <div className="mt-5 space-y-5">
            {reviewIngredients.map((ingredient, index) => {
              const isConflict = isConflictingIngredient(ingredient.name);

              return (
                <article
                  key={`${ingredient.name}-${index}`}
                  className={`rounded-[24px] bg-white p-3.5 ${
                    isConflict ? "border-2 border-[#8c4d2b]/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[20px] bg-[#EEEEEE] p-2 text-center text-[10px] font-black leading-tight text-black sm:h-20 sm:w-20">
                      <span className="line-clamp-3">{ingredient.name}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-black leading-tight sm:text-base">{ingredient.name}</p>
                      <p className="mt-1.5 text-sm font-semibold leading-tight text-black/70">{ingredient.amount}</p>
                      {isConflict ? (
                        <p className="mt-2 text-xs font-bold leading-snug text-[#8c4d2b]">
                          {labels.conflictHelp}
                        </p>
                      ) : null}
                      {ingredient.alternatives && ingredient.alternatives.length > 0 ? (
                        <p className="mt-2 line-clamp-2 text-xs font-semibold leading-snug text-black/55">
                          {labels.alternatives}: {ingredient.alternatives.join(", ")}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onRemoveIngredient(ingredient.name)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9D9D9] text-black transition active:scale-95"
                        aria-label={interpolate(labels.removeIngredient, { name: ingredient.name })}
                      >
                        <Minus className="h-5 w-5" strokeWidth={3} />
                      </button>
                      <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6fbd7d] text-black"
                        aria-label={labels.addIngredient}
                      >
                        <ShoppingBasket className="h-5 w-5" />
                      </button>
                    </div>
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
          className="mt-7 w-full rounded-full bg-[#6fbd7d] px-5 py-3 text-sm font-black leading-tight text-black disabled:opacity-60 sm:py-4 sm:text-base"
        >
          {cartLoading ? labels.addingList : labels.addList}
        </button>

        {cartMessage ? (
          <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold">{cartMessage}</p>
        ) : null}

        <div className="mt-7">
          <button
            type="button"
            onClick={() => setStepsOpen((current) => !current)}
            className="flex w-full items-center justify-between text-left"
            aria-expanded={stepsOpen}
          >
            <h2 className="text-lg font-black leading-tight sm:text-xl">{labels.stepsTitle}</h2>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-black">
              <ChevronDown className={`h-5 w-5 transition-transform ${stepsOpen ? "rotate-180" : ""}`} />
            </span>
          </button>
          {stepsOpen ? (
            <div className="mt-4 space-y-5">
              {recipe.steps?.map((step, index) => (
                <p key={`${step}-${index}`} className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold">
                  {index + 1}. {step}
                </p>
              ))}
            </div>
          ) : null}
          <p className="mt-5 rounded-2xl bg-white/85 px-4 py-3 text-sm font-bold leading-6">
            {labels.youtubeIntro}{" "}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-2 underline-offset-4"
            >
              {labels.youtubeLink}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
