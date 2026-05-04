import { z } from "zod";

export const suggestDishesSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(1),
  limit: z.number().int().min(1).max(8).optional()
});

export const generateRecipeSchema = z.object({
  dishName: z.string().min(2),
  servings: z.number().int().min(1).max(12),
  confirmedIngredients: z.array(z.string().min(1)).optional()
});
