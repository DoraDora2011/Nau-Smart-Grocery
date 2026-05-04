import type { ProductCatalogItem } from "@/data/productCatalog";

type UnitKind = "weight" | "volume" | "piece" | "small" | "unknown";

export type RecipeAmountInput = {
  quantity: number;
  unit: string;
  recipeDisplayAmount?: string;
};

export type CartQuantityResult = {
  cartQuantity: number;
  recipeAmount: number;
  recipeUnit: string;
  recipeDisplayAmount: string;
};

const MAX_AUTO_CART_QUANTITY = 20;

function normalizeUnit(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
}

function clampCartQuantity(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 1;
  }

  return Math.min(Math.max(1, Math.ceil(value)), MAX_AUTO_CART_QUANTITY);
}

function parseRecipeUnit(quantity: number, unit: string) {
  const normalizedUnit = normalizeUnit(unit);

  if (
    [
      "muong",
      "muong canh",
      "muong ca phe",
      "tbsp",
      "tablespoon",
      "tablespoons",
      "tsp",
      "teaspoon",
      "teaspoons",
      "it",
      "mot it",
      "vua du"
    ].includes(normalizedUnit)
  ) {
    return { kind: "small" as UnitKind, baseAmount: quantity };
  }

  if (["kg", "kilogram", "kilograms"].includes(normalizedUnit)) {
    return { kind: "weight" as UnitKind, baseAmount: quantity * 1000 };
  }

  if (["g", "gram", "grams"].includes(normalizedUnit)) {
    return { kind: "weight" as UnitKind, baseAmount: quantity };
  }

  if (["l", "lit", "liter", "litre", "liters", "litres"].includes(normalizedUnit)) {
    return { kind: "volume" as UnitKind, baseAmount: quantity * 1000 };
  }

  if (["ml", "milliliter", "millilitre", "milliliters", "millilitres"].includes(normalizedUnit)) {
    return { kind: "volume" as UnitKind, baseAmount: quantity };
  }

  if (["qua", "cai", "piece", "pieces", "pcs"].includes(normalizedUnit)) {
    return { kind: "piece" as UnitKind, baseAmount: quantity };
  }

  return { kind: "unknown" as UnitKind, baseAmount: quantity };
}

function parseProductPackage(product: ProductCatalogItem) {
  const normalizedPackageUnit = normalizeUnit(product.packageUnit);

  if (normalizedPackageUnit === "kg") {
    return { kind: "weight" as UnitKind, baseSize: product.packageSize * 1000 };
  }

  if (normalizedPackageUnit === "g") {
    return { kind: "weight" as UnitKind, baseSize: product.packageSize };
  }

  if (["l", "liter", "litre"].includes(normalizedPackageUnit)) {
    return { kind: "volume" as UnitKind, baseSize: product.packageSize * 1000 };
  }

  if (normalizedPackageUnit === "ml") {
    return { kind: "volume" as UnitKind, baseSize: product.packageSize };
  }

  if (["piece", "pieces", "pcs", "item"].includes(normalizedPackageUnit)) {
    return { kind: "piece" as UnitKind, baseSize: product.packageSize };
  }

  return { kind: "unknown" as UnitKind, baseSize: product.packageSize };
}

export function calculateCartQuantityFromRecipeIngredient(
  ingredient: RecipeAmountInput,
  product?: ProductCatalogItem | null
): CartQuantityResult {
  const recipeAmount = Number.isFinite(ingredient.quantity) && ingredient.quantity > 0
    ? ingredient.quantity
    : 1;
  const recipeUnit = ingredient.unit || "item";
  const recipeDisplayAmount =
    ingredient.recipeDisplayAmount?.trim() || `${recipeAmount}${recipeUnit}`;

  if (!product) {
    return {
      cartQuantity: 1,
      recipeAmount,
      recipeUnit,
      recipeDisplayAmount
    };
  }

  const recipe = parseRecipeUnit(recipeAmount, recipeUnit);
  const productPackage = parseProductPackage(product);

  if (recipe.kind === "small") {
    return {
      cartQuantity: 1,
      recipeAmount,
      recipeUnit,
      recipeDisplayAmount
    };
  }

  if (
    recipe.kind !== "unknown" &&
    recipe.kind === productPackage.kind &&
    productPackage.baseSize > 0
  ) {
    return {
      cartQuantity: clampCartQuantity(recipe.baseAmount / productPackage.baseSize),
      recipeAmount,
      recipeUnit,
      recipeDisplayAmount
    };
  }

  return {
    cartQuantity: 1,
    recipeAmount,
    recipeUnit,
    recipeDisplayAmount
  };
}
