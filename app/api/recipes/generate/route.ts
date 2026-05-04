import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateRecipeWithGemma } from "@/lib/ai/gemmaRecipe";
import { recipeRequestSchema } from "@/lib/validations/recipe";
import type { GenerateRecipeResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = recipeRequestSchema.parse(body);
    const result = await generateRecipeWithGemma(
      parsed.dishName,
      parsed.servings,
      parsed.allergies ?? []
    );

    const response: Extract<GenerateRecipeResponse, { success: true }> = {
      success: true,
      data: result
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_RECIPE_REQUEST",
            message: "Dish name and servings are required to generate a recipe."
          }
        } satisfies Extract<GenerateRecipeResponse, { success: false }>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RECIPE_GENERATION_FAILED",
          message: "Unable to generate a recipe right now."
        }
      },
      { status: 500 }
    );
  }
}
