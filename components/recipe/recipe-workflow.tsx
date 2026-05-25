"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUp,
  Heart,
  LoaderCircle,
  Minus,
  ShieldCheck,
  ShoppingBasket,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { RecipeMobileLayout } from "@/components/recipe/mobile/RecipeMobileLayout";
import logoMascot from "@/assets/brand_logo/logo-mascot-bigsize.png";
import { useCart } from "@/components/providers/cart-provider";
import { useFavorites } from "@/components/providers/favorite-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { interpolate } from "@/lib/i18n/translations";
import { estimateRecipeNutrition } from "@/lib/services/recipeNutrition";
import type { CartItem } from "@/types";

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

type RecipeChatMessage = {
  id: string;
  type: "user" | "recipe";
  text: string;
};

type RecipeHistoryItem = {
  id: string;
  text: string;
  createdAt: string;
  servings?: number;
  allergiesText?: string;
  hasAllergy?: boolean;
  recipe?: RecipeResult;
  reviewIngredients?: RecipeIngredient[];
};

type CartAddResponse =
  | {
      success: true;
      data: {
        items: CartItem[];
        unmatchedIngredients: string[];
      };
    }
  | {
      success: false;
      error: {
        message: string;
      };
    };

const RECIPE_HISTORY_STORAGE_KEY = "nau-smart-grocery:recipe-history:guest";

function parseList(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAmount(amount: string, locale: "vi" | "en") {
  const normalized = amount.replace(/,/g, ".");
  const numbers = normalized.match(/\d+(?:\.\d+)?/g)?.map(Number).filter(Number.isFinite) ?? [];
  const quantity = numbers.length > 0 ? Math.max(...numbers) : 1;
  const unitMatch = normalized.match(/[\p{L}]+/u);

  return {
    quantity,
    unit: unitMatch?.[0] ?? (locale === "vi" ? "phần" : "portion")
  };
}

function hasNameOverlap(left: string, right: string) {
  const a = normalizeName(left);
  const b = normalizeName(right);

  return Boolean(a && b && (a.includes(b) || b.includes(a)));
}

export function RecipeWorkflow() {
  const router = useRouter();
  const { locale, dictionary } = useLanguage();
  const { addItems } = useCart();
  const { favoriteRecipeIds, toggleRecipe } = useFavorites();
  const [dishName, setDishName] = useState("");
  const [servings, setServings] = useState(1);
  const [allergiesText, setAllergiesText] = useState("");
  const [recipe, setRecipe] = useState<RecipeResult | null>(null);
  const [reviewIngredients, setReviewIngredients] = useState<RecipeIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [hasAllergy, setHasAllergy] = useState(false);
  const [hasSubmittedMobileChat, setHasSubmittedMobileChat] = useState(false);
  const [mobileChatMessages, setMobileChatMessages] = useState<RecipeChatMessage[]>([]);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [recipeSearchHistory, setRecipeSearchHistory] = useState<RecipeHistoryItem[]>([]);
  const [desktopHistoryOpen, setDesktopHistoryOpen] = useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(false);
  const pendingHistoryIdRef = useRef<string | null>(null);

  const allergies = useMemo(() => parseList(allergiesText), [allergiesText]);
  const isUnsafe = recipe?.isSafe === false;
  const conflictNames = recipe?.conflictingIngredients ?? [];
  const favoriteRecipeId = recipe
    ? `recipe-${normalizeName(recipe.dish || dishName)}-${recipe.servings}-${normalizeName(
        allergiesText || "khong-di-ung"
      )}`
    : "";
  const isRecipeFavorite = favoriteRecipeId ? favoriteRecipeIds.has(favoriteRecipeId) : false;
  const recipeYoutubeUrl = recipe
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${locale === "vi" ? "cách nấu" : "how to cook"} ${recipe.dish || dishName.trim()}`
      )}`
    : "";

  useEffect(() => {
    try {
      const rawHistory = window.localStorage.getItem(RECIPE_HISTORY_STORAGE_KEY);
      const parsedHistory = rawHistory ? (JSON.parse(rawHistory) as RecipeHistoryItem[]) : [];

      setRecipeSearchHistory(
        parsedHistory.filter(
          (item) => item && typeof item.id === "string" && typeof item.text === "string"
        )
      );
    } catch (error) {
      console.warn("Could not read recipe search history.", error);
    }
  }, []);

  const persistRecipeSearchHistory = (items: RecipeHistoryItem[]) => {
    try {
      window.localStorage.setItem(RECIPE_HISTORY_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn("Could not save recipe search history.", error);
    }
  };

  const saveRecipeSearchHistory = (items: RecipeHistoryItem[]) => {
    setRecipeSearchHistory(items);
    persistRecipeSearchHistory(items);
  };

  const isConflictingIngredient = (ingredientName: string) =>
    conflictNames.some((conflict) => hasNameOverlap(ingredientName, conflict));

  const removeIngredient = (ingredientName: string) => {
    setReviewIngredients((current) =>
      current.filter((ingredient) => !hasNameOverlap(ingredient.name, ingredientName))
    );
    setCartMessage(dictionary.recipe.removedIngredient);
  };

  const fetchRecipe = async () => {
    if (!dishName.trim()) {
      setErrorMessage(dictionary.recipe.enterDishError);
      return;
    }

    if (servings <= 0) {
      setErrorMessage(dictionary.recipe.servingsError);
      return;
    }

    setLoading(true);
    setRecipe(null);
    setReviewIngredients([]);
    setErrorMessage(null);
    setCartMessage(null);

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "recipe",
          dish: dishName.trim(),
          servings,
          allergies,
          locale
        })
      });

      const data = (await res.json()) as RecipeResult & { error?: string; detail?: string };

      if (!res.ok) {
        setErrorMessage(data.detail || data.error || dictionary.recipe.aiError);
        return;
      }

      const generatedIngredients = data.ingredients ?? [];
      const pendingHistoryId = pendingHistoryIdRef.current;

      setRecipe(data);
      setReviewIngredients(generatedIngredients);
      setMobileChatMessages((current) => [
        ...current,
        {
          id: `recipe-${Date.now()}`,
          type: "recipe",
          text: interpolate(dictionary.recipe.mobileGenerated, {
            dish: data.dish || dishName.trim(),
            servings: data.servings || servings
          })
        }
      ]);

      if (pendingHistoryId) {
        setRecipeSearchHistory((current) => {
          const next = current.map((item) =>
            item.id === pendingHistoryId
              ? {
                  ...item,
                  text: data.dish || item.text,
                  servings: data.servings || servings,
                  allergiesText,
                  hasAllergy,
                  recipe: data,
                  reviewIngredients: generatedIngredients
                }
              : item
          );

          persistRecipeSearchHistory(next);
          return next;
        });
        pendingHistoryIdRef.current = null;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(dictionary.recipe.aiError);
    } finally {
      setLoading(false);
    }
  };

  const addIngredientsToCart = async (items: RecipeIngredient[], shouldNavigate = false) => {
    if (items.length === 0) {
      setCartMessage(dictionary.recipe.emptyCartList);
      return;
    }

    setCartLoading(true);
    setCartMessage(null);

    try {
      const ingredients = items.map((ingredient) => {
        const parsedAmount = parseAmount(ingredient.amount, locale);

        return {
          name: ingredient.name,
          normalizedName: normalizeName(ingredient.name),
          quantity: parsedAmount.quantity,
          unit: parsedAmount.unit,
          recipeDisplayAmount: ingredient.amount,
          source: "recipe" as const
        };
      });

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, locale })
      });

      const data = (await res.json()) as CartAddResponse;

      if (!res.ok || !data.success) {
        setCartMessage(!data.success ? data.error.message : dictionary.recipe.addCartFailed);
        return;
      }


      const matchedCount = data.data.items.length;
      const unmatchedCount = data.data.unmatchedIngredients.length;
      addItems(data.data.items);
      setCartMessage(
        interpolate(dictionary.recipe.cartAddedSummary, {
          matched: matchedCount,
          unmatched:
            unmatchedCount > 0
              ? interpolate(dictionary.recipe.unmatchedSummary, { count: unmatchedCount })
              : ""
        })
      );
      if (shouldNavigate) {
        router.push("/cart");
      }
    } catch (error) {
      console.error(error);
      setCartMessage(dictionary.recipe.addCartFailed);
    } finally {
      setCartLoading(false);
    }
  };

  const addReviewedIngredientsToCart = async () => {
    await addIngredientsToCart(reviewIngredients, true);
  };

  const addSingleReviewedIngredientToCart = async (ingredient: RecipeIngredient) => {
    await addIngredientsToCart([ingredient]);
  };

  const handleToggleRecipeFavorite = () => {
    if (!recipe || !favoriteRecipeId) {
      return;
    }

    const visibleIngredients = reviewIngredients.length > 0 ? reviewIngredients : recipe.ingredients ?? [];
    const ingredientText =
      visibleIngredients.map((ingredient) => ingredient.name).filter(Boolean).join(", ") ||
      dictionary.recipe.noIngredientList;
    const nutrition = estimateRecipeNutrition(
      visibleIngredients.map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.amount
      })),
      recipe.servings
    );

    toggleRecipe({
      id: favoriteRecipeId,
      name: recipe.dish || dishName.trim() || dictionary.recipe.recipeFallbackName,
      description:
        recipe.steps?.[0] ??
        interpolate(dictionary.recipe.mobileGenerated, {
          dish: recipe.dish || dishName.trim(),
          servings: recipe.servings
        }),
      ingredients: ingredientText,
      calories: nutrition.calories,
      carbs: nutrition.carbs,
      protein: nutrition.protein,
      fat: nutrition.fat,
      servings: recipe.servings,
      steps: recipe.steps ?? []
    });
  };

  const handleMobileConfirm = () => {
    setIsMobileFilterOpen(false);
    fetchRecipe();
  };

  const handleMobileDishNameChange = (value: string) => {
    setDishName(value);

    if (!value.trim()) {
      setHasSubmittedMobileChat(false);
    }
  };

  const handleMobileSubmitChat = () => {
    const submittedDishName = dishName.trim();

    if (!submittedDishName) {
      setErrorMessage(dictionary.recipe.enterDishError);
      return;
    }

    const historyId = `history-${Date.now()}`;
    pendingHistoryIdRef.current = historyId;

    setMobileChatMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        type: "user",
        text: submittedDishName
      }
    ]);
    saveRecipeSearchHistory([
      {
        id: historyId,
        text: submittedDishName,
        createdAt: new Date().toISOString(),
        servings,
        allergiesText,
        hasAllergy
      },
      ...recipeSearchHistory.filter(
        (item) => normalizeName(item.text) !== normalizeName(submittedDishName)
      )
    ].slice(0, 50));
    setHasSubmittedMobileChat(true);
    setIsMobileFilterOpen(true);
  };

  const handleDesktopSubmitChat = () => {
    const submittedDishName = dishName.trim();

    if (!submittedDishName) {
      setErrorMessage(dictionary.recipe.enterDishError);
      return;
    }

    setErrorMessage(null);
    setDesktopFilterOpen(true);
  };

  const handleDesktopConfirmFilters = () => {
    const submittedDishName = dishName.trim();

    if (!submittedDishName) {
      setErrorMessage(dictionary.recipe.enterDishError);
      setDesktopFilterOpen(false);
      return;
    }

    const historyId = `history-${Date.now()}`;
    pendingHistoryIdRef.current = historyId;
    setMobileChatMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        type: "user",
        text: submittedDishName
      }
    ]);
    saveRecipeSearchHistory([
      {
        id: historyId,
        text: submittedDishName,
        createdAt: new Date().toISOString(),
        servings,
        allergiesText,
        hasAllergy
      },
      ...recipeSearchHistory.filter(
        (item) => normalizeName(item.text) !== normalizeName(submittedDishName)
      )
    ].slice(0, 50));
    setHasSubmittedMobileChat(true);
    setDesktopFilterOpen(false);
    fetchRecipe();
  };

  const handleSelectRecipeHistory = (item: RecipeHistoryItem) => {
    setDishName(item.text);
    setServings(item.servings ?? 1);
    setAllergiesText(item.allergiesText ?? "");
    setHasAllergy(item.hasAllergy ?? Boolean(item.allergiesText));
    setErrorMessage(null);
    setCartMessage(null);
    setMobileHistoryOpen(false);
    setDesktopHistoryOpen(false);
    setDesktopFilterOpen(false);

    setMobileChatMessages((current) => [
      ...current,
      {
        id: `user-history-${Date.now()}`,
        type: "user",
        text: item.text
      },
      ...(item.recipe
        ? [
            {
              id: `recipe-history-${Date.now()}`,
              type: "recipe" as const,
              text: interpolate(dictionary.recipe.mobileReopened, {
                dish: item.recipe.dish || item.text,
                servings: item.recipe.servings || item.servings || 1
              })
            }
          ]
        : [])
    ]);
    setHasSubmittedMobileChat(true);

    if (item.recipe) {
      setRecipe({ ...item.recipe });
      setReviewIngredients([...(item.reviewIngredients ?? item.recipe.ingredients ?? [])]);
      setIsMobileFilterOpen(false);
      return;
    }

    setRecipe(null);
    setReviewIngredients([]);
    setIsMobileFilterOpen(true);
  };

  const handleDeleteRecipeHistoryItem = (id: string) => {
    saveRecipeSearchHistory(recipeSearchHistory.filter((item) => item.id !== id));
  };

  const handleDeleteRecipeHistoryGroup = (dateKey: string) => {
    saveRecipeSearchHistory(
      recipeSearchHistory.filter((item) => {
        const itemDateKey = new Date(item.createdAt).toDateString();

        return itemDateKey !== dateKey;
      })
    );
  };

  return (
    <>
      <RecipeMobileLayout
        dishName={dishName}
        hasSubmittedChat={hasSubmittedMobileChat}
        chatMessages={mobileChatMessages}
        historyOpen={mobileHistoryOpen}
        searchHistory={recipeSearchHistory}
        servings={servings}
        allergiesText={allergiesText}
        hasAllergy={hasAllergy}
        isFilterOpen={isMobileFilterOpen}
        recipe={recipe}
        reviewIngredients={reviewIngredients}
        loading={loading}
        cartLoading={cartLoading}
        cartMessage={cartMessage}
        isUnsafe={isUnsafe}
        onDishNameChange={handleMobileDishNameChange}
        onSubmitChat={handleMobileSubmitChat}
        onHistoryOpenChange={setMobileHistoryOpen}
        onSelectHistoryItem={handleSelectRecipeHistory}
        onDeleteHistoryItem={handleDeleteRecipeHistoryItem}
        onDeleteHistoryGroup={handleDeleteRecipeHistoryGroup}
        onClearHistory={() => saveRecipeSearchHistory([])}
        onServingsChange={setServings}
        onAllergiesTextChange={setAllergiesText}
        onHasAllergyChange={setHasAllergy}
        onFilterOpenChange={setIsMobileFilterOpen}
        onConfirm={handleMobileConfirm}
        onBack={() => window.history.back()}
        isConflictingIngredient={isConflictingIngredient}
        onRemoveIngredient={removeIngredient}
        onAddReviewedIngredientsToCart={addReviewedIngredientsToCart}
        isRecipeFavorite={isRecipeFavorite}
        onToggleRecipeFavorite={handleToggleRecipeFavorite}
      />

      <div className="mx-auto hidden max-w-[1540px] lg:block">
        <section className="relative min-h-[720px] rounded-[28px] bg-white px-[clamp(3rem,5vw,5.25rem)] py-[clamp(3rem,5vw,4.5rem)] shadow-sm">
          {desktopFilterOpen ? (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/25 px-6 backdrop-blur-[1px]">
              <div className="w-full max-w-[820px] rounded-[34px] border-[3px] border-black bg-white px-16 py-12 shadow-[22px_26px_0_rgba(0,0,0,0.24)]">
                <h3 className="text-[38px] font-black leading-none">
                  {locale === "vi" ? "Chọn lọc theo:" : "Filter by:"}
                </h3>

                <div className="mt-14 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_168px]">
                  <div className="flex h-16 items-center rounded-full bg-[linear-gradient(90deg,#ffffff_0%,#edc7ff_42%,#c766f3_100%)] px-9 text-[26px] font-black leading-none">
                    {dictionary.recipe.servings}:
                  </div>
                  <div className="flex h-16 items-center justify-center gap-7 rounded-full bg-[#d78cf4] px-7 text-[28px] font-black leading-none">
                    <button
                      type="button"
                      onClick={() => setServings((value) => Math.max(1, value - 1))}
                      className="flex h-10 w-10 items-center justify-center leading-none"
                      aria-label={locale === "vi" ? "Giảm số người ăn" : "Decrease servings"}
                    >
                      -
                    </button>
                    <span className="min-w-[1.5ch] text-center">{servings}</span>
                    <button
                      type="button"
                      onClick={() => setServings((value) => Math.min(50, value + 1))}
                      className="flex h-10 w-10 items-center justify-center leading-none"
                      aria-label={locale === "vi" ? "Tăng số người ăn" : "Increase servings"}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-9 space-y-4">
                  <div className="flex h-16 items-center justify-between gap-8 rounded-full bg-[linear-gradient(90deg,#ffffff_0%,#edc7ff_42%,#c766f3_100%)] px-9">
                    <p className="whitespace-nowrap text-[26px] font-black leading-none">
                      {locale === "vi" ? "Bạn có dị ứng không?" : "Any allergies?"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setHasAllergy((value) => {
                          const next = !value;
                          if (!next) {
                            setAllergiesText("");
                          }
                          return next;
                        });
                      }}
                      className={`flex h-10 w-20 shrink-0 items-center rounded-full bg-white p-1.5 transition ${
                        hasAllergy ? "justify-end" : "justify-start"
                      }`}
                      aria-pressed={hasAllergy}
                    >
                      <span className="h-7 w-7 rounded-full bg-[#FFE467]" />
                    </button>
                  </div>

                  {hasAllergy ? (
                    <input
                      value={allergiesText}
                      onChange={(event) => setAllergiesText(event.target.value)}
                      placeholder={dictionary.recipe.allergiesPlaceholder}
                      className="h-14 w-full rounded-full bg-[#fff7cf] px-9 text-lg font-black outline-none placeholder:text-black/40"
                      aria-label={dictionary.recipe.allergies}
                      autoFocus
                    />
                  ) : null}
                </div>

                <div className="mt-12 flex">
                  <button
                    type="button"
                    onClick={handleDesktopConfirmFilters}
                    className="h-16 w-[220px] rounded-full bg-black px-10 text-2xl font-black text-white transition hover:scale-[1.02]"
                  >
                    {locale === "vi" ? "Xác nhận" : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="relative flex items-center gap-6">
            <button
              type="button"
              onClick={() => setDesktopHistoryOpen((value) => !value)}
              className="flex h-24 w-24 items-center justify-center transition hover:scale-105"
              aria-expanded={desktopHistoryOpen}
            >
              <Image
                src="/assets/buttons/history-button-001.png"
                alt=""
                width={96}
                height={96}
                className="h-24 w-24 object-contain"
              />
            </button>
            <h2 className="text-[2rem] font-black leading-none">
              {locale === "vi" ? "Lịch sử" : "History"}
            </h2>

            {desktopHistoryOpen ? (
              <div className="absolute left-0 top-[7rem] z-20 w-[420px] rounded-[28px] bg-white p-4 shadow-[0_18px_42px_rgba(0,0,0,0.16)] ring-1 ring-black/5">
                <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-3">
                  <p className="text-base font-black">{locale === "vi" ? "Món đã hỏi" : "Recent dishes"}</p>
                  <button
                    type="button"
                    onClick={() => saveRecipeSearchHistory([])}
                    className="text-sm font-bold text-black/55 hover:text-black"
                  >
                    {locale === "vi" ? "Xóa" : "Clear"}
                  </button>
                </div>
                <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {recipeSearchHistory.length > 0 ? (
                    recipeSearchHistory.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectRecipeHistory(item)}
                        className="block w-full rounded-2xl bg-[#fff7cf] px-4 py-3 text-left text-sm font-bold transition hover:bg-[#ffe76a]"
                      >
                        {item.text}
                      </button>
                    ))
                  ) : (
                    <p className="rounded-2xl bg-[#f6f6f6] px-4 py-3 text-sm font-bold text-black/55">
                      {locale === "vi" ? "Chưa có lịch sử." : "No history yet."}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-16 flex min-h-[430px] flex-col justify-between gap-10">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <Image
                  src={logoMascot}
                  alt="Nấu mascot"
                  className="h-24 w-24 shrink-0 object-contain"
                  priority
                />
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="min-h-16 rounded-full border-4 border-black bg-white px-8 text-left text-xl font-black"
                >
                  {locale === "vi" ? "Hôm nay bạn muốn ăn gì?" : "What would you like to eat today?"}
                </button>
              </div>

              {hasSubmittedMobileChat && dishName.trim() ? (
                <div className="flex items-center justify-end gap-6">
                  <div className="min-h-14 w-[42%] rounded-full bg-[#edc7ff] px-8 py-4 text-lg font-black">
                    {dishName}
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-white">
                    <span className="sr-only">{locale === "vi" ? "Bạn" : "You"}</span>
                  </div>
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-3xl bg-[#fff3ea] px-6 py-4 text-base font-bold text-[#8c4d2b]">
                  {errorMessage}
                </div>
              ) : null}

              {loading ? (
                <div className="flex items-center justify-center gap-3 rounded-3xl bg-[#fff7cf] px-6 py-5 text-center">
                  <LoaderCircle className="h-6 w-6 animate-spin text-[#8A38F5]" />
                  <p className="text-base font-black">{dictionary.recipe.checking}</p>
                </div>
              ) : null}

              {recipe ? (
                <div className="rounded-[28px] bg-[#FFE467] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.08)]">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#8A38F5]">
                        {isUnsafe ? <AlertTriangle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-black/55">
                          {dictionary.recipe.resultFor} {recipe.servings} {dictionary.common.servings}
                        </p>
                        <h3 className="mt-1 text-[2rem] font-black leading-tight">{recipe.dish}</h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleRecipeFavorite}
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                        isRecipeFavorite ? "bg-[#c964f4] text-white" : "bg-white text-[#c964f4]"
                      }`}
                      aria-label={dictionary.recipe.recipeFallbackName}
                    >
                      <Heart className="h-6 w-6" fill="currentColor" />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-4">
                      <div className={`rounded-3xl p-4 text-sm font-bold leading-6 ${isUnsafe ? "bg-[#fff3ea] text-[#7d3f23]" : "bg-white text-black/70"}`}>
                        {isUnsafe ? (
                          <>
                            <p className="text-base font-black">{dictionary.recipe.allergyWarning}</p>
                            {(recipe.allergyWarnings ?? []).map((warning) => (
                              <p key={warning} className="mt-2">{warning}</p>
                            ))}
                          </>
                        ) : (
                          dictionary.recipe.safeMessage
                        )}
                      </div>

                      <div>
                        <h4 className="text-lg font-black">{dictionary.recipe.reviewTitle}</h4>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {reviewIngredients.map((ingredient, index) => {
                            const isConflict = isConflictingIngredient(ingredient.name);

                            return (
                              <div
                                key={`${ingredient.name}-${index}`}
                                className={`relative min-h-[86px] rounded-2xl px-4 py-3 pr-24 text-sm font-bold ${
                                  isConflict ? "bg-[#fff3ea] text-[#7d3f23]" : "bg-white text-black"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p>{ingredient.name}</p>
                                    <p className="mt-1 text-black/60">{ingredient.amount}</p>
                                  </div>
                                </div>
                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => removeIngredient(ingredient.name)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e1e1e1] text-black transition hover:scale-105"
                                    aria-label={`${dictionary.common.remove} ${ingredient.name}`}
                                  >
                                    <Minus className="h-5 w-5" strokeWidth={3} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => addSingleReviewedIngredientToCart(ingredient)}
                                    disabled={cartLoading}
                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#68AB6B] text-black transition hover:scale-105 disabled:opacity-60"
                                    aria-label={dictionary.recipe.addListToCart}
                                  >
                                    <ShoppingBasket className="h-5 w-5" strokeWidth={2.7} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <Button
                        onClick={addReviewedIngredientsToCart}
                        disabled={cartLoading || reviewIngredients.length === 0}
                        className="h-12 w-full rounded-full bg-[#68AB6B] text-base font-black text-black hover:bg-[#5c9c5f]"
                      >
                        <ShoppingBasket className="mr-2 h-5 w-5" />
                        {cartLoading ? dictionary.recipe.addingToCart : dictionary.recipe.addListToCart}
                      </Button>

                      {cartMessage ? (
                        <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-black">
                          {cartMessage}
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-black">{dictionary.recipe.stepsTitle}</h4>
                        <div className="mt-3 max-h-72 space-y-3 overflow-y-auto pr-2">
                          {recipe.steps?.map((step, index) => (
                            <p key={`${step}-${index}`} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold leading-6">
                              {index + 1}. {step}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black leading-6 text-black">
                        {locale === "vi"
                          ? "Link các video hướng dẫn tại YouTube:"
                          : "Tutorial videos on YouTube:"}{" "}
                        <a
                          href={recipeYoutubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#8A38F5] underline decoration-2 underline-offset-4"
                        >
                          {locale === "vi" ? "xem thêm" : "see more"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-end gap-6">
              <Image
                src={logoMascot}
                alt="Nấu mascot"
                className="h-24 w-24 shrink-0 object-contain"
                priority
              />
              <div className="flex flex-1 flex-col gap-3">
                <label className="flex h-16 items-center gap-4 rounded-full border-4 border-black bg-white px-5 shadow-sm">
                  <input
                    value={dishName}
                    onChange={(event) => setDishName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleDesktopSubmitChat();
                      }
                    }}
                    placeholder={locale === "vi" ? "Nhập món ăn ở đây..." : "Enter a dish here..."}
                    className="min-w-0 flex-1 bg-transparent text-xl font-black text-black outline-none placeholder:text-black/70"
                  />
                  <button
                    type="button"
                    onClick={handleDesktopSubmitChat}
                    disabled={loading}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-black transition hover:bg-[#ffe76a] disabled:opacity-60"
                    aria-label={dictionary.recipe.create}
                  >
                    {loading ? <LoaderCircle className="h-7 w-7 animate-spin" /> : <ArrowUp className="h-8 w-8" strokeWidth={2.8} />}
                  </button>
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
