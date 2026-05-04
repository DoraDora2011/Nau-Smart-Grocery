import { NextResponse } from "next/server";

import { suggestDishesFromIngredients } from "@/lib/services/gemmaService";
import { suggestDishesSchema } from "@/lib/validations/dish";
import type { SuggestDishesResponse } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = suggestDishesSchema.parse(body);
    const suggestions = await suggestDishesFromIngredients(parsed.ingredients, parsed.limit);

    const response: SuggestDishesResponse = {
      success: true,
      data: {
        suggestions,
        fallbackUsed: true,
        model: "mock-dish-suggestions",
        ingredientCount: parsed.ingredients.length
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DISH_SUGGESTION_FAILED",
          message: "Unable to suggest dishes"
        }
      },
      { status: 400 }
    );
  }
}
