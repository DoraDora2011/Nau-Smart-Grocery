import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { suggestDishesWithGemma } from "@/lib/ai/gemmaSuggestDishes";
import { defaultLocale, translations } from "@/lib/i18n/translations";
import { suggestDishesRequestSchema } from "@/lib/validations/suggest-dishes";
import type { SuggestDishesResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let locale = defaultLocale;

  try {
    const body = await request.json();
    const parsed = suggestDishesRequestSchema.parse(body);
    locale = parsed.locale ?? defaultLocale;
    const result = await suggestDishesWithGemma(
      parsed.confirmedIngredients,
      parsed.limit,
      locale
    );

    const response: Extract<SuggestDishesResponse, { success: true }> = {
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
            code: "INVALID_SUGGEST_DISHES_REQUEST",
            message: translations[locale].api.invalidSuggest
          }
        } satisfies Extract<SuggestDishesResponse, { success: false }>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SUGGEST_DISHES_FAILED",
          message: translations[locale].api.suggestFailed
        }
      } satisfies Extract<SuggestDishesResponse, { success: false }>,
      { status: 500 }
    );
  }
}
