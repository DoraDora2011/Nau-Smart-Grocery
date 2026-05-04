"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import {
  estimateRecipeNutrition,
  ingredientsTextToNutritionInputs
} from "@/lib/services/recipeNutrition";

export interface FavoriteProduct {
  id: string;
  productId: string;
  name: string;
  detail: string;
  price: number;
  oldPrice?: number | null;
  image?: string;
  category?: string;
}

export interface FavoriteRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  servings?: number;
  steps?: string[];
}

interface FavoriteContextValue {
  products: FavoriteProduct[];
  recipes: FavoriteRecipe[];
  favoriteIds: Set<string>;
  favoriteRecipeIds: Set<string>;
  addProduct: (product: FavoriteProduct) => void;
  removeProduct: (id: string) => void;
  toggleProduct: (product: FavoriteProduct) => void;
  addRecipe: (recipe: FavoriteRecipe) => void;
  removeRecipe: (id: string) => void;
  toggleRecipe: (recipe: FavoriteRecipe) => void;
}

const STORAGE_KEY = "nau-smart-grocery-favorite-products";
const RECIPE_STORAGE_KEY = "nau-smart-grocery-favorite-recipes";

const FavoriteContext = createContext<FavoriteContextValue | null>(null);

function normalizeFavoriteProduct(product: FavoriteProduct): FavoriteProduct {
  return {
    ...product,
    id: product.id || product.productId,
    productId: product.productId || product.id,
    detail: product.detail || "1 sản phẩm",
    price: Number.isFinite(product.price) ? product.price : 0,
    oldPrice: product.oldPrice ?? null
  };
}

function normalizeFavoriteRecipe(recipe: FavoriteRecipe): FavoriteRecipe {
  const nutrition = estimateRecipeNutrition(
    ingredientsTextToNutritionInputs(recipe.ingredients || recipe.name),
    recipe.servings
  );

  return {
    ...recipe,
    id: recipe.id || recipe.name,
    description: recipe.description || "Công thức đã lưu từ đầu bếp Nâu.",
    ingredients: recipe.ingredients || "Chưa có danh sách nguyên liệu.",
    calories: recipe.calories && recipe.calories !== "xxx" ? recipe.calories : nutrition.calories,
    carbs: recipe.carbs && recipe.carbs !== "xxx" ? recipe.carbs : nutrition.carbs,
    protein: recipe.protein && recipe.protein !== "xxx" ? recipe.protein : nutrition.protein,
    fat: recipe.fat && recipe.fat !== "xxx" ? recipe.fat : nutrition.fat,
    steps: recipe.steps ?? []
  };
}

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<FavoriteProduct[]>([]);
  const [recipes, setRecipes] = useState<FavoriteRecipe[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setProducts((JSON.parse(saved) as FavoriteProduct[]).map(normalizeFavoriteProduct));
      }

      const savedRecipes = window.localStorage.getItem(RECIPE_STORAGE_KEY);

      if (savedRecipes) {
        setRecipes((JSON.parse(savedRecipes) as FavoriteRecipe[]).map(normalizeFavoriteRecipe));
      }
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipes));
  }, [hasHydrated, products, recipes]);

  const favoriteIds = useMemo(() => new Set(products.map((product) => product.id)), [products]);
  const favoriteRecipeIds = useMemo(() => new Set(recipes.map((recipe) => recipe.id)), [recipes]);

  const value: FavoriteContextValue = {
    products,
    recipes,
    favoriteIds,
    favoriteRecipeIds,
    addProduct: (product) => {
      const normalizedProduct = normalizeFavoriteProduct(product);

      setProducts((current) => {
        if (current.some((item) => item.id === normalizedProduct.id)) {
          return current;
        }

        return [normalizedProduct, ...current];
      });
    },
    removeProduct: (id) => {
      setProducts((current) => current.filter((product) => product.id !== id));
    },
    toggleProduct: (product) => {
      const normalizedProduct = normalizeFavoriteProduct(product);

      setProducts((current) => {
        if (current.some((item) => item.id === normalizedProduct.id)) {
          return current.filter((item) => item.id !== normalizedProduct.id);
        }

        return [normalizedProduct, ...current];
      });
    },
    addRecipe: (recipe) => {
      const normalizedRecipe = normalizeFavoriteRecipe(recipe);

      setRecipes((current) => {
        if (current.some((item) => item.id === normalizedRecipe.id)) {
          return current;
        }

        return [normalizedRecipe, ...current];
      });
    },
    removeRecipe: (id) => {
      setRecipes((current) => current.filter((recipe) => recipe.id !== id));
    },
    toggleRecipe: (recipe) => {
      const normalizedRecipe = normalizeFavoriteRecipe(recipe);

      setRecipes((current) => {
        if (current.some((item) => item.id === normalizedRecipe.id)) {
          return current.filter((item) => item.id !== normalizedRecipe.id);
        }

        return [normalizedRecipe, ...current];
      });
    }
  };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoriteProvider");
  }

  return context;
}
