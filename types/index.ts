export type ScanInputSource = "camera" | "upload";
export type IngredientSource = "scan" | "manual" | "dish";
export type RecipeDifficulty = "easy" | "medium" | "advanced";

export interface Ingredient {
  id: string;
  name: string;
  normalizedName: string;
  source: IngredientSource;
  confidence?: number;
  category?: string;
}

export interface DetectedIngredient {
  name: string;
  confidence: number;
  category: string;
}

export interface DishSuggestion {
  id: string;
  name: string;
  cuisine: string;
  summary: string;
  matchScore: number;
  estimatedTimeMinutes: number;
  difficulty: RecipeDifficulty;
  matchedIngredients: string[];
  missingIngredients: string[];
  reasons: string[];
}

export interface RecipeIngredient {
  name: string;
  normalizedName: string;
  quantity: number;
  unit: string;
  required?: boolean;
  optional?: boolean;
  notes?: string;
  matchedProductId?: string;
  recipeDisplayAmount?: string;
  source?: "recipe" | "scan" | "manual";
}

export interface RecipeStep {
  order: number;
  instruction: string;
  durationMinutes?: number;
}

export interface Recipe {
  dishName: string;
  summary: string;
  cuisine: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: RecipeDifficulty;
  ingredients: RecipeIngredient[];
  seasonings?: RecipeIngredient[];
  steps: RecipeStep[];
  notes?: string[];
  youtubeSearchKeyword?: string;
}

export interface UpsellSuggestion {
  name: string;
  normalizedName: string;
  quantity: number;
  unit: string;
  reason: string;
}

export interface GroceryProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  slug?: string;
  category: string;
  image: string;
  unit: string;
  price: number;
  tags: string[];
}

export interface GroceryCategory {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  sourceIngredient: string;
  image: string;
  cartQuantity?: number;
  recipeAmount?: number;
  recipeDisplayAmount?: string;
  sellUnitLabel?: string;
  displayUnit?: string;
  source?: "recipe" | "scan" | "manual" | "catalog";
}

export interface CartIngredientInput {
  name: string;
  normalizedName: string;
  quantity: number;
  unit: string;
  matchedProductId?: string;
  recipeDisplayAmount?: string;
  source?: "recipe" | "scan" | "manual";
}

export interface ScanResult {
  ingredients: Ingredient[];
  ingredientsDetected: DetectedIngredient[];
  model: string;
  warnings: string[];
  fallbackUsed: boolean;
  input: {
    fileName: string;
    mimeType: string;
    source: ScanInputSource;
  };
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ScanRouteSuccessResponse {
  success: true;
  data: ScanResult;
}

export interface ScanRouteErrorResponse {
  success: false;
  error: ApiError;
}

export type ScanRouteResponse = ScanRouteSuccessResponse | ScanRouteErrorResponse;

export interface SuggestDishesRequest {
  confirmedIngredients: string[];
  limit?: number;
}

export interface SuggestDishesResult {
  suggestions: DishSuggestion[];
  fallbackUsed: boolean;
  model: string;
  ingredientCount: number;
}

export interface SuggestDishesSuccessResponse {
  success: true;
  data: SuggestDishesResult;
}

export interface SuggestDishesErrorResponse {
  success: false;
  error: ApiError;
}

export type SuggestDishesResponse =
  | SuggestDishesSuccessResponse
  | SuggestDishesErrorResponse;

export interface GenerateRecipeRequest {
  dishName: string;
  servings: number;
  confirmedIngredients?: string[];
  allergies?: string[];
}

export interface GenerateRecipeResult {
  isSafe: boolean;
  dishName: string;
  servings: number;
  allergyWarnings: string[];
  conflictingIngredients: string[];
  saferAlternatives: string[];
  recipe: Recipe | null;
  upsellSuggestions: UpsellSuggestion[];
  fallbackUsed: boolean;
  model: string;
}

export interface GenerateRecipeSuccessResponse {
  success: true;
  data: GenerateRecipeResult;
}

export interface GenerateRecipeErrorResponse {
  success: false;
  error: ApiError;
}

export type GenerateRecipeResponse =
  | GenerateRecipeSuccessResponse
  | GenerateRecipeErrorResponse;

export interface MapCartRequest {
  recipeIngredients: RecipeIngredient[];
}

export interface MapCartResponse {
  success: boolean;
  data: {
    items: CartItem[];
    unmatchedIngredients: string[];
  };
}

export interface CartAddRequest {
  ingredients: CartIngredientInput[];
}

export interface CartAddResult {
  items: CartItem[];
  unmatchedIngredients: string[];
}

export interface CartAddSuccessResponse {
  success: true;
  data: CartAddResult;
}

export interface CartAddErrorResponse {
  success: false;
  error: ApiError;
}

export type CartAddResponse = CartAddSuccessResponse | CartAddErrorResponse;
