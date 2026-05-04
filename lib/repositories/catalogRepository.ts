import catalogData from "@/data/catalog.json";
import categoryData from "@/data/categories.json";
import ingredientMapData from "@/data/ingredient-product-map.json";
import type { GroceryCategory, GroceryProduct } from "@/types";

export function getCatalog(): GroceryProduct[] {
  return catalogData as GroceryProduct[];
}

export function getCategories(): GroceryCategory[] {
  return categoryData as GroceryCategory[];
}

export function getIngredientProductMap(): Record<string, string[]> {
  return ingredientMapData as Record<string, string[]>;
}

export function getProductsByIds(ids: string[]) {
  const idSet = new Set(ids);
  return getCatalog().filter((product) => idSet.has(product.id));
}

export function getProductsByCategory(categoryName: string) {
  return getCatalog().filter((product) => product.category === categoryName);
}

export function getCategoryBySlug(slug: string) {
  return getCategories().find((category) => category.slug === slug) ?? null;
}
