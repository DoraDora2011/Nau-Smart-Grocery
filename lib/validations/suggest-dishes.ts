import { z } from "zod";

export const suggestDishesRequestSchema = z.object({
  confirmedIngredients: z.array(z.string().min(1)).min(1).max(30),
  limit: z.number().int().min(1).max(8).optional(),
  locale: z.enum(["vi", "en"]).optional()
});
