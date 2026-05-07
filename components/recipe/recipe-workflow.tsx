"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ChefHat,
  LoaderCircle,
  ShieldCheck,
  ShoppingBasket,
  Soup,
  Trash2,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RecipeMobileLayout } from "@/components/recipe/mobile/RecipeMobileLayout";
import { useCart } from "@/components/providers/cart-provider";
import { useFavorites } from "@/components/providers/favorite-provider";
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

function parseAmount(amount: string) {
  const normalized = amount.replace(/,/g, ".");
  const numbers = normalized.match(/\d+(?:\.\d+)?/g)?.map(Number).filter(Number.isFinite) ?? [];
  const quantity = numbers.length > 0 ? Math.max(...numbers) : 1;
  const unitMatch = normalized.match(/[\p{L}]+/u);

  return {
    quantity,
    unit: unitMatch?.[0] ?? "phần"
  };
}

function hasNameOverlap(left: string, right: string) {
  const a = normalizeName(left);
  const b = normalizeName(right);

  return Boolean(a && b && (a.includes(b) || b.includes(a)));
}

export function RecipeWorkflow() {
  const router = useRouter();
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
    setCartMessage("Đã xoá nguyên liệu này khỏi danh sách chuẩn bị thêm vào giỏ.");
  };

  const fetchRecipe = async () => {
    if (!dishName.trim()) {
      setErrorMessage("Vui lòng nhập tên món ăn.");
      return;
    }

    if (servings <= 0) {
      setErrorMessage("Số người ăn phải lớn hơn 0.");
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
          allergies
        })
      });

      const data = (await res.json()) as RecipeResult & { error?: string; detail?: string };

      if (!res.ok) {
        setErrorMessage(data.detail || data.error || "AI chưa thể tạo công thức lúc này.");
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
          text: `Đã tạo công thức ${data.dish || dishName.trim()} cho ${
            data.servings || servings
          } người.`
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
      setErrorMessage("AI chưa thể tạo công thức lúc này.");
    } finally {
      setLoading(false);
    }
  };

  const addReviewedIngredientsToCart = async () => {
    if (reviewIngredients.length === 0) {
      setCartMessage("Danh sách nguyên liệu đang trống, chưa thể thêm vào giỏ.");
      return;
    }

    setCartLoading(true);
    setCartMessage(null);

    try {
      const ingredients = reviewIngredients.map((ingredient) => {
        const parsedAmount = parseAmount(ingredient.amount);

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
        body: JSON.stringify({ ingredients })
      });

      const data = (await res.json()) as CartAddResponse;

      if (!res.ok || !data.success) {
        setCartMessage(!data.success ? data.error.message : "Chưa thể thêm vào giỏ lúc này.");
        return;
      }


      const matchedCount = data.data.items.length;
      const unmatchedCount = data.data.unmatchedIngredients.length;
      addItems(data.data.items);
      setCartMessage(
        `Đã thêm ${matchedCount} mặt hàng vào giỏ. ${
          unmatchedCount > 0 ? `${unmatchedCount} nguyên liệu chưa có sản phẩm phù hợp.` : ""
        }`
      );
      router.push("/cart");
    } catch (error) {
      console.error(error);
      setCartMessage("Chưa thể thêm vào giỏ lúc này.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleToggleRecipeFavorite = () => {
    if (!recipe || !favoriteRecipeId) {
      return;
    }

    const visibleIngredients = reviewIngredients.length > 0 ? reviewIngredients : recipe.ingredients ?? [];
    const ingredientText =
      visibleIngredients.map((ingredient) => ingredient.name).filter(Boolean).join(", ") ||
      "Chưa có danh sách nguyên liệu.";
    const nutrition = estimateRecipeNutrition(
      visibleIngredients.map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.amount
      })),
      recipe.servings
    );

    toggleRecipe({
      id: favoriteRecipeId,
      name: recipe.dish || dishName.trim() || "Công thức nấu ăn",
      description:
        recipe.steps?.[0] ??
        `Công thức nấu ${recipe.dish || dishName.trim()} dành cho ${recipe.servings} người.`,
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
      setErrorMessage("Vui lòng nhập tên món ăn.");
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

  const handleSelectRecipeHistory = (item: RecipeHistoryItem) => {
    setDishName(item.text);
    setServings(item.servings ?? 1);
    setAllergiesText(item.allergiesText ?? "");
    setHasAllergy(item.hasAllergy ?? Boolean(item.allergiesText));
    setErrorMessage(null);
    setCartMessage(null);
    setMobileHistoryOpen(false);

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
              text: `Đã mở lại công thức ${item.recipe.dish || item.text} cho ${
                item.recipe.servings || item.servings || 1
              } người.`
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

      <div className="hidden gap-5 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold leading-tight sm:text-xl">Nháº­p mÃ³n Äƒn</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              Nháº­p tÃªn mÃ³n, sá»‘ ngÆ°á»i Äƒn vÃ  nguyÃªn liá»‡u dá»‹ á»©ng náº¿u cÃ³.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[var(--color-ink)]">
              TÃªn mÃ³n Äƒn
            </label>
            <Input
              value={dishName}
              onChange={(event) => setDishName(event.target.value)}
              placeholder="VÃ­ dá»¥: Canh chua cÃ¡, bÃ² kho, thá»‹t kho trá»©ng"
              className="bg-white"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[var(--color-ink)]">
              Sá»‘ ngÆ°á»i Äƒn
            </label>
            <div className="flex items-center gap-3 rounded-3xl border border-[var(--color-border)] bg-white px-4 py-3">
              <Users className="h-5 w-5 text-[var(--color-primary)]" />
              <input
                type="number"
                min={1}
                max={50}
                value={servings}
                onChange={(event) => setServings(Number(event.target.value) || 1)}
                className="w-full bg-transparent text-base outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[var(--color-ink)]">
              Dá»‹ á»©ng cáº§n trÃ¡nh
            </label>
            <textarea
              value={allergiesText}
              onChange={(event) => setAllergiesText(event.target.value)}
              placeholder="VÃ­ dá»¥: tÃ´m, Ä‘áº­u phá»™ng, sá»¯a"
              className="min-h-28 w-full resize-none rounded-3xl border border-[var(--color-border)] bg-white px-4 py-4 text-sm outline-none focus:border-[var(--color-primary)]"
            />
            <div className="flex flex-wrap gap-2">
              {allergies.length > 0 ? (
                allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-sm font-medium"
                  >
                    {allergy}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[var(--color-ink-soft)]">
                  CÃ³ thá»ƒ Ä‘á»ƒ trá»‘ng náº¿u khÃ´ng cáº§n lá»c dá»‹ á»©ng.
                </p>
              )}
            </div>
          </div>

          <Button onClick={fetchRecipe} disabled={loading} className="w-full">
            <ChefHat className="mr-2 h-4 w-4" />
            {loading ? "Äang táº¡o cÃ´ng thá»©c..." : "Táº¡o cÃ´ng thá»©c náº¥u Äƒn"}
          </Button>
        </Card>

        {errorMessage ? (
          <Card className="border border-[#e7c6b0] bg-[#fff3ea] text-sm text-[#8c4d2b]">
            {errorMessage}
          </Card>
        ) : null}
      </div>

      <div className="space-y-5">
        {loading ? (
          <Card className="flex min-h-44 items-center justify-center gap-3 text-center">
            <LoaderCircle className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
            <p className="font-semibold">AI Ä‘ang kiá»ƒm tra dá»‹ á»©ng vÃ  táº¡o cÃ´ng thá»©c...</p>
          </Card>
        ) : null}

        {recipe ? (
          <Card className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-muted)] text-[var(--color-primary)]">
                {isUnsafe ? <AlertTriangle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-accent)]">
                  CÃ´ng thá»©c cho {recipe.servings} ngÆ°á»i
                </p>
                <h2 className="mt-1 text-xl font-semibold leading-tight sm:text-2xl">{recipe.dish}</h2>
              </div>
            </div>

            {isUnsafe ? (
              <div className="space-y-3 rounded-3xl border border-[#e7c6b0] bg-[#fff3ea] p-4 text-[#7d3f23]">
                <h3 className="font-semibold">Cáº£nh bÃ¡o dá»‹ á»©ng</h3>
                {(recipe.allergyWarnings ?? []).map((warning) => (
                  <p key={warning} className="text-sm leading-6">
                    {warning}
                  </p>
                ))}
                {(recipe.conflictingIngredients?.length ?? 0) > 0 ? (
                  <p className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold">
                    NguyÃªn liá»‡u xung Ä‘á»™t: {recipe.conflictingIngredients?.join(", ")}
                  </p>
                ) : null}
                <p className="text-sm leading-6">
                  Báº¡n cÃ³ thá»ƒ xoÃ¡ nguyÃªn liá»‡u xung Ä‘á»™t khá»i danh sÃ¡ch bÃªn dÆ°á»›i, hoáº·c náº¿u váº«n muá»‘n
                  giá»¯ nguyÃªn cÃ´ng thá»©c thÃ¬ báº¥m nÃºt xÃ¡c nháº­n thÃªm vÃ o giá».
                </p>
              </div>
            ) : (
              <div className="rounded-3xl bg-[var(--color-muted)] p-4 text-sm text-[var(--color-ink-soft)]">
                CÃ´ng thá»©c khÃ´ng phÃ¡t hiá»‡n xung Ä‘á»™t vá»›i danh sÃ¡ch dá»‹ á»©ng báº¡n Ä‘Ã£ nháº­p.
              </div>
            )}

            <div>
              <h4 className="text-base font-semibold leading-snug sm:text-lg">Danh sÃ¡ch nguyÃªn liá»‡u chuáº©n bá»‹ thÃªm vÃ o giá»</h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {reviewIngredients.map((ingredient, index) => {
                  const isConflict = isConflictingIngredient(ingredient.name);

                  return (
                    <div
                      key={`${ingredient.name}-${index}`}
                      className={`rounded-2xl px-4 py-4 ${
                        isConflict
                          ? "border border-[#e7c6b0] bg-[#fff3ea]"
                          : "bg-[var(--color-muted)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{ingredient.name}</p>
                          <p className="mt-1 text-sm text-[var(--color-ink)]">{ingredient.amount}</p>
                        </div>
                        {isConflict ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => removeIngredient(ingredient.name)}
                            aria-label={`XoÃ¡ ${ingredient.name} khá»i danh sÃ¡ch`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>
                      {isConflict ? (
                        <p className="mt-2 text-xs font-semibold text-[#8c4d2b]">
                          CÃ³ thá»ƒ gÃ¢y dá»‹ á»©ng, hÃ£y xoÃ¡ náº¿u báº¡n muá»‘n loáº¡i khá»i giá».
                        </p>
                      ) : null}
                      {ingredient.alternatives && ingredient.alternatives.length > 0 ? (
                        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                          CÃ³ thá»ƒ thay báº±ng: {ingredient.alternatives.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={addReviewedIngredientsToCart}
              disabled={cartLoading || reviewIngredients.length === 0}
              className="w-full"
            >
              <ShoppingBasket className="mr-2 h-4 w-4" />
              {cartLoading ? "Äang thÃªm vÃ o giá»..." : "XÃ¡c nháº­n thÃªm danh sÃ¡ch vÃ o giá» hÃ ng"}
            </Button>

            {cartMessage ? (
              <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
                {cartMessage}
              </div>
            ) : null}

            <div>
              <h4 className="text-base font-semibold leading-snug sm:text-lg">CÃ¡ch lÃ m</h4>
              <div className="mt-3 space-y-3">
                {recipe.steps?.map((step, index) => (
                  <p key={`${step}-${index}`} className="rounded-2xl bg-white px-4 py-3 text-sm">
                    {index + 1}. {step}
                  </p>
                ))}
              </div>
            </div>
          </Card>
        ) : null}

        {!recipe && !loading ? (
          <Card className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
              <Soup className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold leading-tight sm:text-xl">CÃ´ng thá»©c sáº½ hiá»ƒn thá»‹ á»Ÿ Ä‘Ã¢y</h2>
            <p className="text-sm text-[var(--color-ink-soft)]">
              Sau khi nháº­p tÃªn mÃ³n, sá»‘ ngÆ°á»i Äƒn vÃ  dá»‹ á»©ng náº¿u cÃ³, há»‡ thá»‘ng sáº½ táº¡o sáºµn cÃ¡c card
              nguyÃªn liá»‡u. Náº¿u phÃ¡t hiá»‡n xung Ä‘á»™t dá»‹ á»©ng, báº¡n cÃ³ thá»ƒ xoÃ¡ nguyÃªn liá»‡u Ä‘Ã³ trÆ°á»›c khi
              thÃªm vÃ o giá».
            </p>
          </Card>
        ) : null}
      </div>
    </div>
    </>
  );
}
