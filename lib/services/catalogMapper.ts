import {
  productCatalog,
  type ProductCatalogItem
} from "@/data/productCatalog";
import {
  calculateCartQuantityFromRecipeIngredient
} from "@/lib/services/cartQuantity";
import type { CartIngredientInput, CartItem, RecipeIngredient } from "@/types";

type IngredientForCart = Pick<
  CartIngredientInput,
  "name" | "normalizedName" | "quantity" | "unit" | "matchedProductId" | "recipeDisplayAmount" | "source"
>;

const recipeMatchCategories = new Set([
  "vegetable",
  "meat",
  "egg-dairy",
  "rice-noodle",
  "seasoning"
]);

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

function isFoodCatalogProduct(product: ProductCatalogItem) {
  return recipeMatchCategories.has(product.category);
}

function getProductById(productId?: string) {
  if (!productId) {
    return null;
  }

  return productCatalog.find((product) => product.id === productId) ?? null;
}

function scoreProductForIngredient(product: ProductCatalogItem, ingredientName: string) {
  const normalizedIngredient = normalizeName(ingredientName);
  const normalizedProductName = normalizeName(product.name);
  const normalizedAliases = product.aliases.map(normalizeName).filter(Boolean);

  if (!normalizedIngredient) {
    return 0;
  }

  if (normalizedAliases.some((alias) => alias === normalizedIngredient)) {
    return 120;
  }

  if (normalizedProductName === normalizedIngredient) {
    return 110;
  }

  if (normalizedAliases.some((alias) => alias && normalizedIngredient.includes(alias))) {
    return 90;
  }

  if (normalizedAliases.some((alias) => alias && alias.includes(normalizedIngredient))) {
    return 80;
  }

  if (normalizedProductName.includes(normalizedIngredient)) {
    return 70;
  }

  return 0;
}

function findProductForIngredient(ingredient: IngredientForCart) {
  const directProduct = getProductById(ingredient.matchedProductId);

  if (directProduct) {
    return directProduct;
  }

  const ingredientNames = [ingredient.normalizedName, ingredient.name].filter(Boolean);
  const candidates = productCatalog
    .map((product) => {
      const score = Math.max(
        ...ingredientNames.map((ingredientName) =>
          scoreProductForIngredient(product, ingredientName)
        )
      );

      const categoryBonus = isFoodCatalogProduct(product) ? 20 : 0;
      const collectionBonus = product.collection === "category" ? 8 : 0;

      return {
        product,
        score: score + categoryBonus + collectionBonus
      };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score);

  return candidates[0]?.product ?? null;
}

function createFallbackCartItem(ingredient: IngredientForCart): CartItem {
  const fallbackQuantity = 1;
  const recipeDisplayAmount =
    ingredient.recipeDisplayAmount || `${ingredient.quantity}${ingredient.unit}`;
  const normalizedIngredientName = normalizeName(ingredient.name) || "ingredient";

  return {
    id: `unmatched-${normalizedIngredientName}`,
    productId: `unmatched-${normalizedIngredientName}`,
    productName: ingredient.name,
    brand: "Nấu Smart Grocery",
    category: "Chưa có trong catalog",
    quantity: fallbackQuantity,
    unit: "sản phẩm",
    estimatedPrice: 10000,
    sourceIngredient: ingredient.name,
    image: "/catalog/fallback-product.png",
    cartQuantity: fallbackQuantity,
    recipeAmount: ingredient.quantity,
    recipeDisplayAmount,
    sellUnitLabel: "sản phẩm",
    displayUnit: "1 sản phẩm",
    source: ingredient.source ?? "manual"
  };
}

function createCartItem(product: ProductCatalogItem, ingredient: IngredientForCart): CartItem {
  const quantityResult = calculateCartQuantityFromRecipeIngredient(
    {
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      recipeDisplayAmount: ingredient.recipeDisplayAmount
    },
    product
  );

  return {
    id: `${product.id}-${normalizeName(ingredient.name)}`,
    productId: product.id,
    productName: product.name,
    brand: "Nấu Smart Grocery",
    category: product.categoryLabel,
    quantity: quantityResult.cartQuantity,
    unit: product.sellUnitLabel,
    estimatedPrice: product.price,
    sourceIngredient: ingredient.name,
    image: product.image,
    cartQuantity: quantityResult.cartQuantity,
    recipeAmount: quantityResult.recipeAmount,
    recipeDisplayAmount: quantityResult.recipeDisplayAmount,
    sellUnitLabel: product.sellUnitLabel,
    displayUnit: product.displayUnit,
    source: ingredient.source ?? "manual"
  };
}

function mapGenericIngredientsToCart(ingredients: IngredientForCart[]) {
  const items: CartItem[] = [];
  const unmatchedIngredients: string[] = [];

  ingredients.forEach((ingredient) => {
    if (ingredient.source === "recipe" || ingredient.source === "scan") {
      unmatchedIngredients.push(ingredient.name);
      items.push(createFallbackCartItem(ingredient));
      return;
    }

    const product = findProductForIngredient(ingredient);

    if (!product) {
      unmatchedIngredients.push(ingredient.name);
      items.push(createFallbackCartItem(ingredient));
      return;
    }

    items.push(createCartItem(product, ingredient));
  });

  return {
    items,
    unmatchedIngredients
  };
}

export function mapRecipeIngredientsToCart(recipeIngredients: RecipeIngredient[]) {
  return mapGenericIngredientsToCart(
    recipeIngredients.map((ingredient) => ({
      ...ingredient,
      source: ingredient.source ?? "recipe"
    }))
  );
}

export function mapIngredientInputsToCart(ingredients: CartIngredientInput[]) {
  return mapGenericIngredientsToCart(ingredients);
}
