import dishIndexData from "@/data/dish-index.json";
import recipeTemplateData from "@/data/recipe-templates.json";
import type {
  DishSuggestion,
  GenerateRecipeRequest,
  Recipe,
  RecipeIngredient,
  RecipeStep
} from "@/types";

type DishIndexEntry = {
  id: string;
  name: string;
  cuisine: string;
  summary: string;
  requiredIngredients: string[];
  optionalIngredients: string[];
  estimatedTimeMinutes: number;
  difficulty: "easy" | "medium" | "advanced";
};

type RecipeTemplate = {
  dishName: string;
  cuisine: string;
  summary: string;
  difficulty: "easy" | "medium" | "advanced";
  baseServings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};

const dishIndex = dishIndexData as DishIndexEntry[];
const recipeTemplates = recipeTemplateData as RecipeTemplate[];

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function roundQuantity(quantity: number) {
  return Number(quantity.toFixed(quantity < 10 ? 1 : 0));
}

export async function suggestDishesFromIngredients(
  ingredients: string[],
  limit = 4
): Promise<DishSuggestion[]> {
  const normalized = ingredients.map(normalizeName);

  const ranked = dishIndex
    .map((dish) => {
      const matched = dish.requiredIngredients.filter((ingredient) =>
        normalized.includes(normalizeName(ingredient))
      );
      const missing = dish.requiredIngredients.filter(
        (ingredient) => !normalized.includes(normalizeName(ingredient))
      );
      const optionalHits = dish.optionalIngredients.filter((ingredient) =>
        normalized.includes(normalizeName(ingredient))
      );
      const matchScore = matched.length / dish.requiredIngredients.length;

      return {
        id: dish.id,
        name: dish.name,
        cuisine: dish.cuisine,
        summary: dish.summary,
        estimatedTimeMinutes: dish.estimatedTimeMinutes,
        difficulty: dish.difficulty,
        matchScore,
        matchedIngredients: matched,
        missingIngredients: missing,
        reasons: [
          matched.length > 0
            ? `Matches key ingredients: ${matched.join(", ")}.`
            : "This dish currently has no core ingredient match.",
          missing.length > 0
            ? `Still missing: ${missing.join(", ")}.`
            : "You already have all required ingredients.",
          optionalHits.length > 0
            ? `Optional ingredients also available: ${optionalHits.join(", ")}.`
            : `Estimated cooking time is about ${dish.estimatedTimeMinutes} minutes.`
        ]
      } satisfies DishSuggestion;
    })
    .sort((left, right) => right.matchScore - left.matchScore);

  const shortlisted = ranked.filter((dish) => dish.matchScore > 0).slice(0, limit);
  return shortlisted.length > 0 ? shortlisted : ranked.slice(0, limit);
}

export async function generateRecipeFromDish(
  input: GenerateRecipeRequest
): Promise<Recipe> {
  const template = recipeTemplates.find(
    (entry) => normalizeName(entry.dishName) === normalizeName(input.dishName)
  );

  if (!template) {
    return {
      dishName: input.dishName,
      summary: "Mock recipe scaffold generated for a custom dish search.",
      cuisine: "Flexible",
      servings: input.servings,
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      difficulty: "easy",
      ingredients: [
        {
          name: "Main ingredient",
          normalizedName: "main ingredient",
          quantity: input.servings,
          unit: "portion"
        }
      ],
      steps: [
        { order: 1, instruction: "Prepare the ingredients and season to taste." },
        { order: 2, instruction: "Cook using your preferred method until done." },
        { order: 3, instruction: "Plate and adjust final seasoning before serving." }
      ],
      youtubeSearchKeyword: `${input.dishName} recipe`
    };
  }

  const scale = input.servings / template.baseServings;

  return {
    dishName: template.dishName,
    summary: template.summary,
    cuisine: template.cuisine,
    servings: input.servings,
    prepTimeMinutes: template.prepTimeMinutes,
    cookTimeMinutes: template.cookTimeMinutes,
    difficulty: template.difficulty,
    ingredients: template.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: roundQuantity(ingredient.quantity * scale)
    })),
    steps: template.steps,
    youtubeSearchKeyword: `${template.dishName} tutorial`
  };
}
