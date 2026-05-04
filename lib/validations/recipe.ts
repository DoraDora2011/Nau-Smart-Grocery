import { z } from "zod";

export const recipeRequestSchema = z.object({
  dishName: z.string().min(2),
  servings: z.number().int().min(1).max(50),
  allergies: z.array(z.string().min(1)).optional()
});
