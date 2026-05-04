import { z } from "zod";

import dishIndexData from "@/data/dish-index.json";
import type { DishSuggestion, SuggestDishesResult } from "@/types";

const GEMMA_SERVICE_URL = process.env.GEMMA_SERVICE_URL;

const gemmaSuggestResponseSchema = z.object({
  suggestions: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      cuisine: z.string().min(1),
      summary: z.string().min(1),
      matchScore: z.number().min(0).max(1),
      estimatedTimeMinutes: z.number().int().positive(),
      difficulty: z.enum(["easy", "medium", "advanced"]),
      matchedIngredients: z.array(z.string()),
      missingIngredients: z.array(z.string()),
      reasons: z.array(z.string()).min(1)
    })
  )
});

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

const dishIndex = dishIndexData as DishIndexEntry[];

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildReasons(
  matchedIngredients: string[],
  missingIngredients: string[],
  optionalHits: string[],
  dish: DishIndexEntry
) {
  const reasons: string[] = [];

  if (matchedIngredients.length > 0) {
    reasons.push(`Matches key ingredients: ${matchedIngredients.join(", ")}.`);
  }

  if (optionalHits.length > 0) {
    reasons.push(`Also aligns with optional ingredients: ${optionalHits.join(", ")}.`);
  }

  if (missingIngredients.length === 0) {
    reasons.push("You already have all required core ingredients for this dish.");
  } else {
    reasons.push(`You only need ${missingIngredients.join(", ")} to complete the core set.`);
  }

  reasons.push(`This is a ${dish.difficulty} dish that takes about ${dish.estimatedTimeMinutes} minutes.`);

  return reasons;
}

function buildMockSuggestions(
  confirmedIngredients: string[],
  limit = 4
): SuggestDishesResult {
  const normalizedIngredients = Array.from(
    new Set(confirmedIngredients.map(normalizeName).filter(Boolean))
  );

  const rankedSuggestions = dishIndex
    .map((dish) => {
      const matchedIngredients = dish.requiredIngredients.filter((ingredient) =>
        normalizedIngredients.includes(normalizeName(ingredient))
      );
      const missingIngredients = dish.requiredIngredients.filter(
        (ingredient) => !normalizedIngredients.includes(normalizeName(ingredient))
      );
      const optionalHits = dish.optionalIngredients.filter((ingredient) =>
        normalizedIngredients.includes(normalizeName(ingredient))
      );
      const baseScore = matchedIngredients.length / dish.requiredIngredients.length;
      const optionalBoost =
        dish.optionalIngredients.length > 0
          ? optionalHits.length / dish.optionalIngredients.length / 10
          : 0;
      const matchScore = Math.min(1, Number((baseScore + optionalBoost).toFixed(2)));

      return {
        id: dish.id,
        name: dish.name,
        cuisine: dish.cuisine,
        summary: dish.summary,
        matchScore,
        estimatedTimeMinutes: dish.estimatedTimeMinutes,
        difficulty: dish.difficulty,
        matchedIngredients,
        missingIngredients,
        reasons: buildReasons(matchedIngredients, missingIngredients, optionalHits, dish)
      } satisfies DishSuggestion;
    })
    .sort((left, right) => right.matchScore - left.matchScore);

  const suggestions = rankedSuggestions
    .filter((item) => item.matchScore > 0)
    .slice(0, limit);

  return {
    suggestions: suggestions.length > 0 ? suggestions : rankedSuggestions.slice(0, limit),
    fallbackUsed: true,
    model: "gemma-mock-wrapper",
    ingredientCount: normalizedIngredients.length
  };
}

export async function suggestDishesWithGemma(
  confirmedIngredients: string[],
  limit = 4
): Promise<SuggestDishesResult> {
  if (!GEMMA_SERVICE_URL) {
    return buildMockSuggestions(confirmedIngredients, limit);
  }

  // GEMMA SERVICE WRAPPER: dish suggestion and recipe reasoning
  const response = await fetch(`${GEMMA_SERVICE_URL.replace(/\/$/, "")}/suggest-dishes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      confirmedIngredients,
      limit
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Gemma suggest dishes request failed with status ${response.status}`);
  }

  const payload = gemmaSuggestResponseSchema.parse((await response.json()) as unknown);

  return {
    suggestions: payload.suggestions,
    fallbackUsed: false,
    model: "gemma-service-wrapper",
    ingredientCount: confirmedIngredients.length
  };
}
