import { z } from "zod";

export const cartIngredientInputSchema = z.object({
  name: z.string().min(1),
  normalizedName: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  matchedProductId: z.string().min(1).optional(),
  recipeDisplayAmount: z.string().min(1).optional(),
  source: z.enum(["recipe", "scan", "manual"]).optional()
});

export const cartAddRequestSchema = z.object({
  ingredients: z.array(cartIngredientInputSchema).min(1)
});
