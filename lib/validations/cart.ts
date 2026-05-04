import { z } from "zod";

export const recipeIngredientSchema = z.object({
  name: z.string().min(1),
  normalizedName: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  optional: z.boolean().optional(),
  notes: z.string().optional(),
  matchedProductId: z.string().min(1).optional(),
  recipeDisplayAmount: z.string().min(1).optional(),
  source: z.enum(["recipe", "scan", "manual"]).optional()
});

export const mapCartSchema = z.object({
  recipeIngredients: z.array(recipeIngredientSchema).min(1)
});
