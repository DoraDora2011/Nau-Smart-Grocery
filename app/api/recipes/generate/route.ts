import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateRecipeWithGemma } from "@/lib/ai/gemmaRecipe";
import { defaultLocale, translations } from "@/lib/i18n/translations";
import { recipeRequestSchema } from "@/lib/validations/recipe";
import type { GenerateRecipeResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let locale = defaultLocale;

  try {
    const body = await request.json();
    const parsed = recipeRequestSchema.parse(body);
    locale = parsed.locale ?? defaultLocale;
    const result = await generateRecipeWithGemma(
      parsed.dishName,
      parsed.servings,
      parsed.allergies ?? [],
      locale
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
            message: translations[locale].api.invalidRecipe
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
          message: translations[locale].api.recipeFailed
        }
      },
      { status: 500 }
    );
  }
}
