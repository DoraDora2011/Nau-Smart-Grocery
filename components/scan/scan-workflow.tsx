"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChefHat, Clock, Heart, LoaderCircle, Plus, ShoppingBasket, Sparkles } from "lucide-react";

import { AppImageButton } from "@/components/AppImageButton";
import { RecipeMobileBottomNav } from "@/components/recipe/mobile/RecipeMobileBottomNav";
import { ImageIntake } from "@/components/scan/image-intake";
import { useLanguage } from "@/components/providers/language-provider";
import { useFavorites } from "@/components/providers/favorite-provider";
import { useCart } from "@/components/providers/cart-provider";
import { productCatalog, type ProductCatalogItem } from "@/data/productCatalog";
import { getLocalizedIngredientName } from "@/lib/i18n/ingredient-names";
import { estimateRecipeNutrition } from "@/lib/services/recipeNutrition";
import type { CartItem } from "@/types";
import type {
  DishSuggestion,
  Ingredient,
  ScanInputSource,
  ScanRouteResponse,
  SuggestDishesResponse,
} from "@/types";

type ScanRecipeView = {
  suggestion: DishSuggestion;
  display: { name: string; cuisine: string; summary: string };
  nutrition: ReturnType<typeof estimateRecipeNutrition>;
  ingredientNames: string[];
  steps: string[];
  upsellProducts: ProductCatalogItem[];
};

type ScanRecipeApiResult = {
  dish?: string;
  steps?: string[];
  ingredients?: Array<{
    name?: string;
    amount?: string;
  }>;
};

const VIETNAMESE_DISH_COPY: Record<
  string,
  { name: string; cuisine: string; summary: string }
> = {
  "dish-tomato-egg": {
    name: "Trứng xào cà chua",
    cuisine: "Món gia đình",
    summary: "Món xào nhanh với trứng mềm, cà chua mọng nước và tỏi thơm.",
  },
  "dish-thai-basil-chicken": {
    name: "Cơm gà xào húng quế",
    cuisine: "Món Thái",
    summary: "Gà xào thơm cùng húng quế, dùng với cơm nóng rất hợp cho bữa chính.",
  },
  "dish-garlic-butter-pasta": {
    name: "Mì bơ tỏi",
    cuisine: "Món Âu dễ nấu",
    summary: "Mì áp chảo cùng bơ và tỏi, thơm béo, dễ làm khi cần một bữa nhanh.",
  },
};

const difficultyLabels: Record<string, string> = {
  easy: "Dễ",
  medium: "Vừa",
  advanced: "Khó",
};

function getDishDisplay(suggestion: DishSuggestion) {
  return (
    VIETNAMESE_DISH_COPY[suggestion.id] ?? {
      name: suggestion.name,
      cuisine: suggestion.cuisine,
      summary: suggestion.summary,
    }
  );
}

function getDishNutrition(suggestion: DishSuggestion) {
  const ingredients = [...suggestion.matchedIngredients, ...suggestion.missingIngredients].map((name) => ({
    name,
    amount: "1 phần",
  }));

  return estimateRecipeNutrition(ingredients, 1);
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function getScanRecipeSteps(suggestion: DishSuggestion, dishName: string, ingredientNames: string[]) {
  if (suggestion.id === "dish-tomato-egg") {
    return [
      "Rửa sạch cà chua, cắt múi cau. Đập trứng ra tô, nêm một chút muối rồi đánh tan.",
      "Phi thơm tỏi với ít dầu ăn, cho cà chua vào xào đến khi mềm và ra nước ngọt.",
      "Đổ trứng vào chảo, đảo nhẹ tay để trứng bám đều cà chua nhưng vẫn còn mềm.",
      "Nêm lại vừa ăn, thêm hành lá nếu có. Dùng nóng với cơm trắng.",
    ];
  }

  if (suggestion.id === "dish-ga-xao-hung-que") {
    return [
      "Sơ chế thịt gà, băm hoặc cắt miếng nhỏ để nhanh chín và dễ thấm gia vị.",
      "Phi thơm tỏi, cho gà vào xào lửa lớn đến khi săn lại.",
      "Nêm nước mắm hoặc xì dầu, thêm chút đường và tiêu để vị cân bằng.",
      "Cho húng quế vào cuối cùng, đảo nhanh rồi tắt bếp. Ăn kèm cơm nóng.",
    ];
  }

  if (suggestion.id === "dish-mi-bo-toi") {
    return [
      "Luộc mì vừa chín tới, giữ lại một ít nước luộc mì để làm sốt.",
      "Đun chảy bơ, phi thơm tỏi ở lửa nhỏ để tỏi thơm nhưng không cháy.",
      "Cho mì vào chảo, thêm một ít nước luộc mì rồi đảo đều cho sốt áo quanh sợi mì.",
      "Nêm muối, tiêu và thêm rau thơm hoặc cà chua nếu có. Dùng khi còn nóng.",
    ];
  }

  return [
    `Sơ chế các nguyên liệu chính: ${ingredientNames.join(", ") || dishName}.`,
    "Ướp hoặc nêm nhẹ trước khi nấu để món ăn có vị đậm đà hơn.",
    "Nấu nguyên liệu chính ở lửa vừa đến khi chín đều, sau đó điều chỉnh gia vị.",
    "Trình bày ra đĩa, dùng nóng để giữ hương vị tốt nhất.",
  ];
}

function normalizeDetailedRecipeSteps(data: ScanRecipeApiResult, fallbackSteps: string[]) {
  const apiSteps = Array.isArray(data.steps)
    ? data.steps.map((step) => step.trim()).filter(Boolean)
    : [];

  if (apiSteps.length > 0) {
    return apiSteps;
  }

  return fallbackSteps;
}

async function fetchDetailedScanRecipeSteps(
  dishName: string,
  fallbackSteps: string[]
) {
  const response = await fetch("/api/recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "recipe",
      dish: dishName,
      servings: 1,
      allergies: [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Scan recipe detail request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ScanRecipeApiResult;
  return normalizeDetailedRecipeSteps(data, fallbackSteps);
}

function getUpsellProductsForSuggestion(suggestion: DishSuggestion) {
  const foodCategories = new Set(["seasoning", "vegetable", "egg-dairy", "rice-noodle", "meat"]);
  const categoryPriority =
    suggestion.id === "dish-tomato-egg"
      ? ["egg-dairy", "vegetable", "seasoning", "rice-noodle", "meat"]
      : suggestion.id === "dish-ga-xao-hung-que"
        ? ["meat", "vegetable", "seasoning", "rice-noodle", "egg-dairy"]
        : ["rice-noodle", "seasoning", "egg-dairy", "vegetable", "meat"];

  return categoryPriority
    .flatMap((category) =>
      productCatalog
        .filter((product) => foodCategories.has(product.category) && product.category === category)
        .slice(0, 2),
    )
    .slice(0, 8);
}

function buildCatalogCartItem(product: ProductCatalogItem): CartItem {
  return {
    id: product.id,
    productId: product.id,
    productName: product.name,
    brand: "Nấu Smart Grocery",
    category: product.categoryLabel,
    quantity: 1,
    unit: product.sellUnitLabel,
    estimatedPrice: product.price,
    sourceIngredient: product.name,
    image: product.image,
    cartQuantity: 1,
    sellUnitLabel: product.sellUnitLabel,
    displayUnit: product.displayUnit,
    source: "catalog",
  };
}

export function ScanWorkflow() {
  const { locale } = useLanguage();
  const { favoriteIds, favoriteRecipeIds, toggleProduct, toggleRecipe } = useFavorites();
  const { addItems } = useCart();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [source, setSource] = useState<ScanInputSource>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [dishSuggestions, setDishSuggestions] = useState<DishSuggestion[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanSummary, setScanSummary] = useState<string | null>(null);
  const [suggestionMessage, setSuggestionMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isLoadingRecipeDetails, setIsLoadingRecipeDetails] = useState(false);
  const [isSuggestionSheetOpen, setIsSuggestionSheetOpen] = useState(false);
  const [selectedRecipeView, setSelectedRecipeView] = useState<ScanRecipeView | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [upsellQuantities, setUpsellQuantities] = useState<Record<string, number>>({});
  const dragStartYRef = useRef<number | null>(null);
  const lastAutoScanKeyRef = useRef<string | null>(null);
  const scanCaptureActionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!cartMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCartMessage(null);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [cartMessage]);

  const handleToggleSuggestedDishFavorite = (suggestion: DishSuggestion) => {
    const display = getDishDisplay(suggestion);
    const nutrition = getDishNutrition(suggestion);
    const ingredientNames = [...suggestion.matchedIngredients, ...suggestion.missingIngredients]
      .map((name) => getLocalizedIngredientName(name, locale))
      .join(", ");

    toggleRecipe({
      id: `scan-suggestion-${suggestion.id}`,
      name: display.name,
      description: display.summary,
      ingredients: ingredientNames || "Chưa có danh sách nguyên liệu.",
      calories: nutrition.calories,
      carbs: nutrition.carbs,
      protein: nutrition.protein,
      fat: nutrition.fat,
      servings: 1,
      steps: suggestion.reasons.map((reason) => reason),
    });
  };

  const openScanRecipeView = async (suggestion: DishSuggestion) => {
    const display = getDishDisplay(suggestion);
    const nutrition = getDishNutrition(suggestion);
    const ingredientNames = [...suggestion.matchedIngredients, ...suggestion.missingIngredients].map((name) =>
      getLocalizedIngredientName(name, locale),
    );
    const fallbackSteps = getScanRecipeSteps(suggestion, display.name, ingredientNames);

    setSelectedRecipeView({
      suggestion,
      display,
      nutrition,
      ingredientNames,
      steps: fallbackSteps,
      upsellProducts: getUpsellProductsForSuggestion(suggestion),
    });
    setIsSuggestionSheetOpen(false);
    setCartMessage(null);
    setIsLoadingRecipeDetails(true);

    try {
      const detailedSteps = await fetchDetailedScanRecipeSteps(display.name, fallbackSteps);

      setSelectedRecipeView((current) => {
        if (!current || current.suggestion.id !== suggestion.id) {
          return current;
        }

        return {
          ...current,
          steps: detailedSteps,
        };
      });
    } catch (error) {
      console.warn("Could not load detailed scan recipe steps; using fallback steps.", error);
    } finally {
      setIsLoadingRecipeDetails(false);
    }
  };

  const addUpsellProductToCart = (product: ProductCatalogItem) => {
    addItems([buildCatalogCartItem(product)]);
    setUpsellQuantities((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1,
    }));
    setCartMessage("Đã thêm vào giỏ hàng ✓");
  };

  const toggleUpsellFavorite = (product: ProductCatalogItem) => {
    toggleProduct({
      id: product.id,
      productId: product.id,
      name: product.name,
      detail: product.detail ?? product.displayUnit,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      category: product.categoryLabel,
    });
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const resetScanResults = useCallback(() => {
    setIngredients([]);
    setDishSuggestions([]);
    setWarning(null);
    setErrorMessage(null);
    setScanSummary(null);
    setSuggestionMessage(null);
    setIsSuggestionSheetOpen(false);
  }, []);

  const suggestDishesFromIngredients = useCallback(async (detectedIngredients: Ingredient[]) => {
    const confirmedIngredients = detectedIngredients
      .map((ingredient) => getLocalizedIngredientName(ingredient.normalizedName || ingredient.name, locale))
      .filter(Boolean);

    if (confirmedIngredients.length === 0) {
      setSuggestionMessage("Chưa có đủ nguyên liệu để gợi ý món ăn.");
      return;
    }

    setIsSuggesting(true);
    setSuggestionMessage(null);
    setDishSuggestions([]);

    try {
      const response = await fetch("/api/suggest-dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmedIngredients,
          limit: 4,
        }),
      });

      const payload = (await response.json()) as SuggestDishesResponse;

      if (!response.ok || !payload.success) {
        setSuggestionMessage(
          payload.success ? "Chưa thể gợi ý món lúc này." : payload.error.message,
        );
        return;
      }

      setDishSuggestions(payload.data.suggestions);
      setScanSummary(`Đã xác định ${payload.data.ingredientCount} nguyên liệu.`);
      setIsSuggestionSheetOpen(true);
    } catch (error) {
      console.error(error);
      setSuggestionMessage("Chưa thể gợi ý món lúc này.");
    } finally {
      setIsSuggesting(false);
    }
  }, [locale]);

  const handleScan = useCallback(async () => {
    if (!selectedFile) {
      setErrorMessage("Vui lòng chọn hoặc chụp ảnh trước khi bắt đầu quét.");
      return;
    }

    setIsScanning(true);
    resetScanResults();

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("source", source);

      const response = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as ScanRouteResponse;

      if (!response.ok || !payload.success) {
        setErrorMessage(payload.success ? "Hiện chưa thể phân tích ảnh này." : payload.error.message);
        return;
      }

      setIngredients(payload.data.ingredients);
      setIsSuggestionSheetOpen(true);
      setWarning(
        payload.data.warnings.length > 0
          ? "Hệ thống đang dùng kết quả dự phòng an toàn. Bạn hãy kiểm tra lại danh sách nguyên liệu."
          : null,
      );
      await suggestDishesFromIngredients(payload.data.ingredients);
    } catch (error) {
      console.error(error);
      setErrorMessage("Hiện chưa thể phân tích ảnh này.");
    } finally {
      setIsScanning(false);
    }
  }, [resetScanResults, selectedFile, source, suggestDishesFromIngredients]);

  useEffect(() => {
    if (!selectedFile) {
      lastAutoScanKeyRef.current = null;
      return;
    }

    if (isScanning) {
      return;
    }

    const scanKey = `${source}:${selectedFile.name}:${selectedFile.size}:${selectedFile.lastModified}`;

    if (lastAutoScanKeyRef.current === scanKey) {
      return;
    }

    lastAutoScanKeyRef.current = scanKey;
    void handleScan();
  }, [handleScan, isScanning, selectedFile, source]);

  return (
    <div className="relative h-[100dvh] min-h-0 overflow-hidden bg-[#FFF1AF] text-black lg:h-auto lg:min-h-[100dvh]">
      <div className="fixed right-6 top-6 z-50">
        <AppImageButton
          buttonId="button-009"
          href="/"
          size={58}
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full text-black"
        />
      </div>

      <ImageIntake
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        scanActionRef={scanCaptureActionRef}
        onFileChange={(file, nextSource) => {
          setSelectedFile(file);
          setSource(nextSource);
          resetScanResults();
        }}
        onClear={() => {
          setSelectedFile(null);
          resetScanResults();
        }}
        onSubmit={handleScan}
        isLoading={isScanning}
        errorMessage={errorMessage}
      />

      {ingredients.length > 0 ? (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 mx-auto max-h-[82dvh] max-w-md overflow-hidden rounded-t-[34px] bg-[#ffe467] px-6 pb-28 pt-3 shadow-[0_-20px_45px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out lg:max-w-3xl lg:pb-10 ${
            isSuggestionSheetOpen ? "translate-y-0" : "translate-y-[calc(100%-24px)]"
          }`}
        >
          <button
            type="button"
            className="mx-auto mb-6 block h-8 w-28 touch-none rounded-full"
            aria-label="Kéo xuống để thu gọn gợi ý món"
            onClick={() => setIsSuggestionSheetOpen((current) => !current)}
            onPointerDown={(event) => {
              dragStartYRef.current = event.clientY;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerUp={(event) => {
              const startY = dragStartYRef.current;
              dragStartYRef.current = null;

              if (startY === null) {
                return;
              }

              const deltaY = event.clientY - startY;

              if (deltaY > 45) {
                setIsSuggestionSheetOpen(false);
              }

              if (deltaY < -45) {
                setIsSuggestionSheetOpen(true);
              }
            }}
          >
            <span className="mx-auto mt-3 block h-1.5 w-16 rounded-full bg-white" />
          </button>

          <div className="max-h-[68dvh] overflow-y-auto pr-1">
            <div className="mb-5">
              <p className="text-sm font-black uppercase tracking-wide text-black/55">
                Gợi ý từ ảnh quét
              </p>
              <h2 className="mt-1 text-2xl font-black leading-tight sm:text-3xl">Món có thể nấu</h2>
              <p className="mt-2 text-sm font-bold text-black/60">
                {scanSummary ?? `Đã xác định ${ingredients.length} nguyên liệu.`}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ingredients.slice(0, 6).map((ingredient) => (
                  <span
                    key={ingredient.id}
                    className="rounded-full bg-white px-3 py-1 text-xs font-black text-black/70"
                  >
                    {getLocalizedIngredientName(ingredient.normalizedName || ingredient.name, locale)}
                  </span>
                ))}
                {ingredients.length > 6 ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black/70">
                    +{ingredients.length - 6}
                  </span>
                ) : null}
              </div>
            </div>

            {warning ? (
              <p className="mb-4 rounded-3xl bg-white px-4 py-3 text-sm font-bold text-[#8c4d2b]">
                {warning}
              </p>
            ) : null}

            {isSuggesting ? (
              <div className="flex min-h-48 items-center justify-center rounded-[28px] bg-white">
                <div className="flex items-center gap-3 text-sm font-black text-black/60">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Nấu đang tìm món phù hợp...
                </div>
              </div>
            ) : null}

            {suggestionMessage ? (
              <p className="rounded-3xl bg-white px-4 py-4 text-sm font-bold text-[#8c4d2b]">
                {suggestionMessage}
              </p>
            ) : null}

            {!isSuggesting && dishSuggestions.length > 0 ? (
              <div className="space-y-6">
                {dishSuggestions.map((suggestion) => (
                  (() => {
                    const display = getDishDisplay(suggestion);
                    const nutrition = getDishNutrition(suggestion);
                    const ingredientNames = [
                      ...suggestion.matchedIngredients,
                      ...suggestion.missingIngredients,
                    ]
                      .map((name) => getLocalizedIngredientName(name, locale))
                      .join(", ");

                    return (
                      <article
                        key={suggestion.id}
                        className="rounded-[24px] bg-white p-5 text-left shadow-sm transition active:scale-[0.99]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => openScanRecipeView(suggestion)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <h3 className="text-xl font-black leading-tight sm:text-2xl">{display.name}</h3>
                            <p className="mt-3 text-xs font-bold text-black/45">Mô tả món ăn:</p>
                            <p className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-black/55">
                              {display.summary}
                            </p>
                            <p className="mt-2 line-clamp-1 text-xs font-bold text-black/45">
                              Nguyên liệu chính: {ingredientNames || "đang đối chiếu"}
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleSuggestedDishFavorite(suggestion)}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition active:scale-90 ${
                              favoriteRecipeIds.has(`scan-suggestion-${suggestion.id}`)
                                ? "bg-[#cd6cfd]"
                                : "bg-[#69bf7b]"
                            }`}
                            aria-label={`Lưu món ${display.name} vào yêu thích`}
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => openScanRecipeView(suggestion)}
                          className="mt-5 block w-full text-left"
                        >
                          <div className="grid grid-cols-4 gap-3">
                          <div className="rounded-2xl border-2 border-black px-2 py-2 text-center">
                            <p className="text-sm font-black">{nutrition.calories}</p>
                            <p className="text-[10px] font-black">Calories</p>
                          </div>
                          <div className="rounded-2xl border-2 border-black px-2 py-2 text-center">
                            <p className="text-sm font-black">{nutrition.carbs}</p>
                            <p className="text-[10px] font-black">Carb</p>
                          </div>
                          <div className="rounded-2xl border-2 border-black px-2 py-2 text-center">
                            <p className="text-sm font-black">{nutrition.protein}</p>
                            <p className="text-[10px] font-black">Protein</p>
                          </div>
                          <div className="rounded-2xl border-2 border-black px-2 py-2 text-center">
                            <p className="text-sm font-black">{nutrition.fat}</p>
                            <p className="text-[10px] font-black">Fat</p>
                          </div>
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-sm font-black text-black/55">
                          <ChefHat className="h-4 w-4" />
                          {display.cuisine}
                          <Clock className="ml-2 h-4 w-4" />
                          {difficultyLabels[suggestion.difficulty] ?? suggestion.difficulty}
                          <Sparkles className="ml-auto h-4 w-4" />
                          </div>
                        </button>
                      </article>
                    );
                  })()
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {selectedRecipeView ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-white pb-0 text-black">
          {cartMessage ? (
            <div className="fixed left-1/2 top-4 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full bg-white px-5 py-3 text-center text-sm font-black shadow-lg">
              {cartMessage}
            </div>
          ) : null}

          <div className="fixed right-6 top-6 z-[90]">
            <AppImageButton
              buttonId="button-009"
              onClick={() => setSelectedRecipeView(null)}
              size={58}
              className="flex h-[58px] w-[58px] items-center justify-center rounded-full text-black shadow-sm"
            />
          </div>

          <main className="mx-auto min-h-[100dvh] max-w-md">
            <section className="px-11 pb-8 pt-28">
              <h1 className="text-3xl font-black leading-tight sm:text-4xl">{selectedRecipeView.display.name}</h1>
              <p className="mt-7 text-sm font-bold leading-6 text-black/80 sm:mt-9 sm:text-base sm:leading-7">
                {selectedRecipeView.display.summary}
              </p>
              <p className="mt-5 text-sm font-bold leading-6 text-black/80 sm:mt-6 sm:text-base sm:leading-7">
                Công thức này ưu tiên các nguyên liệu đã nhận diện được từ ảnh quét. Bạn có thể xem nhanh cách nấu,
                sau đó mua thêm các sản phẩm phù hợp ở phần bên dưới.
              </p>

              <div className="mt-8 space-y-4">
                {isLoadingRecipeDetails ? (
                  <div className="flex items-center gap-3 rounded-3xl bg-[#ffe467] px-4 py-3 text-sm font-black text-black/70">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Nấu đang viết hướng dẫn chi tiết từng bước...
                  </div>
                ) : null}
                {selectedRecipeView.steps.map((step, index) => (
                  <p key={`${step}-${index}`} className="text-sm font-bold leading-6 text-black/85 sm:text-base sm:leading-7">
                    {index + 1}. {step}
                  </p>
                ))}
              </div>

              <p className="mt-8 text-sm font-bold leading-6 sm:text-base">
                Link các video hướng dẫn tại Youtube:{" "}
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    `cách nấu ${selectedRecipeView.display.name}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-2 underline-offset-4"
                >
                  xem thêm
                </a>
              </p>

              <div className="mt-6 grid grid-cols-4 gap-5">
                {[
                  ["Calories", selectedRecipeView.nutrition.calories],
                  ["Carb", selectedRecipeView.nutrition.carbs],
                  ["Protein", selectedRecipeView.nutrition.protein],
                  ["Fat", selectedRecipeView.nutrition.fat],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border-2 border-black px-2 py-2 text-center text-[10px] font-black leading-tight"
                  >
                    <p className="text-sm">{value}</p>
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="min-h-[58dvh] rounded-t-[28px] bg-[#ffe467] px-6 pb-40 pt-7">
              <div className="rounded-full bg-[linear-gradient(100deg,#ffffff_0%,#edc7ff_45%,#cd6cfd_100%)] px-7 py-4">
                <p className="text-sm font-black leading-6 sm:text-base">
                  Món ăn của bạn sẽ hoàn hảo hơn nếu có thêm các nguyên liệu sau:
                </p>
              </div>

              <div className="mt-10 flex snap-x gap-6 overflow-x-auto pb-3">
                {selectedRecipeView.upsellProducts.map((product) => (
                  <article
                    key={product.id}
                    className="w-[152px] shrink-0 snap-start rounded-[26px] bg-white p-2.5 pb-4 shadow-sm"
                  >
                    <div className="relative flex aspect-square items-center justify-center rounded-[22px] bg-[#EEEEEE] p-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-center text-xs font-black">{product.name}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleUpsellFavorite(product)}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#69bf7b] text-white ring-2 ring-white transition active:scale-90"
                        aria-label={`Lưu ${product.name} vào yêu thích`}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${
                            favoriteIds.has(product.id) ? "animate-[favorite-pop_260ms_ease-out]" : ""
                          }`}
                          fill={favoriteIds.has(product.id) ? "#CD6CFD" : "none"}
                          stroke={favoriteIds.has(product.id) ? "#CD6CFD" : "currentColor"}
                        />
                      </button>
                    </div>

                    <div className="px-1 pt-4">
                      <h3 className="line-clamp-2 min-h-9 text-[11px] font-black leading-snug">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-[10px] font-bold text-black/65">
                        {product.detail ?? product.displayUnit}
                      </p>

                      <div className="mt-4 flex items-end justify-between gap-2">
                        <div>
                          <p className="text-lg font-black leading-none sm:text-xl">{formatPrice(product.price)}</p>
                          {product.oldPrice ? (
                            <p className="mt-1 text-[10px] font-bold text-black/45 line-through">
                              {formatPrice(product.oldPrice)}
                            </p>
                          ) : null}
                        </div>
                        {upsellQuantities[product.id] ? (
                          <div className="flex h-9 w-[70px] shrink-0 items-center justify-between rounded-full bg-[#69bf7b] px-2 text-black">
                            <span className="text-sm font-black">-</span>
                            <span className="text-sm font-black">{upsellQuantities[product.id]}</span>
                            <button
                              type="button"
                              onClick={() => addUpsellProductToCart(product)}
                              className="text-base font-black leading-none sm:text-lg"
                              aria-label={`Tăng số lượng ${product.name}`}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addUpsellProductToCart(product)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#69bf7b] text-black"
                            aria-label={`Thêm ${product.name} vào giỏ`}
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecipeView(null)}
                className="mx-auto mt-8 block rounded-full bg-[#69bf7b] px-10 py-3 text-base font-black leading-tight shadow-[0_10px_20px_rgba(0,0,0,0.22)] sm:px-14 sm:py-4 sm:text-lg"
              >
                Hoàn tất
              </button>
            </section>
          </main>
        </div>
      ) : null}

      <RecipeMobileBottomNav onScanClick={() => scanCaptureActionRef.current?.()} />
    </div>
  );
}
